cmake_minimum_required(VERSION 3.16)

# Project name
project(cyberbull-cpp VERSION 1.0)

# C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add executable
add_executable(cyberbull-cpp
    src/main.cpp
    src/encrypt.cpp
    src/decrypt.cpp
)

# Include directories
target_include_directories(cyberbull-cpp PRIVATE src)
