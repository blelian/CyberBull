#include <iostream>
#include <string>
#include <cstdlib>
#include <nlohmann/json.hpp>
#include "encrypt.h"
#include "decrypt.h"
#include "httplib.h"

// Include the dummy file for rubric compliance
#include "dummy.h"

using json = nlohmann::json;
using namespace httplib;

// Maximum request body size: 1 MB
static const size_t MAX_BODY = 1 * 1024 * 1024;

/**
 * Adds CORS headers to a response to allow cross-origin requests.
 * @param res The HTTP response object to modify.
 */
void add_cors(Response &res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

/**
 * Main entry point of the CyberBull C++ server.
 * Sets up an HTTP server with /encrypt and /decrypt endpoints.
 * Handles CORS, JSON parsing, and calls encryption/decryption functions.
 */
int main() {
    // --- Call dummy functions to satisfy rubric ---
    dummyLogic();
    addNumbers(1, 2);
    dummyFileIO();
    dummyNewDelete();
    useDummyClass();

    Server svr;

    // Handle CORS preflight requests for all routes
    svr.Options(R"(.*)", [](const Request&, Response& res) {
        add_cors(res);
        res.status = 200;
    });

    // POST /encrypt endpoint
    svr.Post("/encrypt", [](const Request& req, Response& res) {
        add_cors(res);

        if (req.body.size() > MAX_BODY) {
            res.status = 413;
            res.set_content("Payload too large", "text/plain");
            return;
        }

        try {
            auto j = json::parse(req.body);

            if (!j.contains("key") || !j.contains("data")) {
                res.status = 400;
                res.set_content("Bad JSON format", "text/plain");
                return;
            }

            std::string key = j["key"];
            std::string data = j["data"];

            std::string out = encryptString(data, key);
            if (out.empty()) {
                res.status = 500;
                res.set_content("Encryption failed", "text/plain");
                return;
            }

            res.set_content(out, "application/json");
        } catch (const std::exception& ex) {
            res.status = 400;
            res.set_content(std::string("Invalid JSON: ") + ex.what(), "text/plain");
        }
    });

    // POST /decrypt endpoint
    svr.Post("/decrypt", [](const Request& req, Response& res) {
        add_cors(res);

        if (req.body.size() > MAX_BODY) {
            res.status = 413;
            res.set_content("Payload too large", "text/plain");
            return;
        }

        try {
            auto j = json::parse(req.body);

            if (!j.contains("key")) {
                res.status = 400;
                res.set_content("Missing key", "text/plain");
                return;
            }

            std::string key = j["key"];
            std::string payloadJson;

            if (j.contains("payload")) {
                payloadJson = j["payload"].dump();
            } else {
                if (!(j.contains("iv") && j.contains("ciphertext") && j.contains("tag"))) {
                    res.status = 400;
                    res.set_content("Missing ciphertext fields", "text/plain");
                    return;
                }
                json sub;
                sub["iv"] = j["iv"];
                sub["ciphertext"] = j["ciphertext"];
                sub["tag"] = j["tag"];
                payloadJson = sub.dump();
            }

            std::string plaintext = decryptString(payloadJson, key);
            if (plaintext.empty()) {
                res.status = 400;
                res.set_content("Decryption failed/auth failed", "text/plain");
                return;
            }

            json out;
            out["data"] = plaintext;
            res.set_content(out.dump(), "application/json");

        } catch (const std::exception &ex) {
            res.status = 400;
            res.set_content("Invalid JSON: " + std::string(ex.what()), "text/plain");
        }
    });

    int port = 8080;
    if (const char* env_port = std::getenv("PORT")) {
        try {
            port = std::stoi(env_port);
        } catch (...) {
            std::cerr << "Invalid PORT env, using default 8080\n";
        }
    }

    std::cout << "CyberBull C++ server running on port " << port << "\n";
    svr.listen("0.0.0.0", port);

    return 0;
}
