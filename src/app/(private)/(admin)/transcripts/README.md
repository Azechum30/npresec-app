# Transcript Generation System

This system allows you to generate, view, and manage student transcripts based on their grades.

## Features

- ✅ Generate transcripts for students by academic year and semester
- ✅ Calculate GPA (both semester and cumulative)
- ✅ Preview transcripts before generating
- ✅ Store official transcripts
- ✅ View all transcripts for a student
- ✅ Delete transcripts

## How It Works

### 1. Data Flow

```
Grades Table → Transcript Service → Transcript Data → Transcript Table
```

### 2. Grade Calculation

The system:

1. Fetches all grades for a student in a specific period
2. Groups grades by course
3. Calculates weighted average for each course
4. Converts to letter grades (A, B, C, D, F)
5. Calculates GPA and academic standing

### 3. GPA Calculation

- **Semester GPA**: Based on courses in the current semester
- **Cumulative GPA**: Includes all previous semesters
- **Formula**: `GPA = Total Grade Points / Total Credits`

### 4. Grade Points

| Grade | Percentage | Grade Points |
| ----- | ---------- | ------------ |
| A     | 90-100     | 4.0          |
| A-    | 85-89      | 3.5          |
| B+    | 80-84      | 3.5          |
| B     | 75-79      | 3.0          |
| B-    | 70-74      | 2.5          |
| C+    | 65-69      | 2.5          |
| C     | 60-64      | 2.0          |
| C-    | 55-59      | 1.5          |
| D+    | 50-54      | 1.5          |
| D     | 45-49      | 1.0          |
| D-    | 40-44      | 0.5          |
| F     | 0-39       | 0.0          |

## Usage

### Generate a Transcript

```typescript
import { useGenerateTranscript } from "./_hooks/use-generate-transcript";

function MyComponent() {
  const { generateTranscript, isGenerating } = useGenerateTranscript();

  const handleGenerate = async () => {
    const result = await generateTranscript({
      studentId: "student-id",
      academicYear: 2024,
      semester: "First", // optional
      isOfficial: false, // optional
    });

    if (result.success) {
      console.log("Transcript generated:", result.transcript);
    }
  };

  return (
    <button onClick={handleGenerate} disabled={isGenerating}>
      Generate Transcript
    </button>
  );
}
```

### Preview a Transcript

```typescript
import { usePreviewTranscript } from "./_hooks/use-preview-transcript";

function MyComponent() {
  const { previewTranscript, isLoading } = usePreviewTranscript();

  const handlePreview = async () => {
    const result = await previewTranscript({
      studentId: "student-id",
      academicYear: 2024,
      semester: "First",
    });

    if (result.success) {
      console.log("Preview data:", result.transcriptData);
    }
  };

  return (
    <button onClick={handlePreview} disabled={isLoading}>
      Preview Transcript
    </button>
  );
}
```

### Fetch Student Transcripts

```typescript
import { useFetchTranscripts } from "./_hooks/use-fetch-transcripts";

function MyComponent({ studentId }: { studentId: string }) {
  const { transcripts, isLoading } = useFetchTranscripts(studentId);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        transcripts.map((transcript) => (
          <div key={transcript.id}>
            <p>{transcript.academicYear}</p>
            <p>GPA: {transcript.gpa}</p>
          </div>
        ))
      )}
    </div>
  );
}
```

## Server Actions

### `generateTranscriptAction`

Generates and saves a new transcript.

**Parameters:**

- `studentId`: Student ID
- `academicYear`: Academic year (e.g., 2024)
- `semester`: Semester (optional)
- `isOfficial`: Whether to mark as official (optional)

**Returns:**

```typescript
{
  transcript?: Transcript;
  error?: string;
}
```

### `previewTranscriptAction`

Generates transcript data without saving.

**Parameters:** Same as `generateTranscriptAction`

**Returns:**

```typescript
{
  student?: Student;
  transcriptData?: TranscriptData;
  gpa?: number;
  totalCredits?: number;
  error?: string;
}
```

### `getTranscriptAction`

Fetches a specific transcript by ID.

**Parameters:**

- `transcriptId`: Transcript ID

**Returns:**

```typescript
{
  transcript?: Transcript;
  error?: string;
}
```

### `getStudentTranscriptsAction`

Fetches all transcripts for a student.

**Parameters:**

- `studentId`: Student ID

**Returns:**

```typescript
{
  transcripts?: Transcript[];
  error?: string;
}
```

### `deleteTranscriptAction`

Deletes a transcript.

**Parameters:**

- `transcriptId`: Transcript ID

**Returns:**

```typescript
{
  transcript?: Transcript;
  error?: string;
}
```

## Transcript Data Structure

```typescript
interface TranscriptData {
  courses: CourseGrade[];
  summary: TranscriptSummary;
  metadata: TranscriptMetadata;
}

interface CourseGrade {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  grade: string;
  gradePoints: number;
  assessmentBreakdown: AssessmentBreakdown[];
  instructor?: string;
  remarks?: string;
}

interface TranscriptSummary {
  semesterGPA: number;
  cumulativeGPA: number;
  totalCredits: number;
  totalGradePoints: number;
  academicStanding: string;
  coursesCompleted: number;
  coursesPassed: number;
  coursesFailed: number;
}
```

## Permissions

The following permissions are required:

- `generate:transcripts` - Generate new transcripts
- `view:transcripts` - View transcripts
- `delete:transcripts` - Delete transcripts

## Notes

- Transcripts are unique per student, academic year, and semester
- Exempted assessments (`isExempt: true`) are excluded from calculations
- Retake assessments are included in calculations
- Cumulative GPA includes all previous semesters
- Transcripts can be marked as official for verification purposes

## Next Steps

To add PDF generation:

1. Install `@react-pdf/renderer`:

   ```bash
   npm install @react-pdf/renderer
   ```

2. Create a PDF template component
3. Add PDF generation to the server actions
4. Store PDF URLs in the `pdfUrl` field

Example:

```typescript
import { Document, Page, Text, View } from "@react-pdf/renderer";

const TranscriptPDF = ({ transcriptData }) => (
  <Document>
    <Page>
      <View>
        <Text>Transcript</Text>
        {/* Add your transcript layout here */}
      </View>
    </Page>
  </Document>
);
```





