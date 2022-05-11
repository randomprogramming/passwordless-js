"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.CredentialError = void 0;
class CredentialError extends Error {
}
exports.CredentialError = CredentialError;
class ServerError extends Error {
}
exports.ServerError = ServerError;
