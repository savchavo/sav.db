export default class extends Error {

    constructor(message:string, name?:string) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.message = message;
        this.name = name || "TypeError";
    };
};