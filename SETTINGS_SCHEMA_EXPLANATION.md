# User Preferences Settings Schema - Comprehensive Explanation

## Overview

User preference settings allow personalized configuration of the application experience, improving usability, accessibility, and user satisfaction. These settings persist across sessions and provide a consistent, customized experience.

---

## 1. Newsletter & Communications

### `subscribeToNewsletter: boolean`

**Purpose**: Controls whether the user receives newsletter emails from the system.

**System Impact**:

- **Email Service Integration**: When `true`, the user is added to the newsletter distribution list
- **Marketing Campaigns**: Allows targeted email campaigns for feature updates, school announcements, and educational content
- **Communication Preferences**: Respects user choice for promotional/marketing communications
- **Database**: Already exists in User model as `subscribeToOurNewsLetter`

**Use Cases**:

- User can opt-in/opt-out of newsletters
- Admin can segment users for targeted communications
- Compliance with email marketing regulations (opt-in/opt-out)

**Implementation Points**:

- Email sending logic checks this flag before sending newsletters
- Profile settings form allows toggling this preference
- Should be moved from Bio tab to Settings tab for better organization

---

## 2. Display Preferences

### `theme: "light" | "dark" | "system"`

**Purpose**: Controls the visual theme (color scheme) of the application.

**System Impact**:

- **ThemeProvider Integration**: Currently uses `next-themes` but theme choice is not persisted
- **User Experience**: Users can set preferred theme that persists across sessions
- **Accessibility**: Dark mode reduces eye strain in low-light environments
- **Consistency**: Theme preference is remembered, so users don't need to change it every session

**Current Implementation**:

- Theme is controlled via `next-themes` but stored only in localStorage (not database)
- Theme selector exists in UserButton dropdown menu
- Setting persists only in browser, not across devices

**With Settings Schema**:

- Theme preference stored in database
- Syncs across all user devices
- Can be set from Settings page
- Applies immediately when changed

**Use Cases**:

- User prefers dark mode for evening use
- Different devices sync the same theme preference
- System theme option respects OS-level dark/light mode

**Implementation Points**:

```typescript
// On app load, check user preferences
const userTheme = user.settings?.theme || "system";
setTheme(userTheme);

// When user changes theme in settings
await updateUserSettings({ theme: newTheme });
setTheme(newTheme); // Apply immediately
```

---

### `itemsPerPage: 10 | 25 | 50 | 100`

**Purpose**: Controls how many items are displayed per page in data tables.

**System Impact**:

- **Data Tables**: Currently hardcoded to 10 items per page (see `data-table.tsx` line 51)
- **Performance**: More items = more data loaded, but fewer page navigations
- **User Preference**: Power users might want 50-100 items, casual users prefer 10-25
- **Network Efficiency**: Fewer page requests for users who prefer more items per page

**Current Implementation**:

- All tables default to `pageSize: 10` (hardcoded)
- No user preference system exists
- Users must navigate through multiple pages for large datasets

**With Settings Schema**:

- User preference applied to all tables automatically
- Consistent pagination across the entire application
- Stored in database, persists across sessions
- Can be changed in Settings, applies to all future table views

**Use Cases**:

- Teacher viewing 100+ students wants 50 items per page
- Admin managing departments prefers 25 items for better overview
- Student viewing grades prefers 10 items for focused view
- Reduces clicks for users who frequently browse large datasets

**Implementation Points**:

```typescript
// In data-table.tsx
const userPreferences = await getUserSettings();
const defaultPageSize = userPreferences?.itemsPerPage || 10;

const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: defaultPageSize, // Use user preference
});

// Tables affected:
// - Students table
// - Teachers table
// - Courses table
// - Departments table
// - Attendance records
// - Grades/Score tables
// - Users table
// - All other data tables in the system
```

**Benefits**:

- Reduces repetitive pagination clicks
- Improves workflow efficiency
- Personalized experience per user role

---

### `dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD" | "DD MMM YYYY"`

**Purpose**: Controls how dates are displayed throughout the application.

**System Impact**:

- **Date Display**: Currently uses mixed formats (some use `moment`, some hardcoded)
- **Internationalization**: Different regions prefer different date formats
- **Consistency**: All dates in the app use the same format per user preference
- **Readability**: Users see dates in their familiar format

**Current Implementation**:

- Dates use `moment().format("DD-MM-YYYY")` in some places
- Dates use `moment().format("MM/DD/YYYY")` in others
- No consistent formatting across the application
- Examples found:
  - `moment(createdAt).format("DD-MM-YYYY: HH:mm")` (StudentScoreDetail)
  - `moment(student.birthDate).format("MM/DD/YYYY")` (student transformer)
  - `moment(row.date).format("DD-MM-YY")` (attendance columns)

