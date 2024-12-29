import CryptoJS from "crypto-js";

const secretKey = process.env.REACT_APP_SECRET_KEY || 'DEFAULT_32_CHARACTER_KEY'; // Ensure the key is exactly 32 characters

export const encryptPayload = (payload: object): string => {
    const payloadString = JSON.stringify(payload); // Convert the payload to a string
    return CryptoJS.AES.encrypt(payloadString, secretKey).toString();
};

export const decryptPayload = (encryptedData: string): object => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString); // Parse back to JSON object
};
