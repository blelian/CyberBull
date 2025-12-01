#include "util.h"
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/err.h>
#include <openssl/sha.h>
#include <stdexcept>

std::string base64Encode(const std::vector<unsigned char>& data) {
    if (data.empty()) return "";
    int len = static_cast<int>(data.size());
    // EVP_EncodeBlock requires unsigned char*
    int out_len = 4 * ((len + 2) / 3);
    std::string out(out_len, '\0');
    EVP_EncodeBlock(reinterpret_cast<unsigned char*>(&out[0]), data.data(), len);
    return out;
}

std::vector<unsigned char> base64Decode(const std::string& b64) {
    if (b64.empty()) return {};
    int in_len = static_cast<int>(b64.size());
    int out_len = (in_len / 4) * 3 + 1;
    std::vector<unsigned char> out(out_len);
    int dec_len = EVP_DecodeBlock(out.data(),
                                  reinterpret_cast<const unsigned char*>(b64.data()),
                                  in_len);
    if (dec_len < 0) return {};
    // EVP_DecodeBlock may include padding bytes; remove possible nulls at end
    // Adjust actual length based on '=' padding characters
    int pad = 0;
    if (!b64.empty()) {
        if (b64.size() >= 1 && b64[b64.size()-1] == '=') ++pad;
        if (b64.size() >= 2 && b64[b64.size()-2] == '=') ++pad;
    }
    dec_len -= pad;
    out.resize(dec_len);
    return out;
}

std::vector<unsigned char> sha256(const std::string& input) {
    std::vector<unsigned char> out(SHA256_DIGEST_LENGTH);
    SHA256_CTX ctx;
    SHA256_Init(&ctx);
    SHA256_Update(&ctx, reinterpret_cast<const unsigned char*>(input.data()), input.size());
    SHA256_Final(out.data(), &ctx);
    return out;
}

std::vector<unsigned char> randomBytes(size_t n) {
    std::vector<unsigned char> out(n);
    if (1 != RAND_bytes(out.data(), static_cast<int>(n))) {
        throw std::runtime_error("RAND_bytes failed");
    }
    return out;
}
