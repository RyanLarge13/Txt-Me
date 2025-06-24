/*
  NOTE:
    Supported crypto algorithms:

| Algorithm              | `generateKey` support  | Notes                                                    |
| ---------------------- | ---------------------  | -------------------------------------------------------- |
| **RSA-OAEP**           | ✅                     | Asymmetric, for encryption/decryption                    |
| **RSASSA-PKCS1-v1\_5** | ✅                     | Asymmetric, for signing/verifying                        |
| **RSA-PSS**            | ✅                     | Asymmetric, for signing/verifying                        |
| **ECDSA / ECDH**       | ✅                     | Asymmetric, for signing (ECDSA) or key agreement (ECDH)  |
| **AES-GCM**            | ✅                     | Symmetric, for encryption/decryption with authentication |
| **AES-CBC**            | ✅                     | Symmetric, for encryption/decryption                     |
| **AES-CTR**            | ✅                     | Symmetric, for encryption/decryption                     |
| **HMAC**               | ✅                     | Symmetric, for signatures (message authentication)       |

*/

export const base64ToArrayBuffer = (base64: string) => {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/*
  NOTE:
    AES key generation
*/
export const Crypto_GenAESKey = async (): Promise<CryptoKey> =>
  await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM", // or "AES-CBC", "AES-CTR"
      length: 256, // 128, 192, or 256 bits
    },
    true, // extractable (true = can export key material if needed)
    ["encrypt", "decrypt"] // key usages (could also include "wrapKey", "unwrapKey")
  );

/*
  NOTE:
    RSA key generation
*/
export const Crypto_GenRSAKeyPair = async (): Promise<{
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}> =>
  await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP", // or "RSASSA-PKCS1-v1_5" or "RSA-PSS" for signatures
      modulusLength: 2048, // 2048 or 4096 are common (2048 minimum recommended)
      publicExponent: new Uint8Array([1, 0, 1]), // standard exponent (65537)
      hash: "SHA-256", // hashing algorithm used for OAEP
    },
    true, // extractable (true = can export keys, false = can't export)
    ["encrypt", "decrypt"] // key usages (could also be ["wrapKey", "unwrapKey"])
  );

/*
  NOTE:
    IV
*/
export const Crypto_GenIV = (): BufferSource =>
  crypto.getRandomValues(new Uint8Array(12));

/*
  NOTE:
    AES key encryption
*/
export const Crypto_EncryptMessageWithAES = async (
  iv: BufferSource,
  aesKey: CryptoKey,
  message: string
) =>
  await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    new TextEncoder().encode(message)
  );

/*
    NOTE:
      Export key to encrypt it with public RSA
  */
export const Crypto_GetRawAESKey = async (
  aesKey: CryptoKey
): Promise<BufferSource> => await crypto.subtle.exportKey("raw", aesKey);

/*
  NOTE:
    Import key from server
*/
export const Crypto_GetReceiversPublicRSAKey = async (
  receiversPublicKey_Base64: string
): Promise<CryptoKey> =>
  await crypto.subtle.importKey(
    "spki",
    base64ToArrayBuffer(receiversPublicKey_Base64),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

/*
    NOTE:
      Encrypt AES key with receivers public RSA key
  */

export const Crypto_EncryptAESKeyWithReceiversRSAKey = async (
  receiversRSAPublicKey: CryptoKey,
  rawAESKey: BufferSource
) =>
  await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    receiversRSAPublicKey,
    rawAESKey
  );

/*
    NOTE:
      Message data overview by end and sending ready state

        {
            "to": "bob",
            "from": "alice",
            "encryptedAESKey": "<RSA-encrypted AES key>",
            "iv": "<IV in base64>",
            "ciphertext": "<AES-GCM encrypted message in base64>"
        }

*/

/*
  NOTE:
    Receiving end decrypts the AES key with their private and public RSA key
*/
export const Crypto_DecryptRawAESKeyFromSenderWithRSAPrivateKey = async (
  myPrivateRSAKey: CryptoKey,
  aesKey: BufferSource
) => await crypto.subtle.decrypt({ name: "RSA-OAEP" }, myPrivateRSAKey, aesKey);

export const Crypto_ImportAESKeyFromSender = async (rawAESKey: BufferSource) =>
  await crypto.subtle.importKey("raw", rawAESKey, { name: "AES-GCM" }, false, [
    "decrypt",
  ]);

export const Crypto_GetPlainText = async (
  iv: BufferSource,
  aesKey: CryptoKey,
  ciphertext: BufferSource
) => await crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, ciphertext);

/*
  NOTE:
    Use it!
        
        const message = new TextDecoder().decode(Crypto_GetPlainText(...));
*/
