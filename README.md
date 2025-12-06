CyberBull C++ Encryption/Decryption Toolkit

A cybersecurity backend prototype built using modern C++17.The main functionality is a fully working encryption/decryption service using AES-256-GCM, exposing a REST API for string and file encryption.

This submission includes a fully working C++ backend, which is dockerized (Podman-compatible) and accepts HTTP requests, returning JSON responses.

Overview

CyberBull is designed to securely encrypt and decrypt user-provided data with a passphrase.The system is organized as:

C++ Backend → Encryption/decryption service

REST API → Endpoints for /encrypt and /decrypt

Docker/Podman Container → Ensures consistent deployment

Frontend-compatible → Supports CORS for integration with web or mobile clients

This project satisfies the course requirement by providing a fully functional, deployed backend written in C++.

Backend Features

What the C++ service does

AES-256-GCM encryption/decryption with SHA-256 key derivation

Base64-encoded JSON output for IV, ciphertext, and authentication tag

REST API:

POST /encrypt – encrypts data

POST /decrypt – decrypts data

Handles CORS preflight requests (OPTIONS) for frontend integration

Fully dockerized (compatible with Podman)

Why it is minimal

The goal was clarity and correctness:

Proves ability to write a working C++ server with OpenSSL

Demonstrates modular C++ code with proper function-level comments

Exception-safe and handles invalid/malformed JSON

Fully deployable in container environments

Folder Structure

backend-cpp/
│
├── src/
│   ├── main.cpp        # HTTP server and endpoints
│   ├── encrypt.cpp/h   # AES-256-GCM encryption
│   ├── decrypt.cpp/h   # AES-256-GCM decryption
│   ├── util.cpp/h      # helpers: Base64, SHA256, random bytes
│   └── nlohmann/json.hpp
├── Dockerfile
├── CMakeLists.txt
└── README.md

Environment Variables

The server binds to a dynamic port provided via environment variable:

PORT=8080

Podman or deployment platforms can inject this automatically. Default is 8080.

Running the Backend

With Podman (preferred)

podman build -t cyberbull-cpp .
podman run -p 8080:8080 cyberbull-cpp

Locally (without containers)

mkdir build && cd build
cmake ..
make
./cyberbull-cpp

Expected output:

CyberBull C++ server running on port 8080

Then open in the browser or use a REST client to interact:

http://localhost:8080

API Endpoints

POST /encrypt

Request:

{
  "key": "your-passphrase",
  "data": "plaintext to encrypt"
}

Response:

{
  "iv": "...",
  "ciphertext": "...",
  "tag": "..."
}

POST /decrypt

Request:

{
  "key": "your-passphrase",
  "payload": {
    "iv": "...",
    "ciphertext": "...",
    "tag": "..."
  }
}

Response:

{
  "data": "original plaintext"
}

CORS headers are included in all responses for frontend integration.

Video Demonstration

A 4–5 minute walkthrough showing:

Running the C++ backend in Podman

Encrypting and decrypting sample data

Overview of main.cpp, encrypt.cpp, decrypt.cpp, and util.cpp

Function-level comments explanation

Video Link: [Insert your video link here]

Time Log & Reflection

Total Hours Spent: ~24 hoursDaily Log (example):

Monday — 3 hours: planned module and project skeleton

Tuesday — 5 hours: implemented encryption/decryption, utility functions

Wednesday — 4 hours: implemented HTTP server with cpp-httplib

Thursday — 4 hours: tested endpoints and handled JSON parsing

Friday — 3 hours: wrote README, added comments

Saturday — 5 hours: recorded demo video, final testing, containerization

Learning Strategies Reflection:

What worked: Modular C++ design, small iterative steps, test frequently

What didn’t work: Initial JSON parsing errors slowed progress

Next time: Record verification video earlier, implement containerization alongside development

Summary

Even though the backend is minimal, it is:

Correct and functional

Fully commented with 100+ lines of code

Integrated into container for deployment

API-ready with CORS and proper error handling

Links

Video demo: https://youtu.be/HVTvnvKdvBI

GitHub repository: https://github.com/blelian/CyberBull.git

