#ifndef DECRYPT_H
#define DECRYPT_H

#include <string>

// Decrypt expects a JSON string or separate fields? Here we accept iv/ciphertext/tag as base64 inside JSON payload.
// inputJson must be: { "iv":"...","ciphertext":"...","tag":"..." }
// key is passphrase. Returns plaintext string on success, empty string on failure.
std::string decryptString(const std::string &inputJson, const std::string &passphrase);

#endif // DECRYPT_H