**With Settings Schema**:

- Single source of truth for date formatting
- User sees dates in their preferred format everywhere
- Regional preferences respected (UK: DD/MM/YYYY, US: MM/DD/YYYY)
- Consistent user experience

**Use Cases**:

- Ghanaian users prefer DD/MM/YYYY (common in Africa/Europe)
- International users might prefer YYYY-MM-DD (ISO standard)
- Readable format "DD MMM YYYY" (e.g., "15 Jan 2024") for better UX
- All dates in student records, attendance, grades, enrollment dates use user's preferred format

**Implementation Points**:

```typescript
// Create a date formatter utility
export const formatDate = (
  date: Date | string,
  userDateFormat: DateFormatType
) => {
  const momentDate = moment(date);

  switch (userDateFormat) {
    case "DD/MM/YYYY":
      return momentDate.format("DD/MM/YYYY");
    case "MM/DD/YYYY":
      return momentDate.format("MM/DD/YYYY");
    case "YYYY-MM-DD":
      return momentDate.format("YYYY-MM-DD");
    case "DD MMM YYYY":
      return momentDate.format("DD MMM YYYY");
    default:
      return momentDate.format("DD/MM/YYYY");
  }
};

// Usage throughout the app
const userSettings = await getUserSettings();
const formattedDate = formatDate(student.birthDate, userSettings.dateFormat);
```

**Affected Areas**:

- Student birth dates
- Enrollment dates
- Attendance dates
- Grade submission dates
- Course creation dates
- All date displays in tables
- All date displays in forms
- Dashboard date displays

---

### `timezone: string (optional)`

**Purpose**: Stores the user's timezone preference for accurate date/time display.

**System Impact**:

- **Time Display**: Converts server times (likely UTC) to user's local timezone
- **Accuracy**: Ensures dates/times are displayed in user's actual timezone
- **Scheduling**: Important for attendance, deadlines, and time-sensitive operations
- **International Users**: Critical for users in different timezones

**Current Implementation**:

- No timezone handling currently
- Dates/times likely displayed in server timezone or UTC
- No conversion for user's location

**With Settings Schema**:

- User sets their timezone (e.g., "Africa/Accra", "America/New_York")
- All timestamps converted to user's timezone before display
- Accurate time representation for all users globally

**Use Cases**:

- Teacher in Ghana (GMT) sees attendance marked at correct local time
- Admin in different timezone sees accurate timestamps
- Students see assignment due dates in their local time
- System announcements show correct local time

**Implementation Points**:

```typescript
// Timezone conversion utility
import { formatInTimeZone } from "date-fns-tz";

export const formatDateTime = (
  date: Date,
  userTimezone: string,
  dateFormat: DateFormatType
) => {
  if (!userTimezone) {
    // Fallback to server timezone or UTC
    return formatDate(date, dateFormat);
  }

  // Convert to user's timezone
  const userDate = formatInTimeZone(date, userTimezone, "yyyy-MM-dd HH:mm:ss");
  return formatDate(new Date(userDate), dateFormat);
};
```

**Benefits**:

- Accurate time representation
- Better user experience for international users
- Prevents confusion about when events occurred
- Important for audit trails and attendance records

---

## 3. Notification Preferences

### `emailNotifications: object`

**Purpose**: Granular control over which types of emails the user receives.

**Properties**:

- `grades: boolean` - Notifications when grades are posted/updated
- `attendance: boolean` - Notifications about attendance records
- `assignments: boolean` - Notifications about new assignments or due dates
- `announcements: boolean` - Notifications about school/system announcements
- `systemUpdates: boolean` - Notifications about system updates, maintenance, etc.

**System Impact**:

- **Email Service**: Email sending logic checks these flags before sending
- **User Control**: Users can opt-out of specific notification types
- **Reduced Email Fatigue**: Users only receive emails they care about
- **Compliance**: Respects user preferences for communication

**Current Implementation**:

- No granular notification preferences exist
- All-or-nothing email subscription
- No control over notification types

**With Settings Schema**:

- Fine-grained control over email notifications
- Users can disable specific types (e.g., turn off system updates but keep grades)
- Reduces email overload
- Improves user satisfaction

**Use Cases**:

- Student wants grade notifications but not system updates
- Teacher wants attendance alerts but not announcements
- Admin wants all notifications enabled
- Parent/Guardian wants only important announcements

**Implementation Points**:

