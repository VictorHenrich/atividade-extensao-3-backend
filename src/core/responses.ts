import { Response } from "./interfaces.js";


abstract class BaseResponse<T>{
    private readonly message: string;
    private readonly statusCode: number;
    private readonly data: T;

    constructor({
        data,
        message,
        statusCode
    }: Response<T>){
        this.data = data;

        this.message = message;

        this.statusCode = statusCode;
    }

    public toJSON(): string{
        return JSON.stringify({
            message: this.message,
            status: this.statusCode,
            data: this.data
        });
    }
}

interface ErrorData{
    errorMessage: string | string[]
}

export class SuccessResponse<T> extends BaseResponse<T | null>{
    constructor(data: T | void = undefined){
        super({
            data: data || null, 
            message: "OK",
            statusCode: 200
        });
    }
}

export class ErrorResponse<T> extends BaseResponse<ErrorData>{
    constructor(...errors: Error[]){
        super({
            data: {
                errorMessage: errors.length == 1 ? errors[0].message: errors.map(error => error.message)
            },
            message: "ERROR",
            statusCode: 500
        });
    }
}

export class NotFoundResponse extends BaseResponse<ErrorData>{
    constructor(...messages: string[]){
        super({
            data: {
                errorMessage: messages.length == 1 ? messages[0]: messages
            },
            message: "NOT_FOUND",
            statusCode: 404
        });
    }
}

export class UnauthorizedResponse extends BaseResponse<ErrorData | null>{
    constructor(...errors: Error[]){
        super({
            data: errors.length ? {
                errorMessage: errors.length == 1 ? errors[0].message: errors.map(error => error.message)
            } : null,
            message: "UNAUTHORIZED",
            statusCode: 401
        });
    }
}