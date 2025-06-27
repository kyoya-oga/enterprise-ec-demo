#!/usr/bin/env node

/**
 * User Password Hash Generator
 * Generate bcrypt hashes for user passwords safely
 * 
 * Usage:
 *   node scripts/generate-user-hash.js [password]
 *   
 * If no password provided, will prompt for input
 */

const bcrypt = require('bcrypt')
const readline = require('readline')

const SALT_ROUNDS = 10

async function generateHash(password) {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    console.log('\n🔒 Generated bcrypt hash:')
    console.log(hash)
    console.log('\n📋 Copy this hash to your users.json file')
    return hash
  } catch (error) {
    console.error('❌ Error generating hash:', error.message)
    process.exit(1)
  }
}

async function promptForPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('🔑 Enter password to hash: ', (password) => {
      rl.close()
      resolve(password)
    })
  })
}

async function main() {
  console.log('🛡️  User Password Hash Generator\n')
  
  let password = process.argv[2]
  
  if (!password) {
    password = await promptForPassword()
  }
  
  if (!password || password.trim().length === 0) {
    console.error('❌ Password cannot be empty')
    process.exit(1)
  }
  
  if (password.length < 8) {
    console.warn('⚠️  Warning: Password is shorter than 8 characters')
  }
  
  await generateHash(password)
}

main().catch(console.error)