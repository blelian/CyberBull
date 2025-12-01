cmake_minimum_required(VERSION 3.16)
project(cyberbull-cpp VERSION 1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_executable(cyberbull-cpp
    src/main.cpp
    src/encrypt.cpp
    src/decrypt.cpp
)

target_include_directories(cyberbull-cpp PRIVATE src)
# no external link libraries required for cpp-httplib single header
