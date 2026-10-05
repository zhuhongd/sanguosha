# hongda三国杀

一个基于开源项目 **[无名杀 / noname](https://github.com/libnoname/noname)** 的定制版三国杀，部署在 **[hongda.app](https://hongda.app)**，主打**朋友点开链接、浏览器里零下载即玩**。

> 私人朋友局自用的定制 fork，非商业用途。游戏引擎来自 libnoname/noname，遵循 GPL-3.0。

---

## ✨ 我们做了哪些改动

相对上游 noname，本 fork 的自定义内容（均在 `apps/core/` 下）：

### 启动与入口
- **自定义启动页**：进站后先显示「单机模式 / 联机模式」两个大按钮（`noname/init/hongdaLanding.js`）
- 浏览器标题改为 **hongda三国杀**，移除了启动时的 GPLv3 确认弹窗（许可见 `LICENSE`）
- 隐藏了单机菜单里的原生「联机」入口（联机统一走自定义按钮）

### 联机体验
- 点「联机模式」**自动连接到大厅**，无需手填服务器地址（`mode/connect.js` + `lib.hallURL`）
- **进大厅前强制设置昵称 + 头像**，避免一桌都是「无名玩家」
- **9 个朋友自定义头像**（照片）排在头像网格最前面
- 武将/卡牌设置栏新增 **「全部开启 / 全部关闭」** 按钮（联机模式也可用）

### 界面与外观
- 默认 **手杀(long2) 布局** + **ol** 卡牌/卡背/体力条样式（接近官方三国杀OL观感）
- 玩家昵称更醒目（加大、加粗、金色描边）
- 铁索连环的链子上移，避免挡住装备栏

### 出牌特效（借鉴 FreeKill 思路，用 noname 自有机制实现）
- 戏剧性的牌（南蛮/万箭/桃园/五谷/决斗/火攻/铁索）触发**中央大字横幅**
- 补全**毒 / 冰**属性伤害粒子（原本只有火/雷）
- **受击红光闪**、**卡牌落地金光脉冲**
- 出牌时**可用手牌发光、不可用手牌变灰**

### 玩法与彩蛋
- **出牌默认需手动点确认**（关闭 `auto_confirm`），不再一点就自动发出
- **黄宇超** 自定义武将（神话包，蜀，4 血，技能 养锐 + 坚毅）
- 新手向导结尾自定义联系方式

---

## 🚀 本地运行（开发）

环境：Node.js `^20.19.0 || >=22.12.0`，pnpm `>= 9`，Chromium ≥ 91 / Safari ≥ 16.4（不支持 Firefox）。

```bash
pnpm install        # 安装依赖
pnpm build          # 构建到 dist/
pnpm serve          # 启动静态客户端服务 (默认 :8089)
```

联机服务器（另开一个终端）：

```bash
pnpm -F @noname/server dev   # WebSocket 联机服务器 (默认 :8082)
```

浏览器打开 `http://localhost:8089` 即可。改完源码记得 `pnpm build` 重新构建；浏览器有 Service Worker 缓存，验证改动建议用**无痕窗口**。

> 构建偶发 `ENOTEMPTY: dist/node_modules` 报错时，执行 `rm -rf apps/core/dist/node_modules` 再重新构建。

---

## 🌐 部署（sgs.hongda.app，7×24 常驻）

现在完全跑在 **Cloudflare** 上，不再依赖任何人的电脑开机：

- 本仓库的构建产物 `dist/` 作为静态文件托管（约 1.5 万个文件，在免费额度内）；
- 联机大厅是 Cloudflare Durable Object，移植自 `packages/server`，协议完全一致；`lib.hallURL` 仍是 `wss://ws.hongda.app`（也可以用 `wss://sgs.hongda.app/lobby`，是同一个大厅）；
- 网页版需要的文件接口（`/checkFile`、`/getFileList`……）由 Worker 只读提供。

托管代码在 **[zhuhongd/hongda.app](https://github.com/zhuhongd/hongda.app)** 的 `sanguosha/` 目录，本仓库是那里的 git 子模块 `sanguosha/game`。更新游戏：

```bash
pnpm install && pnpm build   # 在本仓库里构建到 dist/
cd .. && npm run deploy      # 在 hongda.app/sanguosha 里部署
```

旧的自托管脚本（`launch-hongda.sh` / `stop-hongda.sh` / `play-online.sh`，靠 Cloudflare 隧道）已经不需要了，留作参考。

---

## 🗂 项目结构（简）

- `apps/core/` — 游戏本体（武将 `character/`、卡牌 `card/`、布局 `layout/`、引擎 `noname/`、模式 `mode/`）
- `packages/server/` — 联机 WebSocket 服务器（`@noname/server`）
- `packages/fs/` — 静态客户端服务器（`@noname/fs`，Fastify）
- `launch-hongda.sh` / `stop-hongda.sh` / `play-online.sh` — 自托管脚本

---

## 🙏 致谢与许可

- 游戏引擎与绝大部分内容来自 **[无名杀 noname](https://github.com/libnoname/noname)**（GPL-3.0）。打包、二次分发 **请保留代码出处**：<https://github.com/libnoname/noname>，并**请勿用于商业用途**。
- 本 fork 同样基于 GPL-3.0 开源，许可见 [`LICENSE`](./LICENSE)。
- 部分出牌特效设计参考了 **[FreeKill](https://github.com/Qsgs-Fans/FreeKill)**（仅借鉴思路，未使用其美术/音效资源）。
