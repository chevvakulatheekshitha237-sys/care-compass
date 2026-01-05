const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-insecure-key-change-in-production';

export async function encryptData(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const keyBuffer = await crypto.subtle.importKey(
      'raw',
      encoder.encode(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      keyBuffer,
      dataBuffer
    );

    const encryptedArray = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decryptData(encryptedData: string): Promise<string> {
  try {
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(c => c.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const encryptedArray = combined.slice(12);

    const encoder = new TextEncoder();
    const keyBuffer = await crypto.subtle.importKey(
      'raw',
      encoder.encode(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      keyBuffer,
      encryptedArray
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}
