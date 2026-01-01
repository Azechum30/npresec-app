import {
  BulkCreateStudentsSchema,
  BulkCreateStudentsType,
  StudentSchema,
} from "@/lib/validation";

// Define return types for the validation function
export interface ValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  data?: BulkCreateStudentsType;
  errors?: ValidationError[];
  summary?: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    errorCount: number;
  };
}

/**
 * Validates and transforms CSV student data using the BulkCreateStudentsSchema
 * @param studentsData - The raw student data from CSV upload
 * @returns ValidationResult with detailed error reporting or valid data
 */
export const validateAndTransformStudentsData = (
  studentsData: BulkCreateStudentsType,
): ValidationResult => {
  try {
    const errors: ValidationError[] = [];
    const validStudents: any[] = [];

    // First, validate the overall structure
    const structureValidation =
      BulkCreateStudentsSchema.safeParse(studentsData);

    if (!structureValidation.success) {
      // Handle top-level structure errors
      structureValidation.error.errors.forEach((error) => {
        errors.push({
          row: 0,
          field: error.path.join(".") || "data",
          value: "N/A",
          message: error.message,
        });
      });

      return {
        success: false,
        errors,
        summary: {
          totalRows: Array.isArray(studentsData?.data)
            ? studentsData.data.length
            : 0,
          validRows: 0,
          errorRows: 0,
          errorCount: errors.length,
        },
      };
    }

    // Validate each student record individually for detailed error reporting
    studentsData.data.forEach((student, index) => {
      const rowNumber = index + 1; // 1-based row numbering for user-friendly display

      const validation = StudentSchema.safeParse(student);

      if (!validation.success) {
        // Process each validation error
        validation.error.errors.forEach((error) => {
          const fieldPath = error.path.join(".");
          const fieldValue = getNestedValue(student, error.path);

          errors.push({
            row: rowNumber,
            field: fieldPath || "unknown",
            value: fieldValue,
            message: formatErrorMessage(error.message, fieldPath),
          });
        });
      } else {
        // Student is valid, add to valid students array
        validStudents.push(validation.data);
      }
    });

    // Determine if validation was successful
    const isSuccess = errors.length === 0;
    const totalRows = studentsData.data.length;
    const errorRows = new Set(errors.map((e) => e.row)).size;
    const validRows = totalRows - errorRows;

    if (isSuccess) {
      return {
        success: true,
        data: {
          data: validStudents,
        },
        summary: {
          totalRows,
          validRows,
          errorRows: 0,
          errorCount: 0,
        },
      };
    } else {
      return {
        success: false,
        errors,
        summary: {
          totalRows,
          validRows,
          errorRows,
          errorCount: errors.length,
        },
      };
    }
  } catch (error) {
    // Handle unexpected errors
    return {
      success: false,
      errors: [
        {
          row: 0,
          field: "system",
          value: "N/A",
          message: `Unexpected validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      summary: {
        totalRows: 0,
        validRows: 0,
        errorRows: 0,
        errorCount: 1,
      },
    };
  }
};

/**
 * Helper function to get nested object values by path
 */
function getNestedValue(obj: any, path: (string | number)[]): any {
  try {
    return path.reduce((current, key) => current?.[key], obj);
  } catch {
    return undefined;
  }
}

/**
 * Helper function to format error messages with more user-friendly field names
 */
function formatErrorMessage(message: string, fieldPath: string): string {
  const fieldDisplayNames: Record<string, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    middleName: "Middle Name",
    birthDate: "Birth Date",
    gender: "Gender",
    email: "Email Address",
    phone: "Phone Number",
    address: "Address",
    nationality: "Nationality",
    religion: "Religion",
    photoURL: "Photo URL",
    classId: "Class ID",
    dateEnrolled: "Date Enrolled",
    graduationDate: "Graduation Date",
    currentLevel: "Current Level",
    status: "Status",
    departmentId: "Department ID",
    previousSchool: "Previous School",
    guardianName: "Guardian Name",
    guardianPhone: "Guardian Phone",
    guardianEmail: "Guardian Email",
    guardianAddress: "Guardian Address",
    guardianRelation: "Guardian Relation",
  };

  const displayName = fieldDisplayNames[fieldPath] || fieldPath;

  // Customize specific error messages
  if (message.includes("required")) {
    return `${displayName} is required`;
  } else if (message.includes("email")) {
    return `${displayName} must be a valid email address`;
  } else if (message.includes("regex") || message.includes("alphabets")) {
    return `${displayName} can only contain letters and spaces`;
  } else if (message.includes("number")) {
    return `${displayName} must be a valid number`;
  } else if (message.includes("date")) {
    return `${displayName} must be a valid date`;
  } else if (message.includes("enum")) {
    return `${displayName} contains an invalid value. Please check the allowed options`;
  } else {
    return `${displayName}: ${message}`;
  }
}

/**
 * Helper function to generate a user-friendly error summary
 */
export const generateErrorSummary = (result: ValidationResult): string => {
  if (result.success) {
    return `✅ Validation successful! All ${result.summary?.validRows} student records are valid.`;
  }

  const { summary, errors } = result;
  if (!summary || !errors) {
    return "❌ Validation failed with unknown errors.";
  }

  let summaryText = `❌ Validation failed:\n`;
  summaryText += `- Total rows: ${summary.totalRows}\n`;
  summaryText += `- Valid rows: ${summary.validRows}\n`;
  summaryText += `- Rows with errors: ${summary.errorRows}\n`;
  summaryText += `- Total errors: ${summary.errorCount}\n\n`;

  // Group errors by row for better readability
  const errorsByRow = errors.reduce(
    (acc, error) => {
      if (!acc[error.row]) {
        acc[error.row] = [];
      }
      acc[error.row].push(error);
      return acc;
    },
    {} as Record<number, ValidationError[]>,
  );

  summaryText += `Detailed errors:\n`;
  Object.entries(errorsByRow)
    .sort(([a], [b]) => Number(a) - Number(b))
    .forEach(([rowNum, rowErrors]) => {
      if (Number(rowNum) === 0) {
        summaryText += `Global errors:\n`;
      } else {
        summaryText += `Row ${rowNum}:\n`;
      }

      rowErrors.forEach((error) => {
        summaryText += `  • ${error.message}`;
        if (
          error.value !== undefined &&
          error.value !== null &&
          error.value !== "N/A"
        ) {
          summaryText += ` (received: "${error.value}")`;
        }
        summaryText += `\n`;
      });
    });

  return summaryText;
};

/**
 * Helper function to check if a specific field has errors across rows
 */
export const getFieldErrors = (
  result: ValidationResult,
  fieldName: string,
): ValidationError[] => {
  if (!result.errors) return [];
  return result.errors.filter((error) => error.field === fieldName);
};

/**
 * Helper function to get all unique error messages for quick reference
 */
export const getUniqueErrorMessages = (result: ValidationResult): string[] => {
  if (!result.errors) return [];
  return Array.from(new Set(result.errors.map((error) => error.message)));
};
