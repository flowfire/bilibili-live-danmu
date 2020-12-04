"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiliBiliDanmu = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var websocket_1 = require("websocket");
var events_1 = require("events");
var zlib_1 = __importDefault(require("zlib"));
var consts_1 = require("./consts");
var BiliBiliDanmu = /** @class */ (function (_super) {
    __extends(BiliBiliDanmu, _super);
    function BiliBiliDanmu(roomId) {
        var _this = _super.call(this) || this;
        _this.roomId = 0;
        _this.realRoomId = 0;
        _this.ws = null;
        if (!roomId)
            throw Error("请传入roomid！");
        _this.roomId = roomId;
        _this.init();
        return _this;
    }
    BiliBiliDanmu.prototype.emit = function (event) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArrays([event], params));
    };
    BiliBiliDanmu.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default("https://api.live.bilibili.com/room/v1/Room/room_init?id=" + this.roomId)];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        json = _a.sent();
                        this.realRoomId = json.data.room_id;
                        this.ws = new websocket_1.w3cwebsocket("wss://broadcastlv.chat.bilibili.com:2245/sub");
                        this.ws.onopen = this.wsOnOpen.bind(this);
                        this.ws.onmessage = this.wsOnMessage.bind(this);
                        this.ws.onclose = this.wsOnClose.bind(this);
                        this.ws.onerror = this.wsOnError.bind(this);
                        return [2 /*return*/];
                }
            });
        });
    };
    BiliBiliDanmu.prototype.wsOnOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.initAuth();
                return [2 /*return*/];
            });
        });
    };
    BiliBiliDanmu.prototype.wsOnMessage = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.decodeMessage(ev.data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BiliBiliDanmu.prototype.wsOnClose = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("连接关闭：", ev);
                return [2 /*return*/];
            });
        });
    };
    BiliBiliDanmu.prototype.wsOnError = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("连接错误：", ev);
                return [2 /*return*/];
            });
        });
    };
    BiliBiliDanmu.prototype.initAuth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authConfig, bufferHead, bufferBody, packageSize, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authConfig = {
                            uid: consts_1.NOT_LOGIN_UID,
                            roomid: this.realRoomId,
                            protover: consts_1.PROTOCOL_VERSION,
                            platform: consts_1.PLATFORM,
                            clientver: consts_1.CLIENT_VERSION,
                        };
                        return [4 /*yield*/, this.initBufferHead()];
                    case 1:
                        bufferHead = _a.sent();
                        return [4 /*yield*/, this.initBufferBody(authConfig)];
                    case 2:
                        bufferBody = _a.sent();
                        packageSize = bufferHead.length + bufferBody.byteLength;
                        return [4 /*yield*/, this.fillHeadBuffer(bufferHead, 0 /* ALL_DATA_SIZE */, 4 /* ALL_DATA_SIZE */, packageSize)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.fillHeadBuffer(bufferHead, 8 /* OPERATION_CODE */, 4 /* OPERATION_CODE */, 7 /* AUTH_AND_JOIN_ROOM */)];
                    case 4:
                        _a.sent();
                        buffer = new Uint8Array(packageSize);
                        buffer.set(bufferHead);
                        buffer.set(bufferBody, bufferHead.length);
                        // @ts-ignore
                        this.ws.send(buffer);
                        this.initHeartbeat();
                        setInterval(this.initHeartbeat.bind(this), consts_1.HEARTBEATS_INTERVAL);
                        return [2 /*return*/];
                }
            });
        });
    };
    BiliBiliDanmu.prototype.initHeartbeat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bufferHead;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initBufferHead()];
                    case 1:
                        bufferHead = _a.sent();
                        return [4 /*yield*/, this.fillHeadBuffer(bufferHead, 0 /* ALL_DATA_SIZE */, 4 /* ALL_DATA_SIZE */, consts_1.HEAD_SIZE)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.fillHeadBuffer(bufferHead, 8 /* OPERATION_CODE */, 4 /* OPERATION_CODE */, 2 /* CLIENT_HEARTBEAT */)
                            // @ts-ignore
                        ];
                    case 3:
                        _a.sent();
                        // @ts-ignore
                        this.ws.send(bufferHead);
                        return [2 /*return*/];
                }
            });
        });
    };
    BiliBiliDanmu.prototype.initBufferHead = function () {
        return __awaiter(this, void 0, void 0, function () {
            var arrayBuffer, uIntBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arrayBuffer = new ArrayBuffer(consts_1.HEAD_SIZE);
                        uIntBuffer = new Uint8Array(arrayBuffer);
                        return [4 /*yield*/, this.fillHeadBuffer(uIntBuffer, 4 /* HEAD_SIZE */, 2 /* HEAD_SIZE */, consts_1.HEAD_SIZE)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.fillHeadBuffer(uIntBuffer, 6 /* PROTOCOL_VERSION */, 2 /* PROTOCOL_VERSION */, consts_1.PROTOCOL_VERSION)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.fillHeadBuffer(uIntBuffer, 12 /* SEQUENCE */, 4 /* SEQUENCE */, consts_1.SEQUENCE)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, uIntBuffer];
                }
            });
        });
    };
    BiliBiliDanmu.prototype.initBufferBody = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonString, buffer;
            return __generator(this, function (_a) {
                jsonString = JSON.stringify(data);
                buffer = Buffer.from(jsonString);
                return [2 /*return*/, new Uint8Array(buffer)];
            });
        });
    };
    BiliBiliDanmu.prototype.decodeMessage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var uIntBuffer, opCode, _a, popularity, command;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        uIntBuffer = new Uint8Array(data);
                        return [4 /*yield*/, this.getHeadBuffer(uIntBuffer, 8 /* OPERATION_CODE */, 4 /* OPERATION_CODE */)];
                    case 1:
                        opCode = _b.sent();
                        uIntBuffer = uIntBuffer.slice(consts_1.HEAD_SIZE);
                        _a = opCode;
                        switch (_a) {
                            case 3 /* POPULARITY */: return [3 /*break*/, 2];
                            case 5 /* COMMAND */: return [3 /*break*/, 4];
                            case 8 /* SERVER_HEARTBEAT */: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 7];
                    case 2: return [4 /*yield*/, this.getPopularity(uIntBuffer)];
                    case 3:
                        popularity = _b.sent();
                        this.emit('POPULARITY', popularity);
                        return [3 /*break*/, 8];
                    case 4: return [4 /*yield*/, this.decodeBodyData(uIntBuffer)];
                    case 5:
                        command = _b.sent();
                        this.emit('COMMAND', command);
                        return [3 /*break*/, 8];
                    case 6:
                        this.emit('SERVER_HEARTBEAT');
                        return [3 /*break*/, 8];
                    case 7:
                        this.emit('UNKNOW_EVENT', uIntBuffer);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BiliBiliDanmu.prototype.decodeBodyData = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var uIntBuffer, data, string, json;
            return __generator(this, function (_a) {
                uIntBuffer = new Uint8Array(buffer);
                data = {
                    meta: null,
                    data: {},
                };
                uIntBuffer = zlib_1.default.inflateSync(uIntBuffer);
                // todo 解析body元数据，目前直接设置为 null
                data.meta = null;
                uIntBuffer = uIntBuffer.slice(consts_1.BODY_META_SIZE);
                string = Buffer.from(uIntBuffer).toString("utf-8");
                json = JSON.parse(string);
                data.data = json;
                return [2 /*return*/, data];
            });
        });
    };
    BiliBiliDanmu.prototype.getPopularity = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var popularity, i;
            return __generator(this, function (_a) {
                popularity = 0;
                for (i = 0; i < buffer.length; i++) {
                    popularity *= consts_1.TWO_BYTE;
                    popularity += buffer[i];
                }
                return [2 /*return*/, popularity];
            });
        });
    };
    BiliBiliDanmu.prototype.getHeadBuffer = function (buffer, offset, length) {
        return __awaiter(this, void 0, void 0, function () {
            var number, i;
            return __generator(this, function (_a) {
                number = 0;
                i = 0;
                while (i < length) {
                    number *= consts_1.TWO_BYTE;
                    number += buffer[offset + i];
                    i++;
                }
                return [2 /*return*/, number];
            });
        });
    };
    BiliBiliDanmu.prototype.fillHeadBuffer = function (buffer, offset, length, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                while (length > 0) {
                    length--;
                    buffer[offset + length] = data % consts_1.TWO_BYTE;
                    data = Math.floor(data / consts_1.TWO_BYTE);
                }
                if (data !== 0)
                    throw Error("数据溢出！");
                return [2 /*return*/];
            });
        });
    };
    return BiliBiliDanmu;
}(events_1.EventEmitter));
exports.BiliBiliDanmu = BiliBiliDanmu;
