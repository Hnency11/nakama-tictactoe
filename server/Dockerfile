FROM heroiclabs/nakama:latest

# Copy nakama template and compiled modules
COPY nakama.yml /data/nakama.yml.template
COPY dist /data/modules

# Copy nginx config and start script
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Install envsubst (gettext) and nginx non-interactively
RUN if command -v apk >/dev/null 2>&1; then \
      apk add --no-cache gettext nginx; \
    elif command -v apt-get >/dev/null 2>&1; then \
      apt-get update && \
      DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        -o Dpkg::Options::="--force-confdef" \
        -o Dpkg::Options::="--force-confold" \
        gettext-base nginx && \
      rm -rf /var/lib/apt/lists/*; \
    fi

# Ensure the start script runs as the container entrypoint so it executes
# the migrations and then starts Nakama (exec replaces the shell with Nakama).
ENTRYPOINT ["/bin/sh", "-ecx", "/start.sh"]
