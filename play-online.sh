#!/usr/bin/env bash
# 一键启动 noname 公网联机（固定域名 hongda.app，朋友零下载，浏览器打开即玩）
# 用法：  bash play-online.sh
# 停止：  Ctrl+C （会自动清理所有子进程）
set -euo pipefail
cd "$(dirname "$0")"

PAGE_URL="https://hongda.app"
WSS_URL="wss://ws.hongda.app"
TUNNEL="noname"

LOGDIR="$(mktemp -d /tmp/noname-online.XXXX)"
echo "日志目录: $LOGDIR"

pids=()
cleanup() {
  echo; echo "正在停止所有进程（下线）..."
  for p in "${pids[@]}"; do kill "$p" 2>/dev/null || true; done
  exit 0
}
trap cleanup INT TERM

# 0) 没构建过 dist 就先构建
if [ ! -f dist/index.html ]; then
  echo "首次运行：构建客户端 (pnpm build) ..."
  pnpm build
fi

echo "启动客户端静态服务 (:8089) ..."
pnpm serve >"$LOGDIR/client.log" 2>&1 & pids+=($!)

echo "启动联机服务器 (:8082) ..."
pnpm -F @noname/server dev >"$LOGDIR/server.log" 2>&1 & pids+=($!)

# 等本地端口起来
echo -n "等待本地服务就绪"
for i in $(seq 1 20); do
  if lsof -nP -iTCP:8089 -sTCP:LISTEN >/dev/null 2>&1 && lsof -nP -iTCP:8082 -sTCP:LISTEN >/dev/null 2>&1; then
    break
  fi
  echo -n "."; sleep 1
done
echo

echo "启动 Cloudflare 命名隧道 ($TUNNEL) ..."
cloudflared tunnel run "$TUNNEL" >"$LOGDIR/tunnel.log" 2>&1 & pids+=($!)

# 等隧道注册连接
echo -n "等待隧道连接"
for i in $(seq 1 20); do
  if grep -q "Registered tunnel connection" "$LOGDIR/tunnel.log" 2>/dev/null; then break; fi
  echo -n "."; sleep 1
done
echo

echo "=================================================="
echo " 朋友打开这个网页 (零下载，链接永久不变):"
echo "   $PAGE_URL"
echo
echo " 进入「联机」后，服务器地址填:"
echo "   $WSS_URL"
echo "=================================================="
echo "保持本窗口开着 = 在线；Ctrl+C = 下线。"
echo "Mac 别休眠（可另开终端跑: caffeinate -d）"

# 阻塞，直到 Ctrl+C
wait
