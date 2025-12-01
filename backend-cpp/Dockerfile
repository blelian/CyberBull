FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential cmake libssl-dev git curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy project files
COPY . .

# Download single-header libraries into the expected include paths
# httplib.h stays in src/, nlohmann/json.hpp goes to src/nlohmann/json.hpp
RUN mkdir -p src/nlohmann \
 && curl -fsSL https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h -o src/httplib.h \
 && curl -fsSL https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp -o src/nlohmann/json.hpp

# Build C++ backend
RUN mkdir -p build && cd build && cmake .. && make

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["./build/cyberbull-cpp"]
