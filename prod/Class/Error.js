"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 extends Error {
    constructor(message, name) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.message = message;
        this.name = name || "TypeError";
    }
    ;
}
exports.default = default_1;
;
