import { generateKeyPairSync, privateDecrypt, publicEncrypt } from 'node:crypto'

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
})

const message = 'Hello, this is a secret!'
const encrypted = publicEncrypt(publicKey, Buffer.from(message))

console.log('🔐 Encrypted:', encrypted.toString('base64'))

const decrypted = privateDecrypt(privateKey, encrypted)

console.log('🔓 Decrypted:', decrypted.toString())
