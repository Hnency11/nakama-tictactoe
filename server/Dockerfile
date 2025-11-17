# Use official Nakama image
FROM heroiclabs/nakama:latest

# Copy Nakama config and compiled modules into the image
COPY nakama.yml /data/nakama.yml
COPY dist /data/modules

# Set runtime path so Nakama loads our modules
ENV NAKAMA_RUNTIME_PATH=/data/modules

# Run Nakama with the provided config
CMD ["nakama", "--config", "/data/nakama.yml"]
