import * as crypto from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(crypto.scrypt);

export async function hashPassword(password: string) {
    // 1. Generate a unique, random salt with a length of 16 bytes
    const salt = crypto.randomBytes(16).toString('hex');

    // 2. Derive the key. The result is raw data (a Buffer).
    // 64 bytes is the final size of our hash
    const derivedKeyRaw = await scryptAsync(password, salt, 64) as Buffer;

    // 3. Convert the raw data (Buffer) into a readable Hex String for storage.
    const hashHex = derivedKeyRaw.toString('hex');

    // 4. Put the salt and the hash together, separated by a colon (:)
    return `${salt}:${hashHex}`;
}

export async function comparePasswords(password: string, storedValue: string) {
    // 1. Split the stored value to get the salt and hash
    const [salt, originalHashHex] = storedValue.split(':');

    if (salt === undefined || originalHashHex === undefined) {
        return false;
    }
    
    // 2. Re-hash the attempt
    const derivedKeyRaw = await scryptAsync(password, salt, 64) as Buffer;
    
    // 3. Convert stored hash to Buffer
    const originalHashBuffer = Buffer.from(originalHashHex, 'hex');

    // 4. Length check (Necessary to prevent crypto.timingSafeEqual from crashing)
    if (originalHashBuffer.length !== derivedKeyRaw.length) {
        return false;
    }

    // 5. Constant-time comparison
    return crypto.timingSafeEqual(originalHashBuffer, derivedKeyRaw);
}