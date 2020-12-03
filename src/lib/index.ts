import fetch from "node-fetch"
import { ICloseEvent, IMessageEvent, w3cwebsocket as WebSocket } from "websocket";
import { EventEmitter } from "events"
import Zlib from "zlib"

const enum HEAD_OFFSET {
    ALL_DATA_SIZE = 0,
    HEAD_SIZE = 4,
    PROTOCOL_VERSION = 6,
    OPERATION_CODE = 8,
    SEQUENCE = 12,
}
const enum HEAD_LENGTH {
    ALL_DATA_SIZE = 4,
    HEAD_SIZE = 2,
    PROTOCOL_VERSION = 2,
    OPERATION_CODE = 4,
    SEQUENCE = 4,
}

const enum OPERATION_CODE {
    CLIENT_HEARTBEAT = 2,
    POPULARITY = 3,
    COMMAND = 5,
    AUTH_AND_JOIN_ROOM = 7,
    SERVER_HEARTBEAT = 8,
}

const SEQUENCE = 1

const PROTOCOL_VERSION = 2

const PLATFORM = "web"

const CLIENT_VERSION = "2.4.16"

const HEAD_SIZE = 16

// 就 NM 离谱，版本为 2 的 body 中也带有一个长度为 16 字节的头部。
const BODY_META_SIZE = 16

const NOT_LOGIN_UID = 0

const HEARTBEATS_INTERVAL = 30 * 1000


export class BilibiliLiveDanmu extends EventEmitter{
    private roomId:number = 0
    private realRoomId: number = 0
    private ws: WebSocket | null = null
    constructor(roomId: number){
        super()
        this.roomId = roomId
        this.init()
    }
    private async init(){
        let res = await fetch(`https://api.live.bilibili.com/room/v1/Room/room_init?id=${this.roomId}`)
        let json = await res.json()
        this.realRoomId = json.data.room_id
        this.ws = new WebSocket(`wss://broadcastlv.chat.bilibili.com:2245/sub`)
        this.ws.onopen = this.wsOnOpen.bind(this)
        this.ws.onmessage = this.wsOnMessage.bind(this)
        this.ws.onclose = this.wsOnClose.bind(this)
        this.ws.onerror = this.wsOnError.bind(this)
    }
    private async wsOnOpen(){
        this.initAuth()
    }
    private async wsOnMessage(ev: IMessageEvent){
        let json = await this.decodeMessage(ev.data as ArrayBuffer)
        console.log(json)
    }
    private async wsOnClose(ev: ICloseEvent){
        console.log("连接关闭：", ev)
    }
    private async wsOnError(ev: Error){
        console.log("连接错误：", ev)
    }
    private async initAuth(){
        let authConfig = {
            uid: NOT_LOGIN_UID,
            roomid: this.realRoomId,
            protover: PROTOCOL_VERSION,
            platform: PLATFORM,
            clientver: CLIENT_VERSION,
        }
        let bufferHead = await this.initBufferHead()
        let bufferBody = await this.initBufferBody(authConfig)
        let packageSize = bufferHead.length + bufferBody.byteLength
        this.fillHeadBuffer(bufferHead, HEAD_OFFSET.ALL_DATA_SIZE, HEAD_LENGTH.ALL_DATA_SIZE, packageSize)
        this.fillHeadBuffer(bufferHead, HEAD_OFFSET.OPERATION_CODE, HEAD_LENGTH.OPERATION_CODE, OPERATION_CODE.AUTH_AND_JOIN_ROOM)
        let buffer = new Uint8Array(packageSize)
        buffer.set(bufferHead)
        buffer.set(bufferBody, bufferHead.length)
        // @ts-ignore
        this.ws.send(buffer)

        this.initHeartbeat()
        setInterval(this.initHeartbeat.bind(this), HEARTBEATS_INTERVAL)
    }
    private async initHeartbeat(){
        let bufferHead = await this.initBufferHead()
        this.fillHeadBuffer(bufferHead, HEAD_OFFSET.ALL_DATA_SIZE, HEAD_LENGTH.ALL_DATA_SIZE, HEAD_SIZE)
        this.fillHeadBuffer(bufferHead, HEAD_OFFSET.OPERATION_CODE, HEAD_LENGTH.OPERATION_CODE, OPERATION_CODE.CLIENT_HEARTBEAT)
        // @ts-ignore
        this.ws.send(bufferHead)
    }
    private async initBufferHead(): Promise<Uint8Array>{
        let arrayBuffer = new ArrayBuffer(HEAD_SIZE)
        let uIntBuffer = new Uint8Array(arrayBuffer)
        this.fillHeadBuffer(uIntBuffer, HEAD_OFFSET.HEAD_SIZE, HEAD_LENGTH.HEAD_SIZE, HEAD_SIZE)
        this.fillHeadBuffer(uIntBuffer, HEAD_OFFSET.PROTOCOL_VERSION, HEAD_LENGTH.PROTOCOL_VERSION, PROTOCOL_VERSION)
        this.fillHeadBuffer(uIntBuffer, HEAD_OFFSET.SEQUENCE, HEAD_LENGTH.SEQUENCE, SEQUENCE)
        return uIntBuffer
    }
    private async initBufferBody(data: any): Promise<Uint8Array>{
        let jsonString = JSON.stringify(data)
        let buffer = Buffer.from(jsonString)
        return new Uint8Array(buffer)
    }
    private async decodeMessage(data: ArrayBuffer): Promise<any>{
        let uIntBuffer = new Uint8Array(data)
        let opCode: OPERATION_CODE = this.getHeadBuffer(uIntBuffer, HEAD_OFFSET.OPERATION_CODE, HEAD_LENGTH.OPERATION_CODE)
        uIntBuffer = uIntBuffer.slice(HEAD_SIZE)
        switch(opCode){
            case OPERATION_CODE.POPULARITY:
                return null
            case OPERATION_CODE.COMMAND:
                if (uIntBuffer[0] !== 123) {
                    uIntBuffer = Zlib.inflateSync(uIntBuffer)
                    // 解压缩之后前 16 位似乎是 metadata ，但是不管直接丢掉
                    uIntBuffer = uIntBuffer.slice(BODY_META_SIZE)
                }
                let string = Buffer.from(uIntBuffer).toString("utf-8")
                let json = JSON.parse(string)
                return json
            case OPERATION_CODE.SERVER_HEARTBEAT:
                return null;
            default:
                return null;
        }
    }
    private getHeadBuffer(buffer: Uint8Array, offset: HEAD_OFFSET, length: HEAD_LENGTH): number {
        let number = 0
        let i = 0
        const TWO_BYTE = 256
        while(i < length){
            number *= TWO_BYTE
            number += buffer[offset + i]
            i++
        }
        return number
    }
    private fillHeadBuffer(buffer: Uint8Array, offset: HEAD_OFFSET, length: HEAD_LENGTH, data: number) {
        const TWO_BYTE = 256
        while (length > 0) {
            length --
            buffer[offset + length] = data % TWO_BYTE
            data = Math.floor(data / TWO_BYTE)
        }
        if (data !== 0) throw Error("数据溢出！")
    }
}
