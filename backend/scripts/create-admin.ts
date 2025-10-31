/**
 * Script to create the initial admin user
 * Run this with: ts-node scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function createAdmin() {
  try {
    console.log('\n🔐 Create Admin User\n');

    // Check if admin already exists
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log('⚠️  Users already exist in the database.');
      const proceed = await question('Do you want to create another admin? (yes/no): ');
      if (proceed.toLowerCase() !== 'yes' && proceed.toLowerCase() !== 'y') {
        console.log('Cancelled.');
        rl.close();
        await prisma.$disconnect();
        process.exit(0);
      }
    }

    // Get user input
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 chars): ');

    // Validate
    if (!name || !email || !password) {
      console.error('❌ All fields are required');
      rl.close();
      await prisma.$disconnect();
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      rl.close();
      await prisma.$disconnect();
      process.exit(1);
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.error('❌ User with this email already exists');
      rl.close();
      await prisma.$disconnect();
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🆔 ID: ${user.id}`);
    console.log('\nYou can now login at /admin/login\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
