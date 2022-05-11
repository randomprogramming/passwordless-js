"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const exceptions_1 = require("./exceptions");
const encoding_1 = require("./util/encoding");
function default_1(email) {
    return __awaiter(this, void 0, void 0, function* () {
        // Registration begin:
        const enc = new TextEncoder();
        let attestationOptions;
        try {
            attestationOptions = yield (0, api_1.registerBegin)(email);
        }
        catch (err) {
            throw new exceptions_1.ServerError("Server failed to return registration options.");
        }
        const accountId = attestationOptions.user.id;
        const publicKey = Object.assign(Object.assign({}, attestationOptions), { challenge: (0, encoding_1.b64tab)(attestationOptions.challenge), user: Object.assign(Object.assign({}, attestationOptions.user), { id: enc.encode(attestationOptions.user.id) }) });
        const credential = (yield navigator.credentials.create({
            publicKey,
        }));
        if (!credential) {
            throw new exceptions_1.CredentialError("Failed to create credentials.");
        }
        // Registration complete:
        const encodedCredential = Object.assign(Object.assign({}, credential), { id: credential.id, rawId: (0, encoding_1.abtb64)(credential.rawId), response: Object.assign(Object.assign({}, credential.response), { clientDataJSON: (0, encoding_1.abtb64)(credential.response.clientDataJSON) }), type: credential.type });
        // These properties do not exist in TypeScript for some reason
        if (credential.authenticatorAttachment) {
            encodedCredential.authenticatorAttachment = credential.authenticatorAttachment;
        }
        if (credential.response.attestationObject) {
            encodedCredential.attestationObject = (0, encoding_1.abtb64)(credential.response.attestationObject);
        }
        try {
            yield (0, api_1.registerComplete)(encodedCredential, accountId);
        }
        catch (err) {
            throw new exceptions_1.ServerError("Server failed to complete registration.");
        }
    });
}
exports.default = default_1;
