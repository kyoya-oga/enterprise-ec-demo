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

let tmpDir: string
let dataFile: string
let POST: typeof import('./route').POST

beforeEach(async () => {
  tmpDir = mkdtempSync(path.join(os.tmpdir(), 'users-'))
  dataFile = path.join(tmpDir, 'users.json')
  
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
  ;({ POST } = await import('./route'))
})

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true })
  delete process.env.USERS_FILE
})

describe('POST /api/login', () => {
  it('有効な認証情報で正常にログインする', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'password123',
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.message).toBe('Login successful')
    expect(body.user.email).toBe('test@example.com')
    expect(body.user.passwordHash).toBeUndefined()
  })

  it('無効なメールアドレスを拒否する', async () => {
    const req = createRequest({
      email: 'nonexistent@example.com',
      password: 'password123',
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.message).toBe('Invalid credentials')
  })

  it('無効なパスワードを拒否する', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'wrongpassword',
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.message).toBe('Invalid credentials')
  })

  it('不足しているフィールドを拒否する', async () => {
    const req = createRequest({ email: 'test@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Validation failed')
    expect(body.errors).toContain('Password is required')
  })

  it('無効なメールアドレス形式を拒否する', async () => {
    const req = createRequest({
      email: 'invalid-email',
      password: 'password123',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Validation failed')
    expect(body.errors).toContain('Invalid email format')
  })

  it('大文字小文字を区別しないメールマッチングを処理する', async () => {
    const req = createRequest({
      email: 'TEST@EXAMPLE.COM',
      password: 'password123',
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.message).toBe('Login successful')
    expect(body.user.email).toBe('test@example.com')
  })
})