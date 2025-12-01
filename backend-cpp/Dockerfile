FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    build-essential cmake libssl-dev git curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy project files
COPY . .

# Download single-header HTTP library for build (cpp-httplib)
RUN curl -L https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h -o src/httplib.h

RUN mkdir -p build && cd build && cmake .. && make

EXPOSE 8080

CMD ["./build/cyberbull-cpp"]
