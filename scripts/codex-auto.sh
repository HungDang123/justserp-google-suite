#!/usr/bin/env bash
set -euo pipefail

TASK_FILE=".codex-tasks/inbox.md"
PLAN_DIR=".codex-tasks/plans"
LOG_DIR=".codex-tasks/logs"

mkdir -p "$PLAN_DIR" "$LOG_DIR"

run_codex_exec() {
  local sandbox="$1"
  local prompt_file="$2"

  if command -v node >/dev/null 2>&1; then
    codex exec --sandbox "$sandbox" "$(<"$prompt_file")"
    return
  fi

  if command -v powershell.exe >/dev/null 2>&1 && command -v wslpath >/dev/null 2>&1; then
    local win_prompt_file
    local win_cwd
    win_prompt_file="$(wslpath -w "$prompt_file")"
    win_cwd="$(wslpath -w "$(pwd)")"
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Raw -LiteralPath '$win_prompt_file' | & codex.cmd exec --cd '$win_cwd' --sandbox '$sandbox' -"
    return
  fi

  echo "Missing node/codex runtime"
  return 1
}

if [ ! -f "$TASK_FILE" ]; then
  echo "Missing $TASK_FILE"
  exit 1
fi

TASK_ID=$(grep -m1 "^## TASK-" "$TASK_FILE" | sed 's/^## //')

if [ -z "${TASK_ID:-}" ]; then
  echo "No TASK found. Add task like: ## TASK-001"
  exit 0
fi

PLAN_FILE="$PLAN_DIR/${TASK_ID}.md"
LOG_FILE="$LOG_DIR/${TASK_ID}.log"

if grep -A20 "^## ${TASK_ID}" "$TASK_FILE" | grep -q "status: new"; then
  echo "Planning ${TASK_ID}..."

  PROMPT_FILE="$(mktemp "$LOG_DIR/${TASK_ID}.prompt.XXXXXX")"
  cat >"$PROMPT_FILE" <<EOF
Đọc AGENTS.md và ${TASK_FILE}.
Chỉ xử lý task ${TASK_ID}.
Task đang có status: new.

Yêu cầu:
- Chỉ lập plan.
- Không sửa bất kỳ file code nào.
- Ghi plan vào ${PLAN_FILE}.
- Plan phải gồm:
  1. Tóm tắt vấn đề
  2. File/function liên quan
  3. Hướng sửa từng bước
  4. Test/lint cần chạy
  5. Rủi ro
EOF

  run_codex_exec workspace-write "$PROMPT_FILE" | tee "$LOG_FILE"
  rm -f "$PROMPT_FILE"

  echo ""
  echo "Done. Open plan: ${PLAN_FILE}"
  echo "Nếu plan ổn, đổi status: new thành status: approved rồi chạy lại script."
  exit 0
fi

if grep -A20 "^## ${TASK_ID}" "$TASK_FILE" | grep -q "status: approved"; then
  if [ ! -f "$PLAN_FILE" ]; then
    echo "Missing plan file: $PLAN_FILE"
    echo "Run with status: new first."
    exit 1
  fi

  echo "Implementing ${TASK_ID}..."

  PROMPT_FILE="$(mktemp "$LOG_DIR/${TASK_ID}.prompt.XXXXXX")"
  cat >"$PROMPT_FILE" <<EOF
Đọc AGENTS.md, ${TASK_FILE}, và ${PLAN_FILE}.
Chỉ xử lý task ${TASK_ID}.
Task đang có status: approved.

Yêu cầu:
- Code đúng theo plan.
- Chỉ sửa phạm vi cần thiết.
- Không commit.
- Không push.
- Không deploy.
- Chạy test/lint liên quan nếu có thể.
- Cuối cùng báo:
  1. File đã sửa
  2. Nội dung đã sửa
  3. Test/lint đã chạy
  4. Rủi ro còn lại
EOF

  run_codex_exec workspace-write "$PROMPT_FILE" | tee -a "$LOG_FILE"
  rm -f "$PROMPT_FILE"

  echo ""
  echo "Done. Check diff:"
  echo "git diff"
  exit 0
fi

echo "Task ${TASK_ID} chưa có status hợp lệ."
echo "Dùng: status: new hoặc status: approved"
