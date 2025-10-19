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

export function isValidPercentage(value: number): boolean {
  return value >= 0 && value <= 100;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Helper to map keys and remove undefined values
export function mapToDbColumns(
  obj: Record<string, any>,
  fieldMap: Record<string, string>
) {
  const dbObj: Record<string, any> = {};
  for (const key in obj) {
    if (obj[key] !== undefined && fieldMap[key]) {
      dbObj[fieldMap[key]] = obj[key];
    }
  }
  return dbObj;
}
