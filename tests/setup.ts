import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Provide WebCrypto API in the jsdom environment for jose
if (!globalThis.crypto || !(globalThis.crypto as Crypto).subtle) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  globalThis.crypto = require('crypto').webcrypto as Crypto
}

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
