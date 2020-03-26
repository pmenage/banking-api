export class ErrorHandler extends Error {
    public statusCode: number;
    public message: any;

    constructor(statusCode: number, message: any) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export class BadRequestError extends ErrorHandler {
    constructor(message: any) {
        super(400, message);
    }
}

export class NotFoundError extends ErrorHandler {
    constructor(message: any) {
        super(404, message);
    }
}

export class ForbiddenError extends ErrorHandler {
    constructor(message: any) {
        super(403, message);
    }
}
