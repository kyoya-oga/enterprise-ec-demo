import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'fs'
import path from 'path'
import os from 'os'
import bcrypt from 'bcrypt'

function createRequest(data: any) {
  return {
    json: async () => data,
  } as any
}

function createMalformedJsonRequest() {
  return {
    json: async () => {
      throw new Error('Malformed JSON')
    },
  } as any
}

let tmpDir: string
let dataFile: string
let POST: typeof import('./route').POST
let consoleErrorSpy: any

beforeEach(async () => {
  tmpDir = mkdtempSync(path.join(os.tmpdir(), 'users-'))
  dataFile = path.join(tmpDir, 'users.json')
  writeFileSync(dataFile, '[]')
  process.env.USERS_FILE = dataFile
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.resetModules()
  ;({ POST } = await import('./route'))
})

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true })
  delete process.env.USERS_FILE
  consoleErrorSpy.mockRestore()
})

describe('POST /api/register', () => {
  describe('正常な登録処理', () => {
    it('有効なデータで新しいユーザーを作成する', async () => {
      const req = createRequest({
        email: 'test@example.com',
        password: 'secret123',
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
      
      const body = await res.json()
      expect(body.id).toBeDefined()
      expect(body.email).toBe('test@example.com')
      expect(body.firstName).toBe('Test')
      expect(body.lastName).toBe('User')
      expect(body.role).toBe('user')
      expect(body.createdAt).toBeDefined()
      expect(body.updatedAt).toBeDefined()
      expect(body.passwordHash).toBeUndefined() // Should not be returned
      
      const users = JSON.parse(readFileSync(dataFile, 'utf-8'))
      expect(users).toHaveLength(1)
      expect(users[0].email).toBe('test@example.com')
      expect(users[0].passwordHash).toBeDefined()
      expect(await bcrypt.compare('secret123', users[0].passwordHash)).toBe(true)
    })

    it('メールアドレスを小文字に正規化する', async () => {
      const req = createRequest({
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
      
      const body = await res.json()
      expect(body.email).toBe('test@example.com')
      
      const users = JSON.parse(readFileSync(dataFile, 'utf-8'))
      expect(users[0].email).toBe('test@example.com')
    })

    it('複数ユーザーに対して一意のIDを生成する', async () => {
      const users = [
        { email: 'user1@example.com', password: 'password123', firstName: 'User', lastName: 'One' },
        { email: 'user2@example.com', password: 'password456', firstName: 'User', lastName: 'Two' }
      ]

      const ids = []
      for (const userData of users) {
        const req = createRequest(userData)
        const res = await POST(req)
        expect(res.status).toBe(201)
        const body = await res.json()
        ids.push(body.id)
      }

      expect(ids[0]).not.toBe(ids[1])
      expect(ids[0]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      expect(ids[1]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it('データファイルが初期状態で存在しない場合にユーザーを作成する', async () => {
      rmSync(dataFile, { force: true })
      expect(existsSync(dataFile)).toBe(false)

      const req = createRequest({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
      
      expect(existsSync(dataFile)).toBe(true)
      const users = JSON.parse(readFileSync(dataFile, 'utf-8'))
      expect(users).toHaveLength(1)
    })
  })

  describe('バリデーションエラー', () => {
    it('完全に不足しているフィールドを拒否する', async () => {
      const req = createRequest({})
      const res = await POST(req)
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.message).toBe('Validation failed')
      expect(body.errors).toContain('Email is required')
      expect(body.errors).toContain('Password is required')
      expect(body.errors).toContain('First name is required')
      expect(body.errors).toContain('Last name is required')
    })

    it('メールアドレスの不足を拒否する', async () => {
      const req = createRequest({
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.message).toBe('Validation failed')
      expect(body.errors).toContain('Email is required')
    })

    it('パスワードの不足を拒否する', async () => {
      const req = createRequest({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.message).toBe('Validation failed')
      expect(body.errors).toContain('Password is required')
    })

    it('名前の不足を拒否する', async () => {
      const req = createRequest({
        email: 'test@example.com',
        password: 'password123',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.message).toBe('Validation failed')
      expect(body.errors).toContain('First name is required')
    })

    it('苗字の不足を拒否する', async () => {
      const req = createRequest({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.message).toBe('Validation failed')
      expect(body.errors).toContain('Last name is required')
    })

    it('空文字フィールドを拒否する', async () => {
      const req = createRequest({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.message).toBe('Validation failed')
      expect(body.errors).toContain('Invalid email format')
      expect(body.errors).toContain('Password must be at least 8 characters long')
      expect(body.errors).toContain('First name is required')
      expect(body.errors).toContain('Last name is required')
    })

    it('無効なメールアドレス形式を拒否する', async () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user.domain.com',
        'user@domain',
        'user name@domain.com',
        'user@domain..com',
      ]

      for (const email of invalidEmails) {
        const req = createRequest({
          email,
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        const res = await POST(req)
        expect(res.status).toBe(400)
        const body = await res.json()
        expect(body.message).toBe('Validation failed')
        expect(body.errors).toContain('Invalid email format')
      }
    })

    it('短いパスワードを拒否する', async () => {
      const shortPasswords = ['', '1', '12', '123', '1234', '12345', '123456', '1234567']

      for (const password of shortPasswords) {
        const req = createRequest({
          email: 'test@example.com',
          password,
          firstName: 'Test',
          lastName: 'User',
        })
        const res = await POST(req)
        expect(res.status).toBe(400)
        const body = await res.json()
        expect(body.message).toBe('Validation failed')
        expect(body.errors).toContain('Password must be at least 8 characters long')
      }
    })

    it('最小有効パスワード長を受け入れる', async () => {
      const req = createRequest({
        email: 'test@example.com',
        password: '12345678', // Exactly 8 characters
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
    })
  })

  describe('重複ユーザーの処理', () => {
    it('重複メールを拒否する（完全一致）', async () => {
      const userData = {
        email: 'dup@example.com',
        password: 'password123',
        firstName: 'Dup',
        lastName: 'User',
      }

      const req1 = createRequest(userData)
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

    it('重複メールを拒否する（大文字小文字を区別しない）', async () => {
      const req1 = createRequest({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      const res1 = await POST(req1)
      expect(res1.status).toBe(201)

      const caseVariations = [
        'TEST@EXAMPLE.COM',
        'Test@Example.Com',
        'test@EXAMPLE.com',
        'TEST@example.COM',
      ]

      for (const email of caseVariations) {
        const req = createRequest({
          email,
          password: 'password456',
          firstName: 'Another',
          lastName: 'User',
        })
        const res = await POST(req)
        expect(res.status).toBe(400)
        const body = await res.json()
        expect(body.message).toBe('User already exists')
      }
    })
  })

  describe('データ整合性とセキュリティ', () => {
    it('bcryptでパスワードをハッシュ化する', async () => {
      const password = 'mySecretPassword123'
      const req = createRequest({
        email: 'test@example.com',
        password,
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(201)

      const users = JSON.parse(readFileSync(dataFile, 'utf-8'))
      const user = users[0]
      
      expect(user.passwordHash).toBeDefined()
      expect(user.passwordHash).not.toBe(password)
      expect(user.passwordHash.startsWith('$2b$12$')).toBe(true)
      expect(await bcrypt.compare(password, user.passwordHash)).toBe(true)
      expect(await bcrypt.compare('wrongPassword', user.passwordHash)).toBe(false)
    })

    it('レスポンスにパスワードハッシュを返さない', async () => {
      const req = createRequest({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
      
      const body = await res.json()
      expect(body.passwordHash).toBeUndefined()
      expect(Object.keys(body)).not.toContain('passwordHash')
    })

    it('正しいユーザーロールを設定する', async () => {
      const req = createRequest({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
      
      const body = await res.json()
      expect(body.role).toBe('user')
      
      const users = JSON.parse(readFileSync(dataFile, 'utf-8'))
      expect(users[0].role).toBe('user')
    })

    it('タイムスタンプを正しく設定する', async () => {
      const beforeTime = new Date().toISOString()
      
      const req = createRequest({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      const res = await POST(req)
      
      const afterTime = new Date().toISOString()
      expect(res.status).toBe(201)
      
      const body = await res.json()
      expect(body.createdAt).toBeDefined()
      expect(body.updatedAt).toBeDefined()
      expect(body.createdAt).toBe(body.updatedAt)
      expect(body.createdAt >= beforeTime).toBe(true)
      expect(body.createdAt <= afterTime).toBe(true)
    })
  })

  describe('エラーハンドリング', () => {
    it('不正なJSONを適切に処理する', async () => {
      const req = createMalformedJsonRequest()
      const res = await POST(req)
      expect(res.status).toBe(500)
      const body = await res.json()
      expect(body.message).toBe('Internal server error')
      expect(consoleErrorSpy).toHaveBeenCalledWith('Registration error:', expect.any(Error))
    })

    it('ファイルシステムエラーを処理する', async () => {
      // Make the directory read-only to simulate file system error
      const readOnlyDir = path.join(tmpDir, 'readonly')
      require('fs').mkdirSync(readOnlyDir, { mode: 0o444 })
      const readOnlyFile = path.join(readOnlyDir, 'users.json')
      process.env.USERS_FILE = readOnlyFile
      
      vi.resetModules()
      ;({ POST } = await import('./route'))

      const req = createRequest({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      
      const res = await POST(req)
      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.id).toBeDefined()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })

  describe('エッジケース', () => {
    it('特殊文字を含む有効なメールを処理する', async () => {
      const specialEmails = [
        'user.name+tag@domain.co.jp',
        'admin@sub.domain.com',
        'test.email-with+symbol@example.org',
        'user_name123@test-domain.net',
      ]

      for (const email of specialEmails) {
        const req = createRequest({
          email,
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        const res = await POST(req)
        expect(res.status).toBe(201)
        
        const body = await res.json()
        expect(body.email).toBe(email.toLowerCase())
      }
    })

    it('特殊文字を含む名前を処理する', async () => {
      const req = createRequest({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'José María',
        lastName: "O'Connor-Smith",
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
      
      const body = await res.json()
      expect(body.firstName).toBe('José María')
      expect(body.lastName).toBe("O'Connor-Smith")
    })

    it('長いが有効な入力を処理する', async () => {
      const longPassword = 'a'.repeat(100)
      const longName = 'TestName' + 'a'.repeat(100)
      
      const req = createRequest({
        email: 'test@example.com',
        password: longPassword,
        firstName: longName,
        lastName: longName,
      })
      const res = await POST(req)
      expect(res.status).toBe(201)
      
      const body = await res.json()
      expect(body.firstName).toBe(longName)
      expect(body.lastName).toBe(longName)
    })

    it('複数登録間でユーザーデータの整合性を維持する', async () => {
      const users = [
        { email: 'user1@example.com', password: 'password123', firstName: 'User', lastName: 'One' },
        { email: 'user2@example.com', password: 'password456', firstName: 'User', lastName: 'Two' },
        { email: 'user3@example.com', password: 'password789', firstName: 'User', lastName: 'Three' }
      ]

      for (const userData of users) {
        const req = createRequest(userData)
        const res = await POST(req)
        expect(res.status).toBe(201)
      }

      const savedUsers = JSON.parse(readFileSync(dataFile, 'utf-8'))
      expect(savedUsers).toHaveLength(3)
      
      await Promise.all(users.map(async (userData, index) => {
        expect(savedUsers[index].email).toBe(userData.email)
        expect(savedUsers[index].firstName).toBe(userData.firstName)
        expect(savedUsers[index].lastName).toBe(userData.lastName)
        expect(await bcrypt.compare(userData.password, savedUsers[index].passwordHash)).toBe(true)
      }))
    })
  })
})