export const enum HEAD_OFFSET {
    ALL_DATA_SIZE = 0,
    HEAD_SIZE = 4,
    PROTOCOL_VERSION = 6,
    OPERATION_CODE = 8,
    SEQUENCE = 12,
}
export const enum HEAD_LENGTH {
    ALL_DATA_SIZE = 4,
    HEAD_SIZE = 2,
    PROTOCOL_VERSION = 2,
    OPERATION_CODE = 4,
    SEQUENCE = 4,
}

export const enum BODY_META_OFFSET {
    // todo：body 数据格式分析，
}

export const enum OPERATION_CODE {
    CLIENT_HEARTBEAT = 2,
    POPULARITY = 3,
    COMMAND = 5,
    AUTH_AND_JOIN_ROOM = 7,
    SERVER_HEARTBEAT = 8,
}

export const LEFT_CURLY_BRACKET_CHAR_CODE = 123 // 左花括号编码

export const SEQUENCE = 1

export const PROTOCOL_VERSION = 2

export const PLATFORM = "web"

export const CLIENT_VERSION = "2.4.16"

export const HEAD_SIZE = 16

// 就 NM 离谱，版本为 2 的 body 中也带有一个长度为 16 字节的头部。
export const BODY_META_SIZE = 16

export const NOT_LOGIN_UID = 0

export const HEARTBEATS_INTERVAL = 30 * 1000

export const TWO_BYTE = 256