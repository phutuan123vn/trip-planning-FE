
export const ErrorCode = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
    BAD_REQUEST: "BAD_REQUEST",
} as const;


export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

export type ApiError<T> = {
    code: ErrorCodeType;
    message: string;
    details?: T;
}


export interface ValidationErrorDetails {
    field: string;
    message: string;
}

export type ValidationError = ApiError<ValidationErrorDetails[]>;

export type UnauthorizedError = ApiError<string>;

export type ForbiddenError = ApiError<string>;

export type NotFoundError = ApiError<string>;

export type InternalServerError = ApiError<string>;

export type UnknownError = ApiError<string>;

export type BadRequestError = ApiError<string>;