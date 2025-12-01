cmake_minimum_required(VERSION 3.16)
project(cyberbull-cpp VERSION 1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_executable(cyberbull-cpp
    src/main.cpp
    src/encrypt.cpp
    src/decrypt.cpp
    src/util.cpp
)

target_include_directories(cyberbull-cpp PRIVATE src)

find_package(OpenSSL REQUIRED)
target_link_libraries(cyberbull-cpp PRIVATE OpenSSL::Crypto OpenSSL::SSL)
