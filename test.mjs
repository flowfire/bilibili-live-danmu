import { access } from "fs"
import { BilibiliLiveDanmu } from "./dist/index.js"
import { BilibiliLiveDanms } from "./index.js"

let danmu = new BilibiliLiveDanms(3)

danmu.on("COMMAND", message => {
    console.log("消息：", message)
})

danmu.on("POPULARITY", popularity => {
    console.log("人气值：", popularity)
})