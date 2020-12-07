## 使用方法：
```typescript
// commonjs 引入方法：
let BilibiliLiveDanmu = require("@flowfire/bilibili-live-danmu").BilibiliLiveDanmu

// es6 模块引入方法
import { BilibiliLiveDanmu } from "@flowfire/bilibili-live-danmu"


let danmu = new BilibiliLiveDanmu(17253) // 数字为直播间号码
danmu.on("POPULARITY", number => console.log("房间人气值为：", number))
danmu.on("COMMAND", cmd => console.log("命令弹幕，用户进入直播间，发送弹幕，礼物通知等都会出发该事件", cmd))
danmu.on("SERVER_HEARTBEAT", () => console.log("服务器心跳包，该事件没有数据"))

```

有 bug 请去 github 提交 issue。