#include "encrypt.h"
#include <fstream>
#include <iostream>

bool encryptFile(const std::string& filename, const std::string& key) {
    std::ifstream inFile(filename, std::ios::binary);
    if (!inFile) return false;

    std::ofstream outFile(filename + ".enc", std::ios::binary);
    if (!outFile) return false;

    char c;
    size_t i = 0;
    while (inFile.get(c)) {
        outFile.put(c ^ key[i % key.size()]); // simple XOR encryption
        i++;
    }

    return true;
}
