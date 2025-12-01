FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential cmake libssl-dev git curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy project files
COPY . .

# Download single-header HTTP library for build (cpp-httplib)
RUN curl -fsSL https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h -o src/httplib.h \
 && curl -fsSL https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp -o src/json.hpp

RUN mkdir -p build && cd build && cmake .. && make

EXPOSE 8080

CMD ["./build/cyberbull-cpp"]
