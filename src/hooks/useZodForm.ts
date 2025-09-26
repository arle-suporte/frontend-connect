import { useState } from "react";
import { ZodSchema } from "zod";

export function useZodForm<T extends Record<string, any>>(
  schema: ZodSchema<T>,
  initialValues: T
) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (fields?: (keyof T)[]) => {
    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};

      if (Array.isArray(result.error?.issues)) {
        result.error.issues.forEach((issue) => {
          const field = issue.path?.[0] as keyof T;
          if (!fields || fields.includes(field)) {
            newErrors[field as string] = issue.message;
          }
        });
      }

      setErrors((prev) =>
        fields && fields.length > 0 ? { ...prev, ...newErrors } : newErrors
      );

      return Object.keys(newErrors).length === 0;
    }

    if (fields && fields.length > 0) {
      setErrors((prev) => {
        const copy = { ...prev };
        fields.forEach((f) => delete copy[f as string]);
        return copy;
      });
    } else {
      setErrors({});
    }

    return true;
  };

  const setField = (field: keyof T, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  /**
   * Permite injetar erros vindos do backend
   */
  const setBackendErrors = (
    backendErrors: Record<string, string | string[]>
  ) => {
    const formatted: Record<string, string> = {};

    Object.entries(backendErrors).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formatted[key] = value.join(" ");
      } else if (typeof value === "string") {
        formatted[key] = value;
      }
    });

    setErrors((prev) => ({ ...prev, ...formatted }));
  };

  return {
    formData,
    setFormData,
    setField,
    errors,
    validate,
    setBackendErrors,
  };
}
