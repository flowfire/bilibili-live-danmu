export type EVENTS = 'CLIENT_HEARTBEAT' | 'POPULARITY' | 'COMMAND' | 'AUTH_AND_JOIN_ROOM' | 'SERVER_HEARTBEAT' | 'UNKNOW_EVENT'
export type COMMAND_TYPE = 'INTERACT_WORD' | 'DANMU_MSG' | 'SEND_GIFT'

export interface Command{
    meta: null, // 元数据，目前还不知道咋分析，暂时先标为 null
    data: any,  // 内部数据，object
}

export interface CommandData{
    cmd: COMMAND_TYPE,
    data: {
        uid: number,
        uname: string,
        timestamp: number,
    }
}