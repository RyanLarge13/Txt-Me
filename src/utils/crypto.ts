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

import { NewMessageArrayBuffersType } from "../types/cryptoTypes";
import { Base64StringType } from "../types/messageTypes";
import { tryCatch } from "./helpers";

/*
  NOTE:
    When keys come via socket from the server as strings this method will turn those
    strings back into ArrayBuffers that can be imported or exported via 
    window.crypto.subtle
*/
export const Crypto_Base64ToArrayBuffer = (base64: string) => {
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
    Use this function to make ArrayBuffers deriving from CryptoKeys transferrable
    through the network either via socket or http and keep the readability universal.
    Not all servers, network protocols or other tech will read ArrayBuffers the same
    unlike a more universal base64 string
*/
export const Crypto_ArrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
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

export const Crypto_ExportRSAPublicKey = async (
  RSAKeyPair: CryptoKeyPair
): Promise<ArrayBuffer> =>
  await crypto.subtle.exportKey("spki", RSAKeyPair.publicKey);

export const Crypto_ExportRSAPrivateKey = async (
  RSAKeyPair: CryptoKeyPair
): Promise<ArrayBuffer> =>
  await crypto.subtle.exportKey("pkcs8", RSAKeyPair.privateKey);

/*
    NOTE:
      Export key to encrypt it with public RSA
  */
export const Crypto_GetRawAESKey = async (
  aesKey: CryptoKey
): Promise<ArrayBuffer> => await crypto.subtle.exportKey("raw", aesKey);

export const Crypto_ImportPrivateRSAKey = async (
  RSAPrivateKey: ArrayBuffer
): Promise<CryptoKey> =>
  await crypto.subtle.importKey(
    "pkcs8",
    RSAPrivateKey,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  );

/*
  NOTE:
    Import key retrieved from server
*/
export const Crypto_ImportPublicRSAKey = async (
  receiversPublicKey_Base64: string
): Promise<CryptoKey> =>
  await crypto.subtle.importKey(
    "spki",
    Crypto_Base64ToArrayBuffer(receiversPublicKey_Base64),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

/*
    NOTE:
      Encrypt AES key with receivers public RSA key
  */

export const Crypto_EncryptAESKeyWithReceiversPublicRSAKey = async (
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
  aesKey: ArrayBuffer
): Promise<ArrayBuffer> =>
  await crypto.subtle.decrypt({ name: "RSA-OAEP" }, myPrivateRSAKey, aesKey);

export const Crypto_ImportAESKeyFromSender = async (
  rawAESKey: ArrayBuffer
): Promise<CryptoKey> =>
  await crypto.subtle.importKey("raw", rawAESKey, { name: "AES-GCM" }, false, [
    "decrypt",
  ]);

/*
    NOTE:
      Use it!
          
          const message = new TextDecoder().decode(Crypto_GetPlainText(...));
  */
export const Crypto_GetPlainText = async (
  iv: ArrayBuffer,
  aesKey: CryptoKey,
  ciphertext: ArrayBuffer
): Promise<ArrayBuffer> =>
  await crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, ciphertext);

/*
  NOTE:
    High level method to generate RSA keys and export them as ArrayBuffers in a single call
    while still handling errors
*/
export const Crypto_GenRSAKeyPairAndExportAsArrayBuffers = async (): Promise<{
  private: ArrayBuffer;
  public: ArrayBuffer;
}> => {
  const { data: RSAKeyPair, error: keyPairGenError } = await tryCatch(
    Crypto_GenRSAKeyPair
  );

  if (keyPairGenError || !RSAKeyPair) {
    throw new Error(
      `Error generating RSA key pair in constants. ${keyPairGenError}`
    );
  }

  const { data: exportedRSAPublicKey, error: exportRSAKeyError } =
    await tryCatch<ArrayBuffer>(() => Crypto_ExportRSAPublicKey(RSAKeyPair));
  const { data: exportedRSAPrivateKey, error: exportRSAKeyErrorPrivate } =
    await tryCatch<ArrayBuffer>(() => Crypto_ExportRSAPrivateKey(RSAKeyPair));

  if (
    !exportedRSAPrivateKey ||
    !exportedRSAPublicKey ||
    exportRSAKeyError ||
    exportRSAKeyErrorPrivate
  ) {
    throw new Error(
      `Error generating exported RSA key pairs. ${exportRSAKeyError}... AND ${exportRSAKeyErrorPrivate}`
    );
  }

  return {
    private: exportedRSAPrivateKey,
    public: exportedRSAPublicKey,
  };
};

export const Crypto_GenAESKeyAndExportAsArrayBuffer =
  async (): Promise<ArrayBuffer> => {
    const { data: AESKey, error: AESKeyGenError } = await tryCatch<CryptoKey>(
      Crypto_GenAESKey
    );

    if (AESKeyGenError || !AESKey) {
      throw new Error(`Error generating AES key. ${AESKeyGenError}`);
    }

    const { data: AESKeyExported, error: errorExportingAESKey } =
      await tryCatch<ArrayBuffer>(() => Crypto_GetRawAESKey(AESKey));

    if (errorExportingAESKey || !AESKeyExported) {
      throw new Error(`Error exporting raw AES key. ${errorExportingAESKey}`);
    }

    return AESKeyExported;
  };

export const Crypto_NewMessageToArrayBuffers = (
  encryptedMessage: Base64StringType,
  IV: Base64StringType,
  sendersAESKey: Base64StringType
): NewMessageArrayBuffersType => {
  const bufferMessage = Crypto_Base64ToArrayBuffer(encryptedMessage);
  const bufferIv = Crypto_Base64ToArrayBuffer(IV);
  const bufferSendersAESKey = Crypto_Base64ToArrayBuffer(sendersAESKey);

  return {
    encryptedMessage: bufferMessage,
    IV: bufferIv,
    senderAESKey: bufferSendersAESKey,
  };
};
