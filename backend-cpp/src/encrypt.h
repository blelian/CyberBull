#ifndef ENCRYPT_H
#define ENCRYPT_H

#include <string>

// Encrypt plaintext using passphrase. Returns JSON string with base64 "iv","ciphertext","tag" on success.
// Returns empty string on failure.
std::string encryptString(const std::string &plaintext, const std::string &passphrase);

#endif // ENCRYPT_H
