# server/Dockerfile
# Use official Nakama image
FROM heroiclabs/nakama:latest

# Copy nakama.yml (template) and compiled modules into the image
COPY nakama.yml /data/nakama.yml.template
COPY dist /data/modules

# Install envsubst (gettext) to allow runtime variable substitution, if package manager exists
# heroiclabs/nakama is based on Alpine/Debian depending on tag; try apk then apt-get fallback
RUN if command -v apk >/dev/null 2>&1; then \
      apk add --no-cache gettext; \
    elif command -v apt-get >/dev/null 2>&1; then \
      apt-get update && apt-get install -y gettext-base && rm -rf /var/lib/apt/lists/*; \
    fi

# Set runtime path so Nakama loads our modules
ENV NAKAMA_RUNTIME_PATH=/data/modules

# At container start, substitute environment variables into the template and start Nakama
CMD sh -c "envsubst < /data/nakama.yml.template > /data/nakama.yml && exec nakama --config /data/nakama.yml"
