// main.cpp
#include "encrypt.h"
#include "decrypt.h"
#include "crow_all.h" // single-header Crow library

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/encrypt")
    .methods("POST"_method)
    ([](const crow::request& req){
        auto body = req.body; // expect plain text
        std::string encrypted = encrypt(body); 
        return encrypted;
    });

    CROW_ROUTE(app, "/decrypt")
    .methods("POST"_method)
    ([](const crow::request& req){
        auto body = req.body; // expect encrypted text
        std::string decrypted = decrypt(body);
        return decrypted;
    });

    app.port(8080).multithreaded().run();
}
