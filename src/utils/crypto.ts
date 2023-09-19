
import { ec as EC } from 'elliptic'
import { Address, Hex } from '../types/common'
import { append0x, remove0x } from './hex'
import { blake160, hexToBytes, scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import { keccak_256 } from 'js-sha3'
import { getJoyIDLockScript } from '../constants'

export enum SigAlg {
    Secp256r1,
    Secp256k1,
    RSA2048,
  }

export const keyFromPrivate = (privateKey: Uint8Array | Hex, sigAlg = SigAlg.Secp256r1): EC.KeyPair => {
    if (sigAlg == SigAlg.RSA2048) {
      throw new Error('RSA2048 is not supported')
    }

    const privKey = typeof privateKey == 'string' ? remove0x(privateKey) : privateKey   
    if (sigAlg == SigAlg.Secp256k1) {
        const ec = new EC('secp256k1')
        return ec.keyFromPrivate(privKey)
    }

    const ec = new EC('p256')
    return ec.keyFromPrivate(privKey)
}

export const getPublicKey = (key: EC.KeyPair) => key.getPublic(false, 'hex').substring(2)

export const getSecp256k1PubkeyHash = (key: EC.KeyPair) => keccak160(getPublicKey(key))

export const keccak160 = (message: Hex): Hex => {
    const msg = hexToBytes(message)
    
    return keccak_256(msg).substring(24)
}

export const addressFromPrivateKey = (privateKey: Uint8Array | Hex, sigAlg = SigAlg.Secp256r1, isMainnet = false): Address => {
    if (sigAlg == SigAlg.RSA2048) {
      throw new Error('RSA2048 is not supported')
    }

    const pubkey = append0x( getPublicKey(keyFromPrivate(privateKey, sigAlg)))
    const lock = {
        ...getJoyIDLockScript(isMainnet),
        args: sigAlg == SigAlg.Secp256r1 ? `0x0001${blake160(hexToBytes(pubkey), 'hex')}` : `0x0002${keccak160(pubkey)}`
    }

    return scriptToAddress(lock)
}

