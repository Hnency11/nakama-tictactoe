FROM heroiclabs/nakama:latest

# Copy nakama template and compiled modules
COPY nakama.yml /data/nakama.yml.template
COPY dist /data/modules

# Copy nginx config and start script
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Install envsubst (gettext) and nginx
RUN if command -v apk >/dev/null 2>&1; then \
      apk add --no-cache gettext nginx; \
    elif command -v apt-get >/dev/null 2>&1; then \
      apt-get update && apt-get install -y gettext-base nginx && rm -rf /var/lib/apt/lists/*; \
    fi

ENV NAKAMA_RUNTIME_PATH=/data/modules

# Entrypoint runs the start script which runs envsubst, starts nakama, then runs nginx
ENTRYPOINT ["/start.sh"]
