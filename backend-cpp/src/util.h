#ifndef UTIL_H
#define UTIL_H

#include <string>
#include <vector>

/**
 * Encodes a vector of bytes into a Base64 string.
 * @param data Vector of bytes to encode.
 * @return Base64-encoded string.
 */
std::string base64Encode(const std::vector<unsigned char>& data);

/**
 * Decodes a Base64 string into a vector of bytes.
 * @param b64 Base64-encoded string.
 * @return Decoded vector of bytes. Returns empty vector if decoding fails.
 */
std::vector<unsigned char> base64Decode(const std::string& b64);

/**
 * Computes the SHA-256 hash of a given input string.
 * @param input Input string to hash.
 * @return Vector of 32 bytes representing the SHA-256 digest.
 */
std::vector<unsigned char> sha256(const std::string& input);

/**
 * Generates a vector of cryptographically secure random bytes.
 * @param n Number of bytes to generate.
 * @return Vector of n random bytes.
 * @throws std::runtime_error if RAND_bytes fails.
 */
std::vector<unsigned char> randomBytes(size_t n);

#endif // UTIL_H
