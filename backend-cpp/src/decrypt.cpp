#include "decrypt.h"
#include "util.h"
#include <openssl/evp.h>
#include <openssl/err.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <vector>

using json = nlohmann::json;

std::string decryptString(const std::string &inputJson, const std::string &passphrase) {
    if (passphrase.empty()) return "";

    try {
        json j = json::parse(inputJson);
        if (!j.contains("iv") || !j.contains("ciphertext") || !j.contains("tag")) {
            return "";
        }
        std::string iv_b64 = j["iv"].get<std::string>();
        std::string ct_b64 = j["ciphertext"].get<std::string>();
        std::string tag_b64 = j["tag"].get<std::string>();

        std::vector<unsigned char> iv = base64Decode(iv_b64);
        std::vector<unsigned char> ciphertext = base64Decode(ct_b64);
        std::vector<unsigned char> tag = base64Decode(tag_b64);

        std::vector<unsigned char> key = sha256(passphrase);

        EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
        if (!ctx) return "";

        if (1 != EVP_DecryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL)) { EVP_CIPHER_CTX_free(ctx); return ""; }
        if (1 != EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, static_cast<int>(iv.size()), NULL)) { EVP_CIPHER_CTX_free(ctx); return ""; }
        if (1 != EVP_DecryptInit_ex(ctx, NULL, NULL, key.data(), iv.data())) { EVP_CIPHER_CTX_free(ctx); return ""; }

        std::vector<unsigned char> plaintext(ciphertext.size() + EVP_CIPHER_block_size(EVP_aes_256_gcm()));
        int outlen = 0;
        if (1 != EVP_DecryptUpdate(ctx,
                                   plaintext.data(), &outlen,
                                   ciphertext.data(), static_cast<int>(ciphertext.size()))) {
            EVP_CIPHER_CTX_free(ctx);
            return "";
        }
        int total_len = outlen;

        // set expected tag
        if (1 != EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_TAG, static_cast<int>(tag.size()), tag.data())) {
            EVP_CIPHER_CTX_free(ctx);
            return "";
        }

        int rc = EVP_DecryptFinal_ex(ctx, plaintext.data() + outlen, &outlen);
        EVP_CIPHER_CTX_free(ctx);
        if (rc <= 0) {
            // authentication failed
            return "";
        }
        total_len += outlen;
        plaintext.resize(total_len);
        return std::string(reinterpret_cast<char*>(plaintext.data()), plaintext.size());
    } catch (const std::exception &ex) {
        std::cerr << "decrypt error: " << ex.what() << std::endl;
        return "";
    }
}
