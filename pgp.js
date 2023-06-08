const fs = require('fs');
const path = require('path');
const openpgp = require('openpgp');

// Function to read key file and return key data
async function readKeyFile(keyFilePath) {
    const keyFile = fs.readFileSync(keyFilePath, 'utf-8');
    console.log(keyFile);
    const key = await openpgp.readKey({ armoredKey: keyFile });
    return key;
}

// PGP encryption function
async function encryptMessage(message, publicKey) {
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }), // input as Message object
        encryptionKeys: publicKey,
        //signingKeys: privateKey // optional
    });
    return encrypted;
}

// PGP decryption function
async function decryptMessage(encryptedMessage, keyFilePath, passphrase) {
    const privateKeyArmored = fs.readFileSync(keyFilePath, 'utf-8');
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });

    const message = await openpgp.readMessage({
        armoredMessage: encryptedMessage // parse armored message
    });
    const { data: decrypted } = await openpgp.decrypt({
        message,
 //       verificationKeys: publicKey, // optional
        decryptionKeys: privateKey
    });
    return decrypted;
}

// PGP file signing function
async function signFile(fileContent, keyFilePath, passphrase) {
    const privateKeyArmored = fs.readFileSync(keyFilePath, 'utf-8');
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });

    const unsignedMessage = await openpgp.createCleartextMessage({ text: fileContent });
    const signedMessage = await openpgp.sign({
        message: unsignedMessage, // CleartextMessage or Message object
        signingKeys: privateKey
    });
   // console.log(signedMessage); // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
​
    return signedMessage;
}

// PGP signature verification function
async function verifySignature(signedTextArmored, keyFilePath) {
    const publicKeyArmored = fs.readFileSync(keyFilePath, 'utf-8');
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const signedMessage = await openpgp.readCleartextMessage({
        cleartextMessage: signedTextArmored // parse armored message
    });
    const verificationResult = await openpgp.verify({
        message: signedMessage,
        verificationKeys: publicKey
    });
   // console.log(verificationResult);
    const { verified, keyID } = verificationResult.signatures[0];
    try {
        await verified; // throws on invalid signature
        console.log('Signed by key id ' + keyID.toHex());
        return verified
    } catch (e) {
        throw new Error('Signature could not be verified: ' + e.message);
    }
}

// Example usage
async function runExample() {
    // File paths to public and private keys
    const publicKeyPath = path.join(__dirname, 'public', 'pubKeys', 'app-public.key');
    const privateKeyPath = path.join(__dirname, 'keys', 'app-private.key');
    const passphrase = process.env.PGP_PASSPHRASE // Passphrase for the private key

    const plaintextMessage = 'Hello, World!';

    // Load public and private keys from files
    const publicKey = await readKeyFile(publicKeyPath);

    // PGP encryption example
    const encryptedMessage = await encryptMessage(plaintextMessage, publicKey);
    console.log('Encrypted Message:\n', encryptedMessage);

    // PGP decryption example
    const decryptedMessage = await decryptMessage(encryptedMessage, privateKeyPath, passphrase);
    console.log('Decrypted Message:\n', decryptedMessage);

    // PGP file signing example
    const fileContent = 'It is offical. The sky is blue and I love you.';
    const signedTextArmored = await signFile(fileContent, privateKeyPath, passphrase);
    console.log('Signed Message:\n', fileContent + '\n', signedTextArmored);

    // // PGP signature verification example
    const isSignatureValid = await verifySignature(signedTextArmored, publicKeyPath);
    console.log('Signature Verification:', isSignatureValid);
}
//runExample();

module.exports = {
    encryptMessage,
    decryptMessage,
    signFile,
    verifySignature,
    readKeyFile
  };