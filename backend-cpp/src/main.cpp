#include <iostream>
#include <string>
#include <cstdlib>           // for std::getenv
#include <nlohmann/json.hpp>
#include "encrypt.h"
#include "decrypt.h"
#include "httplib.h"

using json = nlohmann::json;
using namespace httplib;

static const size_t MAX_BODY = 1 * 1024 * 1024; // 1 MB

int main() {
    Server svr;

    // POST /encrypt
    svr.Post("/encrypt", [](const Request& req, Response& res) {
        if (req.body.size() > MAX_BODY) {
            res.status = 413;
            res.set_content("Payload too large", "text/plain");
            return;
        }

        try {
            auto j = json::parse(req.body);
            if (!j.contains("key") || !j.contains("data")) {
                res.status = 400;
                res.set_content("Bad JSON format. Expect {\"key\":\"...\",\"data\":\"...\"}", "text/plain");
                return;
            }

            std::string key = j["key"].get<std::string>();
            std::string data = j["data"].get<std::string>();

            std::string out = encryptString(data, key);
            if (out.empty()) {
                res.status = 500;
                res.set_content("Encryption failed", "text/plain");
                return;
            }

            res.set_content(out, "application/json");
        } catch (const std::exception &ex) {
            res.status = 400;
            res.set_content(std::string("Invalid JSON: ") + ex.what(), "text/plain");
        }
    });

    // POST /decrypt
    svr.Post("/decrypt", [](const Request& req, Response& res) {
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

            std::string key = j["key"].get<std::string>();

            std::string payloadJson;
            if (j.contains("payload")) {
                payloadJson = j["payload"].dump();
            } else {
                if (!(j.contains("iv") && j.contains("ciphertext") && j.contains("tag"))) {
                    res.status = 400;
                    res.set_content("Missing ciphertext fields. Provide iv, ciphertext, tag, or payload object.", "text/plain");
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
                res.status = 400; // bad key or auth failed
                res.set_content("Decryption failed or authentication failed (bad key/modified ciphertext).", "text/plain");
                return;
            }

            json out;
            out["data"] = plaintext;
            res.set_content(out.dump(), "application/json");

        } catch (const std::exception &ex) {
            res.status = 400;
            res.set_content(std::string("Invalid JSON: ") + ex.what(), "text/plain");
        }
    });

    // Use Render-provided port if available
    int port = 8080; // default fallback
    if (const char* env_port = std::getenv("PORT")) {
        try {
            port = std::stoi(env_port);
        } catch (...) {
            std::cerr << "Invalid PORT env, using default 8080\n";
        }
    }

    std::cout << "CyberBull C++ HTTP server starting on port " << port << "\n";
    svr.listen("0.0.0.0", port);

    return 0;
}
