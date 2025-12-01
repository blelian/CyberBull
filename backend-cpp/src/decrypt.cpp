#include "decrypt.h"

bool decryptString(const std::string &input, const std::string &key, std::string &out) {
    // XOR is symmetric, so decrypt is same as encrypt
    if (key.empty()) return false;
    out.resize(input.size());
    for (size_t i = 0; i < input.size(); ++i) {
        out[i] = input[i] ^ key[i % key.size()];
    }
    return true;
}