```typescript
// Email sending service
export const sendNotificationEmail = async (
  userId: string,
  notificationType:
    | "grades"
    | "attendance"
    | "assignments"
    | "announcements"
    | "systemUpdates",
  emailData: EmailData
) => {
  const userSettings = await getUserSettings(userId);

  // Check if user has enabled this notification type
  if (!userSettings.emailNotifications[notificationType]) {
    return; // User has disabled this notification type
  }

  // Check notification frequency
  if (userSettings.notificationFrequency === "never") {
    return; // User has disabled all notifications
  }

  // Send email based on frequency preference
  if (userSettings.notificationFrequency === "realtime") {
    await sendEmailImmediately(userId, emailData);
  } else if (userSettings.notificationFrequency === "daily") {
    await queueForDailyDigest(userId, emailData);
  } else if (userSettings.notificationFrequency === "weekly") {
    await queueForWeeklyDigest(userId, emailData);
  }
};
```

**Benefits**:

- Reduced email spam
- Better user experience
- Respects user preferences
- More targeted communication

---

### `notificationFrequency: "realtime" | "daily" | "weekly" | "never"`

**Purpose**: Controls how often notification emails are sent.

**System Impact**:

- **Email Batching**: Daily/Weekly options batch notifications into digests
- **Server Load**: Reduces email server load by batching
- **User Preference**: Users who prefer fewer emails can choose daily/weekly
- **Real-time Updates**: Users who want immediate updates can choose "realtime"

**Options**:

- **realtime**: Emails sent immediately when events occur
- **daily**: All notifications batched into a daily digest email
- **weekly**: All notifications batched into a weekly summary email
- **never**: No email notifications (but might still show in-app notifications)

**Use Cases**:

- Busy teacher prefers weekly digest instead of constant emails
- Student wants real-time grade notifications
- Parent prefers daily summary of their child's activities
- Admin wants real-time system update notifications

**Implementation Points**:

```typescript
// Notification queue system
export const queueNotification = async (
  userId: string,
  notification: Notification
) => {
  const userSettings = await getUserSettings(userId);

  if (userSettings.notificationFrequency === "realtime") {
    await sendEmailImmediately(userId, notification);
  } else if (userSettings.notificationFrequency === "daily") {
    await addToDailyDigestQueue(userId, notification);
  } else if (userSettings.notificationFrequency === "weekly") {
    await addToWeeklyDigestQueue(userId, notification);
  }
  // 'never' - don't queue at all
};

// Daily digest job (runs once per day)
export const sendDailyDigests = async () => {
  const users = await getUsersWithDailyDigestPreference();

  for (const user of users) {
    const notifications = await getQueuedNotifications(user.id, "daily");
    if (notifications.length > 0) {
      await sendDigestEmail(user.id, notifications, "daily");
    }
  }
};

// Weekly digest job (runs once per week)
export const sendWeeklyDigests = async () => {
  const users = await getUsersWithWeeklyDigestPreference();

  for (const user of users) {
    const notifications = await getQueuedNotifications(user.id, "weekly");
    if (notifications.length > 0) {
      await sendDigestEmail(user.id, notifications, "weekly");
    }
  }
};
```

**Benefits**:

- Reduces email overload
- Improves email engagement
- Better server resource management
- User-controlled communication frequency

---

## 4. Application Preferences

### `compactMode: boolean`

**Purpose**: Controls whether the UI uses a compact (denser) or comfortable (spacious) layout.

**System Impact**:

- **UI Density**: Compact mode reduces padding, margins, and spacing
- **Information Density**: More information visible on screen without scrolling
- **Accessibility**: Some users prefer more spacing, others prefer compact views
- **Table Display**: Tables show more rows with less spacing

**Current Implementation**:

- No compact mode option exists
- UI uses standard spacing throughout

**With Settings Schema**:

- User can toggle compact mode
- Applies to tables, cards, lists, and forms
- More data visible on screen
- Better for power users and smaller screens

**Use Cases**:

- Power user wants to see more data at once
- User with smaller screen wants more content visible
- User prefers less white space for efficiency
- Admin viewing large datasets wants compact table view

**Implementation Points**:

```typescript
// CSS classes based on compact mode
const tableClassName = userSettings.compactMode
  ? "compact-table" // Smaller padding, tighter spacing
  : "comfortable-table"; // Standard spacing

// Component styling
<div className={cn(
  "p-4", // Standard padding
  userSettings.compactMode && "p-2" // Compact padding
)}>
  {/* Content */}
</div>
```

**CSS Implementation**:

