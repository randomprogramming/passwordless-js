"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.b64tab = exports.abtb64 = void 0;
function abtb64(ab) {
    let binary = "";
    const bytes = new Uint8Array(ab);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
exports.abtb64 = abtb64;
function b64tab(b64) {
    const binary_string = window.atob(b64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
exports.b64tab = b64tab;
