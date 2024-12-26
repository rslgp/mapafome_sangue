export default class AES256 {
    constructor(secretKey) {
        if (!secretKey || secretKey.length < 32) {
            throw new Error("Key must be at least 32 characters (256 bits).");
        }
        this.secretKey = new TextEncoder().encode(secretKey.slice(0, 32)); // Ensure key is 32 bytes
    }

    /**
     * Generate a CryptoKey for AES-CBC.
     */
    async getCryptoKey() {
        return await crypto.subtle.importKey(
            "raw",
            this.secretKey,
            { name: "AES-CBC" },
            false,
            ["encrypt", "decrypt"]
        );
    }

    /**
     * Encrypts plaintext data.
     * @param {string} plaintext - The text to encrypt.
     * @returns {Promise<{ iv: string, encrypted: string }>} - IV and encrypted data as base64.
     */
    async encrypt(plaintext) {
        const cryptoKey = await this.getCryptoKey();

        // Generate a random IV
        const iv = crypto.getRandomValues(new Uint8Array(16));

        // Encode plaintext into bytes
        const data = new TextEncoder().encode(plaintext);

        // Encrypt data
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: "AES-CBC", iv },
            cryptoKey,
            data
        );

        // Convert to base64 for easier storage or transport
        const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
        const ivBase64 = btoa(String.fromCharCode(...iv));

        return { iv: ivBase64, encrypted: encryptedBase64 };
    }

    /**
     * Decrypts encrypted data.
     * @param {string} encrypted - The encrypted data in base64 format.
     * @param {string} iv - The IV used for encryption in base64 format.
     * @returns {Promise<string>} - The decrypted plaintext.
     */
    async decrypt(encrypted, iv) {
        const cryptoKey = await this.getCryptoKey();

        // Decode base64 into Uint8Array
        const encryptedBytes = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
        const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

        // Decrypt data
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv: ivBytes },
            cryptoKey,
            encryptedBytes
        );

        // Convert decrypted buffer to string
        return new TextDecoder().decode(decryptedBuffer);
    }
}

async function demo() {
    const key = "2af790aa2ea83f941974d0f3ebdb3f4714912f31a19090237dff63ef4ed7011F"; // 32 characters
    console.log(key)
    const aes = new AES256(key);

    const plaintext = "ascomfhb";
    console.log("Plaintext:", plaintext);

    // Encrypt
    const { iv, encrypted } = await aes.encrypt(plaintext);
    console.log("Encrypted:", encrypted);
    console.log("IV:", iv);

    // Decrypt
    const decrypted = await aes.decrypt(encrypted, iv);
    console.log("Decrypted:", decrypted);
}

demo().catch(console.error);
