# server/Dockerfile — ensure envsubst runs before Nakama starts using ENTRYPOINT
FROM heroiclabs/nakama:latest

# Copy template and compiled modules
COPY nakama.yml /data/nakama.yml.template
COPY dist /data/modules

# Install envsubst (gettext)
RUN if command -v apk >/dev/null 2>&1; then \
      apk add --no-cache gettext; \
    elif command -v apt-get >/dev/null 2>&1; then \
      apt-get update && apt-get install -y gettext-base && rm -rf /var/lib/apt/lists/*; \
    fi

ENV NAKAMA_RUNTIME_PATH=/data/modules

# Use ENTRYPOINT to ensure the shell runs (so envsubst executes)
ENTRYPOINT ["sh", "-c", "envsubst < /data/nakama.yml.template > /data/nakama.yml && echo '--- BEGIN nakama.yml (resolved) ---' && sed -n '1,200p' /data/nakama.yml && echo '--- END nakama.yml ---' && exec nakama --config /data/nakama.yml"]
