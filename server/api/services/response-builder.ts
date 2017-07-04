import { HttpError } from '../models/error.model';

export class ErrorResponseBuilder {
    private status: number;
    private source: string;
    private title: string;
    private message: string;
    private detail: string;

    setTitle(title: string) {
        this.title = title;
        return this;
    }

    get Title() {
        return this.title;
    }

    setSource(source: string) {
        this.source = source;
        return this;
    }

    get Source() {
        return this.source;
    }

    get Status() {
        return this.status;
    }

    setStatus(status: number) {
        this.status = status;
        return this;
    }

    get Message() {
        return this.message;
    }

    public setMessage(message: string) {
        this.message = message;
        return this;
    }

    get Detail() {
        return this.detail;
    }

    setDetail(detail: string) {
        this.detail = detail;
        return this;
    }

    build(): ErrorResponse {
        return new ErrorResponse(this);
    }

}

export class ErrorResponse {
    private status: number;
    private source: string;
    private title: string;
    private message: string;
    private detail: string;

    constructor(builder: ErrorResponseBuilder) {
        this.status = builder.Status;
        this.source = builder.Source;
        this.title = builder.Title;
        this.message = builder.Message;
        this.detail = builder.Detail;
    }

    get Detail() {
        return this.detail;
    }


    get Message() {
        return this.message;
    }

    get Source() {
        return this.source;
    }

    get Status() {
        return this.status;
    }

    get Title() {
        return this.title;
    }

}

export default new ErrorResponseBuilder();