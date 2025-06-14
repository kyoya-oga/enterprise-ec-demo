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
let POST: typeof import('@/app/api/register/route').POST

beforeEach(async () => {
  tmpDir = mkdtempSync(path.join(os.tmpdir(), 'users-'))
  dataFile = path.join(tmpDir, 'users.json')
  writeFileSync(dataFile, '[]')
  process.env.USERS_FILE = dataFile
  vi.resetModules()
  ;({ POST } = await import('@/app/api/register/route'))
})

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true })
  delete process.env.USERS_FILE
})

describe('POST /api/register', () => {
  it('creates a new user', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'secret123',
      firstName: 'Test',
      lastName: 'User',
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const users = JSON.parse(readFileSync(dataFile, 'utf-8'))
    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('test@example.com')
    expect(users[0].passwordHash).toBeDefined()
    expect(await bcrypt.compare('secret123', users[0].passwordHash)).toBe(true)
  })

  it('rejects missing fields', async () => {
    const req = createRequest({ email: 'foo@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Validation failed')
    expect(body.errors).toContain('Password is required')
  })

  it('rejects duplicate user', async () => {
    const req1 = createRequest({
      email: 'dup@example.com',
      password: 'password123',
      firstName: 'Dup',
      lastName: 'User',
    })
    const res1 = await POST(req1)
    expect(res1.status).toBe(201)

    const req2 = createRequest({
      email: 'dup@example.com',
      password: 'password456',
      firstName: 'Dup2',
      lastName: 'User2',
    })
    const res2 = await POST(req2)
    expect(res2.status).toBe(400)
    const body = await res2.json()
    expect(body.message).toBe('User already exists')
  })

  it('rejects invalid email format', async () => {
    const req = createRequest({
      email: 'invalid-email',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Validation failed')
    expect(body.errors).toContain('Invalid email format')
  })

  it('rejects short password', async () => {
    const req = createRequest({
      email: 'test@example.com',
      password: 'short',
      firstName: 'Test',
      lastName: 'User',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Validation failed')
    expect(body.errors).toContain('Password must be at least 8 characters long')
  })
})
