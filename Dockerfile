# root Dockerfile — references files under server/
FROM heroiclabs/nakama:latest

# copy template and compiled modules from server/ into the image
COPY server/nakama.yml /data/nakama.yml.template
COPY server/dist /data/modules

# install envsubst for runtime substitution
RUN if command -v apk >/dev/null 2>&1; then \
      apk add --no-cache gettext; \
    elif command -v apt-get >/dev/null 2>&1; then \
      apt-get update && apt-get install -y gettext-base && rm -rf /var/lib/apt/lists/*; \
    fi

ENV NAKAMA_RUNTIME_PATH=/data/modules

# At container start substitute environment variables then print resolved config (for debug) and start Nakama
CMD sh -c "envsubst < /data/nakama.yml.template > /data/nakama.yml && echo '--- BEGIN nakama.yml (resolved) ---' && sed -n '1,200p' /data/nakama.yml && echo '--- END nakama.yml ---' && exec nakama --config /data/nakama.yml"