```css
.compact-mode table td {
  padding: 0.5rem; /* Instead of 1rem */
}

.compact-mode .card {
  padding: 1rem; /* Instead of 1.5rem */
}

.compact-mode .button {
  padding: 0.375rem 0.75rem; /* Instead of 0.5rem 1rem */
}
```

**Benefits**:

- More information visible
- Better for data-heavy workflows
- Improved efficiency for power users
- Better use of screen space

---

### `showTips: boolean`

**Purpose**: Controls whether helpful tips and onboarding messages are displayed.

**System Impact**:

- **User Onboarding**: New users see tips, experienced users can hide them
- **UI Clutter**: Hiding tips reduces visual clutter for experienced users
- **Help System**: Tips guide users through features
- **User Experience**: New users get help, experienced users get clean interface

**Current Implementation**:

- No tip system currently implemented
- No onboarding guidance

**With Settings Schema**:

- Toggle to show/hide tips
- Tips appear for new features or complex workflows
- Users can re-enable tips if needed
- Improves onboarding experience

**Use Cases**:

- New user sees tips explaining how to use features
- Experienced user hides tips for cleaner interface
- User can re-enable tips when learning new features
- Admin can see tips for newly added admin features

**Implementation Points**:

```typescript
// Tip component
export const Tip = ({ id, message }: { id: string; message: string }) => {
  const userSettings = await getUserSettings();

  if (!userSettings.showTips) {
    return null; // Don't show tips if user has disabled them
  }

  return (
    <div className="tip-banner">
      <p>{message}</p>
      <Button onClick={() => dismissTip(id)}>Dismiss</Button>
    </div>
  );
};

// Usage
<Tip
  id="student-import-tip"
  message="You can bulk import students using the CSV upload feature"
/>
```

**Tip Areas**:

- How to create a new student
- How to mark attendance
- How to upload grades
- How to export data
- Keyboard shortcuts
- Feature announcements

**Benefits**:

- Better onboarding for new users
- Less clutter for experienced users
- User-controlled help system
- Improved user adoption of features

---

## System-Wide Benefits

### 1. **Personalization**

- Each user gets a customized experience
- Settings persist across devices and sessions
- Improved user satisfaction

### 2. **Accessibility**

- Theme options for visual preferences
- Compact mode for different screen sizes
- Date format for regional preferences

### 3. **Efficiency**

- Items per page reduces clicks
- Compact mode shows more data
- Notification preferences reduce email overload

### 4. **User Control**

- Users control their communication preferences
- Users control their display preferences
- Users control their notification preferences

### 5. **Scalability**

- Settings can be extended with new preferences
- Easy to add new notification types
- Easy to add new display options

### 6. **Internationalization**

- Date format for different regions
- Timezone support for global users
- Regional preferences respected

---

## Implementation Priority

### Phase 1 (High Impact, Low Effort)

1. **subscribeToNewsletter** - Already in database, just move to settings
2. **theme** - Already has UI, just need to persist to database
3. **itemsPerPage** - High impact on user experience, easy to implement

### Phase 2 (Medium Impact, Medium Effort)

4. **dateFormat** - Requires updating all date displays, but high value
5. **emailNotifications** - Requires email service updates
6. **notificationFrequency** - Requires digest system implementation

### Phase 3 (Lower Priority)

7. **timezone** - Important for international users
8. **compactMode** - Requires CSS and component updates
9. **showTips** - Requires tip system implementation

---

## Database Schema Considerations

### Option 1: Add to User Model

```prisma
model User {
  // ... existing fields
  theme String? @default("system")
  itemsPerPage Int? @default(10)
  dateFormat String? @default("DD/MM/YYYY")
  timezone String?
  compactMode Boolean? @default(false)
  showTips Boolean? @default(true)
  emailNotifications Json? // Store as JSON
  notificationFrequency String? @default("realtime")
}
```

### Option 2: Separate UserPreferences Model (Recommended)

```prisma
model UserPreferences {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  theme String @default("system")
  itemsPerPage Int @default(10)
  dateFormat String @default("DD/MM/YYYY")
  timezone String?
  compactMode Boolean @default(false)
  showTips Boolean @default(true)
  emailNotifications Json @default("{}")
  notificationFrequency String @default("realtime")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  // ... existing fields
  preferences UserPreferences?
}
```

**Benefits of Separate Model**:

- Cleaner separation of concerns
- Easier to extend with new preferences
- Better performance (only load when needed)
- Can have default preferences without creating record

---

## Conclusion

User preference settings provide a foundation for a personalized, accessible, and efficient user experience. Each setting addresses specific user needs and improves the overall usability of the system. Implementation should be phased, starting with high-impact, low-effort settings and gradually adding more sophisticated features.
