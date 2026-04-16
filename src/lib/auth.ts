import { db } from '@/lib/db'
import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'beulrock-secret-key-change-in-production'

export interface JWTPayload {
  userId: string
  username: string
  email: string
  role: string
  tier: string
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getUserById(userId: string) {
  return await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      tier: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function createUser(data: {
  username: string
  email: string
  password: string
  role?: string
  tier?: string
  referrerId?: string
}) {
  const hashedPassword = await hashPassword(data.password)
  return await db.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user',
      tier: data.tier || 'Basic',
      referrerId: data.referrerId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      tier: true,
      createdAt: true,
    },
  })
}

export async function authenticateUser(username: string, password: string) {
  const user = await db.user.findUnique({
    where: { username },
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  const token = generateToken({
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    tier: user.tier,
  })

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      tier: user.tier,
    },
    token,
  }
}
