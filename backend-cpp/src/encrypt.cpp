#include "encrypt.h"

bool encryptString(const std::string &input, const std::string &key, std::string &out) {
    if (key.empty()) return false;
    out.resize(input.size());
    for (size_t i = 0; i < input.size(); ++i) {
        out[i] = input[i] ^ key[i % key.size()];
    }
    return true;
}
