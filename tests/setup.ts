import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Provide WebCrypto API in the jsdom environment for jose
if (!globalThis.crypto || !(globalThis.crypto as Crypto).subtle) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  globalThis.crypto = require('crypto').webcrypto as Crypto
}

// Mock jose's SignJWT and jwtVerify for deterministic tokens
vi.mock('jose', async () => {
  const actual: any = await vi.importActual('jose')

  class MockSignJWT {
    private payload: any
    private header: Record<string, any> = {}
    constructor(payload: any) {
      this.payload = { ...payload }
    }
    setProtectedHeader(header: Record<string, any>) {
      this.header = header
      return this
    }
    setIssuedAt() {
      this.payload.iat = Math.floor(Date.now() / 1000)
      return this
    }
    setExpirationTime(exp: string) {
      const now = Math.floor(Date.now() / 1000)
      const amount = parseInt(exp)
      const unit = exp.replace(String(amount), '')
      let seconds = amount
      if (unit === 'm') seconds *= 60
      if (unit === 'd') seconds *= 24 * 60 * 60
      if (unit === 'h') seconds *= 3600
      this.payload.exp = now + seconds
      return this
    }
    setJti(jti: string) {
      this.payload.jti = jti
      return this
    }
    setIssuer(iss: string) {
      this.payload.iss = iss
      return this
    }
    setAudience(aud: string) {
      this.payload.aud = aud
      return this
    }
    async sign(secretKey: Uint8Array) {
      const encoded = Buffer.from(JSON.stringify(this.payload)).toString('base64url')
      const sig = Buffer.from(secretKey).toString('hex')
      return `header.${encoded}.${sig}`
    }
  }

  return {
    ...actual,
    SignJWT: MockSignJWT,
    jwtVerify: vi.fn(async (token: string, secretKey: Uint8Array) => {
      const [_, payloadPart, sig] = token.split('.')
      const expectedSig = Buffer.from(secretKey).toString('hex')
      if (sig !== expectedSig) {
        throw new Error('invalid signature')
      }
      const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString())
      return { payload }
    }),
  }
})

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
