#!/usr/bin/env bash
set -euo pipefail

URL="${1:-https://7pgdn5q476.execute-api.us-east-1.amazonaws.com/pmp-video-deploy}"
API_KEY="${API_GATEWAY_KEY:-}"
RETRIES="${RETRIES:-3}"

for ((i=1;i<=RETRIES;i++)); do
  echo "Llamando ${URL} (intento ${i})..."
  if [[ -n "${API_KEY}" ]]; then
    RESP=$(curl -sS -X POST "${URL}" -H "x-api-key: ${API_KEY}")
  else
    RESP=$(curl -sS -X POST "${URL}")
  fi
  RC=$?
  if [[ $RC -eq 0 ]]; then
    echo "${RESP}"
    exit 0
  fi
  sleep $((i*5))
done

echo "Fallo tras ${RETRIES} intentos." >&2
exit 1
