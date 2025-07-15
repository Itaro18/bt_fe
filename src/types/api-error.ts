export interface APIErrorResponse {
    status: false;
    code: number;
    message: string;
    name?: string;
}

export interface CustomError {
    response?: {
        data?: {
            message?: string;
            code?: number;
            name?: string;
            status?: boolean;
        };
        status?: number;
    };
    message: string;
}
