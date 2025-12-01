#include <iostream>
#include <string>
#include "encrypt.h"
#include "decrypt.h"
#include "httplib.h" // will be downloaded in Dockerfile

int main() {
    using namespace httplib;
    Server svr;

    svr.Post("/encrypt", [](const Request& req, Response& res) {
        // Expect application/json { "data": "...", "key": "..." }
        // keep parsing simple: read raw body as: data=...&key=...
        // For safety in MVP accept raw body: data|key separated by newline
        std::string body = req.body;
        // very simple format: first line = key, remaining = data
        auto pos = body.find('\n');
        if (pos == std::string::npos) {
            res.status = 400;
            res.set_content("Bad format. Send key\\ndata", "text/plain");
            return;
        }
        std::string key = body.substr(0, pos);
        std::string data = body.substr(pos + 1);

        std::string out;
        if (!encryptString(data, key, out)) {
            res.status = 500;
            res.set_content("Encryption failed", "text/plain");
            return;
        }
        res.set_content(out, "application/octet-stream");
    });

    svr.Post("/decrypt", [](const Request& req, Response& res) {
        std::string body = req.body;
        auto pos = body.find('\n');
        if (pos == std::string::npos) {
            res.status = 400;
            res.set_content("Bad format. Send key\\ndata", "text/plain");
            return;
        }
        std::string key = body.substr(0, pos);
        std::string data = body.substr(pos + 1);

        std::string out;
        if (!decryptString(data, key, out)) {
            res.status = 500;
            res.set_content("Decryption failed", "text/plain");
            return;
        }
        res.set_content(out, "application/octet-stream");
    });

    std::cout << "CyberBull C++ HTTP server starting on port 8080\n";
    svr.listen("0.0.0.0", 8080);
    return 0;
}
