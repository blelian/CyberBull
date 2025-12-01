#ifndef UTIL_H
#define UTIL_H

#include <string>
#include <vector>

std::string base64Encode(const std::vector<unsigned char>& data);
std::vector<unsigned char> base64Decode(const std::string& b64);
std::vector<unsigned char> sha256(const std::string& input);
std::vector<unsigned char> randomBytes(size_t n);

#endif // UTIL_H
