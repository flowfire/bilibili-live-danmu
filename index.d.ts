import { EventEmitter } from "events"
import { EVENTS } from "./src"

declare class BilibiliLiveDanmu extends EventEmitter{
    /** @param {number} roomId 房间号，包括正常房间号和短号码 */
    private roomId: number

    /** @param {number} realRoomId 真实房间号，短号码所对应的真实房间 */
    private realRoomId: number

    /** @param {WebSocket} ws websocket 实例 */
    private ws: WebSocket

    /** 
     * @function constructor websocket 实例
     * @param {number} roomId 房间号，包括正常房间号和短号码 */
    constructor(roomId: number)

    /**
     * @function init 初始化方法
     */
    private async init(): Promise<void>{}

    /** 
     * @function on 监听器函数
     * @param {EVENTS} events 触发事件
     * @param {...any} params 其他参数
     */
    emit(event: EVENTS, ...params: any[]): boolean

    /** 
     * @function on 监听器函数
     * @param {EVENTS} events 触发事件
     * @param {Function} callback 回调事件
     */
    on(events: EVENTS, callback:Function)

    /** 
     * @function on 监听器函数
     * @param {EVENTS} events 触发事件
     * @param {Function} callback 回调事件
     */
    addListener(events: EVENTS, callback:Function)

    /** 
     * @function on 监听器函数
     * @param {EVENTS} events 触发事件
     * @param {Function} callback 回调事件
     */
    removeListener(events: EVENTS, callback:Function)

    /** 
     * @function on 监听器函数
     * @param {EVENTS} events 触发事件
     * @param {Function} callback 回调事件
     */
    removeAllListeners(events: EVENTS, callback:Function)

    /** 
     * @function on 监听器函数
     * @param {EVENTS} events 触发事件
     * @param {Function} callback 回调事件
     */
    once(events: EVENTS, callback:Function)

    /** 
     * @function on 监听器函数
     * @param {EVENTS} events 触发事件
     * @param {Function} callback 回调事件
     */
    off(events: EVENTS, callback:Function)
}