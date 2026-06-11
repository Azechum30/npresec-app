export type ExportColumnDef = {
  key: string;
  label: string;
};

export type ExportRegistryEntry = {
  exportKey: string;
  label: string;
  columns: ExportColumnDef[];
};

export const EXPORT_COLUMN_REGISTRY: ExportRegistryEntry[] = [
  {
    exportKey: "payments",
    label: "Payments",
    columns: [
      { key: "Student Name", label: "Student Name" },
      { key: "Student ID", label: "Student ID" },
      { key: "Service Type", label: "Service Type" },
      { key: "Amount Paid", label: "Amount Paid" },
      { key: "Payment Channel", label: "Payment Channel" },
      { key: "Currency", label: "Currency" },
      { key: "Bank", label: "Bank" },
      { key: "Brand", label: "Brand" },
      { key: "Transaction ID", label: "Transaction ID" },
      { key: "Transaction Fee", label: "Transaction Fee" },
      { key: "Transaction Reference", label: "Transaction Reference" },
      { key: "Payment Date", label: "Payment Date" },
      { key: "Country Code", label: "Country Code" },
      { key: "Student Email", label: "Student Email" },
    ],
  },
  {
    exportKey: "attendance",
    label: "Attendance",
    columns: [
      { key: "Student ID", label: "Student ID" },
      { key: "Full Name", label: "Full Name" },
      { key: "Class", label: "Class" },
      { key: "Date", label: "Date" },
      { key: "Status", label: "Status" },
    ],
  },
  {
    exportKey: "staff",
    label: "Staff",
    columns: [
      { key: "Staff ID", label: "Staff ID" },
      { key: "Name", label: "Name" },
      { key: "Staff Type", label: "Staff Type" },
      { key: "Staff Category", label: "Staff Category" },
      { key: "Gender", label: "Gender" },
      { key: "Marital Status", label: "Marital Status" },
      { key: "Date of Birth", label: "Date of Birth" },
      { key: "Academic Qualification", label: "Academic Qualification" },
      { key: "Phone Number", label: "Phone Number" },
      { key: "Email", label: "Email" },
      { key: "Ghana Card Number", label: "Ghana Card Number" },
      { key: "Registered Number", label: "Registered Number" },
      { key: "SSNIT Number", label: "SSNIT Number" },
      { key: "Current Rank", label: "Current Rank" },
      { key: "Date of First Appointment", label: "Date of First Appointment" },
    ],
  },
  {
    exportKey: "classes",
    label: "Classes",
    columns: [
      { key: "Class Code", label: "Class Code" },
      { key: "Class Name", label: "Class Name" },
      { key: "Laerning Area", label: "Learning Area" },
      { key: "Level", label: "Level" },
      { key: "CreateAt", label: "Created At" },
      { key: "Courses", label: "Courses" },
    ],
  },
  {
    exportKey: "courses",
    label: "Courses",
    columns: [
      { key: "Course Code", label: "Course Code" },
      { key: "Course Title", label: "Course Title" },
      { key: "Credits", label: "Credits" },
      { key: "Departments", label: "Departments" },
      { key: "Classes", label: "Classes" },
      { key: "Created Date", label: "Created Date" },
      { key: "staffs", label: "Staff" },
    ],
  },
  {
    exportKey: "departments",
    label: "Departments",
    columns: [
      { key: "Department Code", label: "Department Code" },
      { key: "Department Name", label: "Department Name" },
      { key: "Created Date", label: "Created Date" },
      { key: "Head of Department", label: "Head of Department" },
      { key: "Classes", label: "Classes" },
    ],
  },
  {
    exportKey: "students",
    label: "Students",
    columns: [
      { key: "Student ID", label: "Student ID" },
      { key: "First Name", label: "First Name" },
      { key: "Last Name", label: "Last Name" },
      { key: "Middle Name", label: "Middle Name" },
      { key: "Gender", label: "Gender" },
      { key: "Birth Date", label: "Birth Date" },
      { key: "Class", label: "Class" },
      { key: "Department", label: "Department" },
      { key: "Batch", label: "Batch" },
      { key: "Current Level", label: "Current Level" },
    ],
  },
  {
    exportKey: "student-scores",
    label: "Student Scores",
    columns: [
      { key: "Student Number", label: "Student Number" },
      { key: "Last Name", label: "Last Name" },
      { key: "First Name", label: "First Name" },
      { key: "Middle Name", label: "Middle Name" },
      { key: "Gender", label: "Gender" },
      { key: "Class", label: "Class" },
      { key: "Department", label: "Department" },
      { key: "Form", label: "Form" },
      { key: "Subject", label: "Subject" },
      { key: "Score", label: "Score" },
      { key: "Max Score", label: "Max Score" },
      { key: "Weight", label: "Weight" },
      { key: "Semester", label: "Semester" },
      { key: "Academic Year", label: "Academic Year" },
      { key: "Assessment Type", label: "Assessment Type" },
      { key: "Date Graded", label: "Date Graded" },
    ],
  },
  {
    exportKey: "service-fees",
    label: "Service Fees",
    columns: [
      { key: "Name", label: "Name" },
      { key: "Price", label: "Price" },
      { key: "Status", label: "Status" },
      { key: "Capacity", label: "Capacity" },
      { key: "Period", label: "Period" },
      { key: "PaymentCount", label: "Payment Count" },
      { key: "Deadline", label: "Deadline" },
    ],
  },
  {
    exportKey: "placement-list",
    label: "Placement List",
    columns: [
      { key: "INDEX NUMBER", label: "Index Number" },
      { key: "FULLNAME", label: "Full Name" },
      { key: "GENDER", label: "Gender" },
      { key: "CONTACT", label: "Contact" },
      { key: "DATE OF BIRTH", label: "Date of Birth" },
      { key: "COURSE", label: "Course" },
      { key: "STATUS", label: "Status" },
    ],
  },
  {
    exportKey: "admitted-list",
    label: "Admitted List",
    columns: [
      { key: "INDEX NUMBER", label: "Index Number" },
      { key: "ENROLLMENT CODE", label: "Enrollment Code" },
      { key: "FULLNAME", label: "Full Name" },
      { key: "GENDER", label: "Gender" },
      { key: "CONTACT", label: "Contact" },
      { key: "DATE OF BIRTH", label: "Date of Birth" },
      { key: "COURSE", label: "Course" },
    ],
  },
  {
    exportKey: "rooms",
    label: "Rooms",
    columns: [
      { key: "Room Code", label: "Room Code" },
      { key: "Assigned House", label: "Assigned House" },
      { key: "Assigned Gender", label: "Assigned Gender" },
      { key: "Bed Capacity", label: "Bed Capacity" },
    ],
  },
];

export function getRegistryEntry(exportKey: string): ExportRegistryEntry | undefined {
  return EXPORT_COLUMN_REGISTRY.find((e) => e.exportKey === exportKey);
}
