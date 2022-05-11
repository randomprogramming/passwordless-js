"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = __importDefault(require("./src/register"));
const exceptions_1 = require("./src/exceptions");
exports.default = { register: register_1.default, CredentialError: exceptions_1.CredentialError, ServerError: exceptions_1.ServerError };
