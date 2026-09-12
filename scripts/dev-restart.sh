#!/bin/bash
# Reliably (re)start `npm run dev` for this project, killing anything already
# bound to its ports first.
#
# WHY THIS EXISTS: `pkill -f "next dev"` / `pkill -f "next-server"` have
# repeatedly failed to find live dev-server processes in this environment --
# `pgrep -f` comes back completely empty, yet a subsequent `npm run dev`
# still logs "Port 3000 is in use" and a plain `curl localhost:3000` gets a
# real (often stale/404) HTTP response. `ss -ltnp` is the tool that actually
# sees these -- it reports a real PID bound to the port even when `pgrep`
# in the current shell can't find it by command-line pattern (this smells
# like each Bash tool call getting its own process-list view while sharing
# one host network namespace, so a background process started in an earlier
# call becomes invisible to `pgrep`/`pkill` in a later one, but its socket
# is still very much alive and killable by that PID). So: find PIDs via
# `ss` (port truth), not `pgrep` (process-list truth), and loop until the
# ports are actually free before declaring victory.
#
# Two overlapping dev servers sharing one .next directory is also what
# produced a corrupted webpack chunk manifest earlier ("Cannot find module
# './718.js'") -- so this always wipes .next before starting, even on a
# clean run, as cheap insurance.

set -u
cd "$(dirname "$0")/.."

PORTS=(3000 3001 3002 4001 9000)
PIDFILE=/tmp/wakeup-dev.pid
LOGFILE=/tmp/wakeup-dev.log

kill_port() {
  local port="$1"
  local pid
  pid=$(ss -ltnp 2>/dev/null | awk -v p=":$port\$" '$4 ~ p {print $0}' | grep -oP 'pid=\K[0-9]+' | sort -u)
  if [ -n "$pid" ]; then
    echo "Killing pid(s) on port $port: $pid"
    # shellcheck disable=SC2086
    kill -9 $pid 2>/dev/null
  fi
}

echo "== Clearing ports: ${PORTS[*]} =="
for attempt in 1 2 3 4 5; do
  any_bound=false
  for port in "${PORTS[@]}"; do
    if ss -ltn 2>/dev/null | grep -q ":$port "; then
      any_bound=true
      kill_port "$port"
    fi
  done
  # Belt-and-braces: also sweep by the usual command-line patterns, in case
  # pgrep *does* see them this time.
  pkill -9 -f "tinacms dev" 2>/dev/null
  pkill -9 -f "next dev" 2>/dev/null
  pkill -9 -f "next-server" 2>/dev/null

  if [ "$any_bound" = false ]; then
    break
  fi
  sleep 1
done

still_bound=""
for port in "${PORTS[@]}"; do
  if ss -ltn 2>/dev/null | grep -q ":$port "; then
    still_bound="$still_bound $port"
  fi
done
if [ -n "$still_bound" ]; then
  echo "WARNING: still bound after 5 attempts:$still_bound -- inspect manually with 'ss -ltnp | grep -E \"$(echo $still_bound | tr ' ' '|')\"'"
else
  echo "All target ports confirmed free."
fi

echo "== Wiping .next =="
rm -rf .next

echo "== Starting npm run dev =="
nohup npm run dev > "$LOGFILE" 2>&1 &
echo $! > "$PIDFILE"
disown
echo "Started (npm pid $(cat "$PIDFILE")), logging to $LOGFILE"

echo "== Waiting for http://localhost:3000 =="
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null)
  if [ "$code" = "200" ]; then
    echo "Ready after ${i}s (HTTP $code)."
    exit 0
  fi
  sleep 1
done
echo "WARNING: not ready after 30s -- check $LOGFILE"
tail -30 "$LOGFILE"
exit 1
