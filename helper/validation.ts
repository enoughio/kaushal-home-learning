export function validateFiles(
  files: Record<string, any>,
  MAX_FILE_SIZE_MB: number
): { error?: string; message?: string } {
  const MAX_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  for (const key in files) {
    const file = files[key];
    // Format: remove "File" suffix & capitalize first letter
    const readableName = key.charAt(0).toUpperCase() + key.slice(1);

    // Check existence
    if (!file || !(file instanceof File)) {
      return {
        error: "FILE_REQUIRED",
        message: `${readableName} file is required`,
      };
    }

    // Check file size (in MB)
    if (file.size > MAX_SIZE_BYTES) {
      return {
        error: "FILE_TOO_LARGE",
        message: `${readableName} file size must not exceed ${MAX_FILE_SIZE_MB}MB`,
      };
    }
  }

  // Everything passed
  return {};
}

type ValidationResult = { errMessage?: string };

export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): ValidationResult {
  for (const field of requiredFields) {
    const value = data[field];

    // Check for undefined, null, or empty string after trim
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0)
    ) {
      const readableField =
        field.charAt(0).toUpperCase() +
        field.slice(1).replace(/([A-Z])/g, " $1");
      return {
        errMessage: `Missing required field: ${readableField.trim()}`,
      };
    }
  }
  return {};
}

export interface FieldLimits {
  [key: string]: number;
}

/**
 * Trims strings and validates field-specific and global max lengths.
 * Returns sanitized object or the first error encountered.
 */
export function sanitizeAndValidate<T extends Record<string, any>>(
  obj: T,
  fieldLimits: Record<string, number>,
  globalMaxLength = 1000 // reject extremely large payloads
): { sanitized: T; error?: { field: string; message: string } } {
  const sanitized: any = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      const trimmed = value.trim();

      if (trimmed.length == 0) continue;

      // Global max length check
      if (trimmed.length > globalMaxLength) {
        return {
          sanitized,
          error: {
            field: key,
            message: `field "${key}" is too long, max allowed is ${globalMaxLength}`,
          },
        };
      }

      sanitized[key] = trimmed;

      // Field-specific max length check
      const maxLength = fieldLimits[key];
      if (maxLength && trimmed.length > maxLength) {
        return {
          sanitized,
          error: {
            field: key,
            message: `field ${key} exceeds maximum length of ${maxLength}`,
          },
        };
      }
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      const nestedResult = sanitizeAndValidate(
        value,
        fieldLimits,
        globalMaxLength
      );
      if (nestedResult.error) return nestedResult;
      sanitized[key] = nestedResult.sanitized;
    } else {
      sanitized[key] = value;
    }
  }

  return { sanitized };
}

// 2025-10-19 ✅
export function isValidISODate(value: string): boolean {
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoRegex.test(value)) return false;

  const date = new Date(value);
  return !isNaN(date.getTime());
}

// Assuming only Indian users
export function isValidIndianPhone(phone: string): boolean {
  // Remove spaces or hyphens if entered
  const cleaned = phone.replace(/\s|-/g, "");
  // Check if it has exactly 10 digits and starts with 6-9
  return /^[6-9]\d{9}$/.test(cleaned);
}

// Assuming only Indian users (6 digit pincode starting with a non zero number)
export function isValidIndianPincode(pincode: string): boolean {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode);
}

export function isValidPercentage(value: unknown): boolean {
  const num = Number(value);

  // Check if it's a real number and between 0–100
  return !isNaN(num) && isFinite(num) && num >= 0 && num <= 100;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateAssignmentData(data: {
  studentId: string;
  title: string;
  subject: string;
  dueDate?: string;
  maxMarks?: string;
}): { isValid: boolean; message?: string } {
  const { studentId, title, subject, dueDate, maxMarks } = data;

  if (!studentId || isNaN(Number(studentId))) {
    return { isValid: false, message: "Valid student ID is required" };
  }

  if (!title || title.trim().length === 0) {
    return { isValid: false, message: "Assignment title is required" };
  }

  if (title.length > 200) {
    return { isValid: false, message: "Assignment title must not exceed 200 characters" };
  }

  if (!subject || subject.trim().length === 0) {
    return { isValid: false, message: "Subject is required" };
  }

  if (subject.length > 100) {
    return { isValid: false, message: "Subject must not exceed 100 characters" };
  }

  if (dueDate && !isValidISODate(dueDate)) {
    return { isValid: false, message: "Due date must be in YYYY-MM-DD format" };
  }

  if (dueDate) {
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDateObj < today) {
      return { isValid: false, message: "Due date cannot be in the past" };
    }
  }

  if (maxMarks && (isNaN(Number(maxMarks)) || Number(maxMarks) <= 0 || Number(maxMarks) > 1000)) {
    return { isValid: false, message: "Max marks must be a number between 1 and 1000" };
  }

  return { isValid: true };
}

// Helper to map keys and remove undefined values
// export function mapToDbColumns(
//   obj: Record<string, any>,
//   fieldMap: Record<string, string>
// ) {
//   const dbObj: Record<string, any> = {};
//   for (const key in obj) {
//     if (obj[key] !== undefined && fieldMap[key]) {
//       dbObj[fieldMap[key]] = obj[key];
//     }
//   }
//   return dbObj;
// }
