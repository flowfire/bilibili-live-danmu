"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TWO_BYTE = exports.HEARTBEATS_INTERVAL = exports.NOT_LOGIN_UID = exports.BODY_META_SIZE = exports.HEAD_SIZE = exports.CLIENT_VERSION = exports.PLATFORM = exports.PROTOCOL_VERSION = exports.SEQUENCE = exports.LEFT_CURLY_BRACKET_CHAR_CODE = void 0;
exports.LEFT_CURLY_BRACKET_CHAR_CODE = 123; // 左花括号编码
exports.SEQUENCE = 1;
exports.PROTOCOL_VERSION = 2;
exports.PLATFORM = "web";
exports.CLIENT_VERSION = "2.4.16";
exports.HEAD_SIZE = 16;
// 就 NM 离谱，版本为 2 的 body 中也带有一个长度为 16 字节的头部。
exports.BODY_META_SIZE = 16;
exports.NOT_LOGIN_UID = 0;
exports.HEARTBEATS_INTERVAL = 30 * 1000;
exports.TWO_BYTE = 256;
