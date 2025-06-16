import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'fs'
import path from 'path'
import os from 'os'
import bcrypt from 'bcrypt'

function createRequest(data: any) {
  return {
    json: async () => data,
  } as any
}

interface TestContext {
  readonly tmpDir: string
  readonly dataFile: string
  readonly POST: typeof import('./route').POST
}

const createTestContext = async (): Promise<TestContext> => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'users-'))
  const dataFile = path.join(tmpDir, 'users.json')
  
  // Create test user
  const passwordHash = await bcrypt.hash('password123', 12)
  const testUser = {
    id: 'test-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    passwordHash,
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  writeFileSync(dataFile, JSON.stringify([testUser], null, 2))
  
  process.env.USERS_FILE = dataFile
  vi.resetModules()
  const { POST } = await import('./route')
  
  return Object.freeze({ tmpDir, dataFile, POST })
}

const contexts = new Map<string, TestContext>()

beforeEach(async () => {
  const context = await createTestContext()
  contexts.set(expect.getState().currentTestName || 'default', context)
})

const getTestContext = (): TestContext => {
  const context = contexts.get(expect.getState().currentTestName || 'default')
  if (!context) {
    throw new Error('Test context not found')
  }
  return context
}

afterEach(() => {
  const context = getTestContext()
  rmSync(context.tmpDir, { recursive: true, force: true })
  delete process.env.USERS_FILE
  contexts.delete(expect.getState().currentTestName || 'default')
})

describe('POST /api/login', () => {
  it('有効な認証情報で正常にログインする', async () => {
    const context = getTestContext()
    const req = createRequest({
      email: 'test@example.com',
      password: 'password123',
    })
    const res = await context.POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.message).toBe('Login successful')
    expect(body.user.email).toBe('test@example.com')
    expect(body.user.passwordHash).toBeUndefined()
  })

  it('無効なメールアドレスを拒否する', async () => {
    const context = getTestContext()
    const req = createRequest({
      email: 'nonexistent@example.com',
      password: 'password123',
    })
    const res = await context.POST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.message).toBe('Invalid credentials')
  })

  it('無効なパスワードを拒否する', async () => {
    const context = getTestContext()
    const req = createRequest({
      email: 'test@example.com',
      password: 'wrongpassword',
    })
    const res = await context.POST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.message).toBe('Invalid credentials')
  })

  it('不足しているフィールドを拒否する', async () => {
    const context = getTestContext()
    const req = createRequest({ email: 'test@example.com' })
    const res = await context.POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Validation failed')
    expect(body.errors).toContain('Password is required')
  })

  it('無効なメールアドレス形式を拒否する', async () => {
    const context = getTestContext()
    const req = createRequest({
      email: 'invalid-email',
      password: 'password123',
    })
    const res = await context.POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Validation failed')
    expect(body.errors).toContain('Invalid email format')
  })

  it('大文字小文字を区別しないメールマッチングを処理する', async () => {
    const context = getTestContext()
    const req = createRequest({
      email: 'TEST@EXAMPLE.COM',
      password: 'password123',
    })
    const res = await context.POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.message).toBe('Login successful')
    expect(body.user.email).toBe('test@example.com')
  })
})