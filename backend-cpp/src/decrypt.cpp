#include "decrypt.h"
#include <fstream>
#include <iostream>

bool decryptFile(const std::string& filename, const std::string& key) {
    std::ifstream inFile(filename, std::ios::binary);
    if (!inFile) return false;

    std::string outFilename = filename;
    if (outFilename.size() > 4 && outFilename.substr(outFilename.size() - 4) == ".enc") {
        outFilename = outFilename.substr(0, outFilename.size() - 4);
    } else {
        outFilename += ".dec";
    }

    std::ofstream outFile(outFilename, std::ios::binary);
    if (!outFile) return false;

    char c;
    size_t i = 0;
    while (inFile.get(c)) {
        outFile.put(c ^ key[i % key.size()]);
        i++;
    }

    return true;
}
