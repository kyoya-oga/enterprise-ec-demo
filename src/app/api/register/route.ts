import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { createHash, randomUUID } from 'crypto'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  passwordHash: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

const dataFile = process.env.USERS_FILE ||
  path.join(process.cwd(), 'src/lib/data/users.json')

async function readUsers(): Promise<User[]> {
  try {
    const data = await readFile(dataFile, 'utf-8')
    return JSON.parse(data) as User[]
  } catch {
    return []
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await writeFile(dataFile, JSON.stringify(users, null, 2))
}

export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName } = await req.json()

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  const users = await readUsers()
  if (users.some(user => user.email === email)) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 })
  }

  const passwordHash = createHash('sha256').update(password).digest('hex')
  const now = new Date().toISOString()
  const newUser: User = {
    id: randomUUID(),
    email,
    firstName,
    lastName,
    passwordHash,
    role: 'user',
    createdAt: now,
    updatedAt: now,
  }

  users.push(newUser)
  await writeUsers(users)

  const { passwordHash: _, ...userResponse } = newUser
  return NextResponse.json(userResponse, { status: 201 })
}
