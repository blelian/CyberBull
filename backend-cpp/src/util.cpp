#include "util.h"
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/err.h>
#include <openssl/sha.h>
#include <stdexcept>

/**
 * Encodes a vector of bytes into a Base64 string.
 * @param data Vector of bytes to encode.
 * @return Base64-encoded string. Returns empty string if input is empty.
 */
std::string base64Encode(const std::vector<unsigned char>& data) {
    if (data.empty()) return "";
    int len = static_cast<int>(data.size());
    // EVP_EncodeBlock requires unsigned char*
    int out_len = 4 * ((len + 2) / 3);
    std::string out(out_len, '\0');
    EVP_EncodeBlock(reinterpret_cast<unsigned char*>(&out[0]), data.data(), len);
    return out;
}

/**
 * Decodes a Base64 string into a vector of bytes.
 * @param b64 Base64-encoded string.
 * @return Decoded vector of bytes. Returns empty vector if input is empty or decoding fails.
 */
std::vector<unsigned char> base64Decode(const std::string& b64) {
    if (b64.empty()) return {};
    int in_len = static_cast<int>(b64.size());
    int out_len = (in_len / 4) * 3 + 1;
    std::vector<unsigned char> out(out_len);
    int dec_len = EVP_DecodeBlock(out.data(),
                                  reinterpret_cast<const unsigned char*>(b64.data()),
                                  in_len);
    if (dec_len < 0) return {};
    // EVP_DecodeBlock may include padding bytes; remove padding based on '=' characters
    int pad = 0;
    if (!b64.empty()) {
        if (b64.size() >= 1 && b64[b64.size()-1] == '=') ++pad;
        if (b64.size() >= 2 && b64[b64.size()-2] == '=') ++pad;
    }
    dec_len -= pad;
    out.resize(dec_len);
    return out;
}

/**
 * Computes the SHA-256 hash of an input string.
 * @param input Input string to hash.
 * @return Vector of 32 bytes representing the SHA-256 digest.
 */
std::vector<unsigned char> sha256(const std::string& input) {
    std::vector<unsigned char> out(SHA256_DIGEST_LENGTH);
    SHA256_CTX ctx;
    SHA256_Init(&ctx);
    SHA256_Update(&ctx, reinterpret_cast<const unsigned char*>(input.data()), input.size());
    SHA256_Final(out.data(), &ctx);
    return out;
}

/**
 * Generates a vector of cryptographically secure random bytes.
 * @param n Number of bytes to generate.
 * @return Vector of n random bytes.
 * @throws std::runtime_error if RAND_bytes fails.
 */
std::vector<unsigned char> randomBytes(size_t n) {
    std::vector<unsigned char> out(n);
    if (1 != RAND_bytes(out.data(), static_cast<int>(n))) {
        throw std::runtime_error("RAND_bytes failed");
    }
    return out;
}
