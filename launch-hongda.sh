#!/usr/bin/env bash
# 后台启动 hongda.app 三国杀（客户端:8089 + 联机服务器:8082 + Cloudflare命名隧道）
# 进程用 nohup 脱离当前终端/会话，关掉 Claude / 关闭终端后仍继续运行。
# 幂等：已在运行的部分不会重复启动。Mac 别休眠（否则隧道断）。
set -uo pipefail

REPO="/Users/hongdazhu/Desktop/Personal/something to playaround/sanguosha"
LOGDIR="$HOME/.hongda-sanguosha"
mkdir -p "$LOGDIR"
cd "$REPO" || { echo "找不到仓库目录: $REPO"; exit 1; }

# 确保 pnpm 可用（corepack）
command -v pnpm >/dev/null 2>&1 || corepack enable pnpm >/dev/null 2>&1 || true

up() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }

launch() { # 用法: launch <名称> <端口> <命令...>
	local label="$1" port="$2"; shift 2
	if up "$port"; then
		echo "✓ $label 已在运行 (:$port)"
		return
	fi
	nohup "$@" >"$LOGDIR/$label.log" 2>&1 &
	disown
	echo "→ 已启动 $label (:$port)"
}

# 1) 首次/缺失时构建
if [ ! -f dist/index.html ]; then
	echo "首次运行，正在构建客户端（约几分钟）…"
	if ! pnpm build >"$LOGDIR/build.log" 2>&1; then
		echo "✗ 构建失败，详见 $LOGDIR/build.log"; exit 1
	fi
fi

# 2) 客户端静态服务 + 联机服务器
launch client 8089 pnpm serve
launch server 8082 pnpm -F @noname/server dev

# 3) Cloudflare 命名隧道（固定域名 hongda.app）
if pgrep -f "cloudflared tunnel run noname" >/dev/null 2>&1; then
	echo "✓ Cloudflare 隧道已在运行"
else
	nohup cloudflared tunnel run noname >"$LOGDIR/tunnel.log" 2>&1 &
	disown
	echo "→ 已启动 Cloudflare 隧道"
fi

echo "------------------------------------------"
echo " 日志目录: $LOGDIR"
echo " 网址:     https://hongda.app"
echo " 停止:     bash \"$REPO/stop-hongda.sh\""
echo "------------------------------------------"
