FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential cmake libssl-dev git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Build
RUN mkdir -p build && cd build && cmake .. && make

# Expose port
EXPOSE 8080

# Run the executable
CMD ["./build/cyberbull-cpp"]
