import fetch from "node-fetch"
import { ICloseEvent, IMessageEvent, w3cwebsocket as WebSocket } from "websocket";
import { EventEmitter } from "events"
import Zlib from "zlib"
import { Command, EVENTS } from "./index.d"
import { 
    NOT_LOGIN_UID, PROTOCOL_VERSION, PLATFORM, 
    CLIENT_VERSION, HEAD_OFFSET, HEAD_LENGTH, 
    OPERATION_CODE, HEARTBEATS_INTERVAL, HEAD_SIZE, 
    SEQUENCE, BODY_META_SIZE, TWO_BYTE } from "./consts";


export class BiliBiliDanmu extends EventEmitter{
    private roomId:number = 0
    private realRoomId: number = 0
    private ws: WebSocket | null = null
    constructor(roomId: number){
        super()
        if (!roomId) throw Error("请传入roomid！")
        this.roomId = roomId
        this.init()
    }
    emit(event: EVENTS, ...params: any[]): boolean{
        return super.emit(event, ...params)
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
        await this.decodeMessage(ev.data as ArrayBuffer)
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
        await this.fillHeadBuffer(bufferHead, HEAD_OFFSET.ALL_DATA_SIZE, HEAD_LENGTH.ALL_DATA_SIZE, packageSize)
        await this.fillHeadBuffer(bufferHead, HEAD_OFFSET.OPERATION_CODE, HEAD_LENGTH.OPERATION_CODE, OPERATION_CODE.AUTH_AND_JOIN_ROOM)
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
        await this.fillHeadBuffer(bufferHead, HEAD_OFFSET.ALL_DATA_SIZE, HEAD_LENGTH.ALL_DATA_SIZE, HEAD_SIZE)
        await this.fillHeadBuffer(bufferHead, HEAD_OFFSET.OPERATION_CODE, HEAD_LENGTH.OPERATION_CODE, OPERATION_CODE.CLIENT_HEARTBEAT)
        // @ts-ignore
        this.ws.send(bufferHead)
    }
    private async initBufferHead(): Promise<Uint8Array>{
        let arrayBuffer = new ArrayBuffer(HEAD_SIZE)
        let uIntBuffer = new Uint8Array(arrayBuffer)
        await this.fillHeadBuffer(uIntBuffer, HEAD_OFFSET.HEAD_SIZE, HEAD_LENGTH.HEAD_SIZE, HEAD_SIZE)
        await this.fillHeadBuffer(uIntBuffer, HEAD_OFFSET.PROTOCOL_VERSION, HEAD_LENGTH.PROTOCOL_VERSION, PROTOCOL_VERSION)
        await this.fillHeadBuffer(uIntBuffer, HEAD_OFFSET.SEQUENCE, HEAD_LENGTH.SEQUENCE, SEQUENCE)
        return uIntBuffer
    }
    private async initBufferBody(data: any): Promise<Uint8Array>{
        let jsonString = JSON.stringify(data)
        let buffer = Buffer.from(jsonString)
        return new Uint8Array(buffer)
    }
    private async decodeMessage(data: ArrayBuffer): Promise<any>{
        let uIntBuffer = new Uint8Array(data)
        let opCode: OPERATION_CODE = await this.getHeadBuffer(uIntBuffer, HEAD_OFFSET.OPERATION_CODE, HEAD_LENGTH.OPERATION_CODE)
        uIntBuffer = uIntBuffer.slice(HEAD_SIZE)
        switch(opCode){
            case OPERATION_CODE.POPULARITY:
                let popularity = await this.getPopularity(uIntBuffer)
                this.emit('POPULARITY', popularity)
                break
            case OPERATION_CODE.COMMAND:
                let command = await this.decodeBodyData(uIntBuffer)
                this.emit('COMMAND', command)
                break
            case OPERATION_CODE.SERVER_HEARTBEAT:
                this.emit('SERVER_HEARTBEAT')
                break
            default:
                this.emit('UNKNOW_EVENT', uIntBuffer)
                break
        }
    }
    private async decodeBodyData(buffer: Uint8Array): Promise<Command> {
        let uIntBuffer = new Uint8Array(buffer)

        let data: Command = {
            meta: null,
            data: {},
        }
        uIntBuffer = Zlib.inflateSync(uIntBuffer)

        // todo 解析body元数据，目前直接设置为 null
        data.meta = null
        uIntBuffer = uIntBuffer.slice(BODY_META_SIZE)
        let string = Buffer.from(uIntBuffer).toString("utf-8")
        let json = JSON.parse(string)
        data.data = json
        return data
    }
    private async getPopularity(buffer: Uint8Array): Promise<number>{
        let popularity = 0
        for (let i = 0; i < buffer.length; i++) {
            popularity *= TWO_BYTE
            popularity += buffer[i]
        }
        return popularity
    }
    private async getHeadBuffer(buffer: Uint8Array, offset: HEAD_OFFSET, length: HEAD_LENGTH): Promise<number> {
        let number = 0
        let i = 0
        while(i < length){
            number *= TWO_BYTE
            number += buffer[offset + i]
            i++
        }
        return number
    }
    private async fillHeadBuffer(buffer: Uint8Array, offset: HEAD_OFFSET, length: HEAD_LENGTH, data: number) {
        while (length > 0) {
            length --
            buffer[offset + length] = data % TWO_BYTE
            data = Math.floor(data / TWO_BYTE)
        }
        if (data !== 0) throw Error("数据溢出！")
    }
}
