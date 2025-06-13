import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'fs'
import path from 'path'
import os from 'os'

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
      password: 'secret',
      firstName: 'Test',
      lastName: 'User',
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const users = JSON.parse(readFileSync(dataFile, 'utf-8'))
    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('test@example.com')
  })

  it('rejects missing fields', async () => {
    const req = createRequest({ email: 'foo@example.com' })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.message).toBe('Missing fields')
  })

  it('rejects duplicate user', async () => {
    const req1 = createRequest({
      email: 'dup@example.com',
      password: 'a',
      firstName: 'Dup',
      lastName: 'User',
    })
    const res1 = await POST(req1)
    expect(res1.status).toBe(201)

    const req2 = createRequest({
      email: 'dup@example.com',
      password: 'b',
      firstName: 'Dup2',
      lastName: 'User2',
    })
    const res2 = await POST(req2)
    expect(res2.status).toBe(400)
    const body = await res2.json()
    expect(body.message).toBe('User already exists')
  })
})
