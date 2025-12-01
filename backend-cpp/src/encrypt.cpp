#include "encrypt.h"
#include "util.h"
#include <openssl/evp.h>
#include <openssl/err.h>
#include <nlohmann/json.hpp> // single-header (json.hpp)
#include <vector>
#include <iostream>

using json = nlohmann::json;

std::string encryptString(const std::string &plaintext, const std::string &passphrase) {
    if (passphrase.empty()) return "";

    try {
        // Derive 256-bit key by SHA-256(passphrase)
        std::vector<unsigned char> key = sha256(passphrase);

        // Generate 12-byte IV for GCM
        std::vector<unsigned char> iv = randomBytes(12);

        EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
        if (!ctx) return "";

        int rc = EVP_EncryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL);
        if (rc != 1) { EVP_CIPHER_CTX_free(ctx); return ""; }

        // set IV length (12 is default but set explicitly)
        EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, static_cast<int>(iv.size()), NULL);

        rc = EVP_EncryptInit_ex(ctx, NULL, NULL, key.data(), iv.data());
        if (rc != 1) { EVP_CIPHER_CTX_free(ctx); return ""; }

        std::vector<unsigned char> ciphertext(plaintext.size() + EVP_CIPHER_block_size(EVP_aes_256_gcm()));
        int outlen = 0;
        rc = EVP_EncryptUpdate(ctx,
                               ciphertext.data(), &outlen,
                               reinterpret_cast<const unsigned char*>(plaintext.data()),
                               static_cast<int>(plaintext.size()));
        if (rc != 1) { EVP_CIPHER_CTX_free(ctx); return ""; }
        int total_len = outlen;

        rc = EVP_EncryptFinal_ex(ctx, ciphertext.data() + outlen, &outlen);
        if (rc != 1) { EVP_CIPHER_CTX_free(ctx); return ""; }
        total_len += outlen;
        ciphertext.resize(total_len);

        std::vector<unsigned char> tag(16);
        EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_GET_TAG, static_cast<int>(tag.size()), tag.data());

        EVP_CIPHER_CTX_free(ctx);

        json j;
        j["iv"] = base64Encode(iv);
        j["ciphertext"] = base64Encode(ciphertext);
        j["tag"] = base64Encode(tag);

        return j.dump();
    } catch (const std::exception &ex) {
        std::cerr << "encryption error: " << ex.what() << std::endl;
        return "";
    }
}
