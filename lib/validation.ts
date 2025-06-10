export interface ValidationError {
    field: string;
    message: string;
}

export const validateRequired = (value: string | null | undefined, fieldName: string): ValidationError | null => {
    if (value === null || value === undefined || value.trim() === '') {
        return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
};

export const validateLength = (
    value: string,
    fieldName: string,
    min: number,
    max: number
): ValidationError | null => {
    if (!value || value.trim() === '') {
        return { field: fieldName, message: `${fieldName} must be at least ${min} characters long` };
    }

    if (value.length < min) {
        return { field: fieldName, message: `${fieldName} must be at least ${min} characters long` };
    }

    if (value.length > max) {
        return { field: fieldName, message: `${fieldName} must not exceed ${max} characters` };
    }

    return null;
};

export const validateNumeric = (value: string, fieldName: string): ValidationError | null => {
    if (!value || value.trim() === '') {
        return { field: fieldName, message: `${fieldName} must contain only numbers` };
    }

    if (!/^\d+$/.test(value)) {
        return { field: fieldName, message: `${fieldName} must contain only numbers` };
    }

    return null;
};