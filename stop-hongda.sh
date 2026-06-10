#!/usr/bin/env bash
# 停止 hongda.app 三国杀（客户端 + 联机服务器 + 隧道）。停止后网站离线。
echo "正在停止 hongda.app 三国杀…"

pkill -f "cloudflared tunnel run noname" 2>/dev/null && echo "✓ Cloudflare 隧道已停" || echo "· 隧道未运行"
pkill -f "@noname/fs dev" 2>/dev/null
pkill -f "@noname/server dev" 2>/dev/null

# 兜底：按端口杀掉仍在监听的进程
for port in 8089 8082; do
	pids=$(lsof -nP -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null)
	if [ -n "$pids" ]; then
		kill $pids 2>/dev/null && echo "✓ 端口 $port 已停"
	fi
done

echo "完成。https://hongda.app 现已离线。"
