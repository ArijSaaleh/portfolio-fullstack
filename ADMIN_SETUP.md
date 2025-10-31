# Quick Fix: Create Admin User & Test

## Option 1: Use the Registration Endpoint (Easiest)

Use this curl command or Postman:

```bash
curl -X POST https://portfolio-fullstack-6n4u.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "your_secure_password"
  }'
```

Or in PowerShell:
```powershell
$body = @{
    name = "Admin"
    email = "admin@example.com"
    password = "your_secure_password"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://portfolio-fullstack-6n4u.onrender.com/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

## Option 2: Run Script Locally (If you have local DB)

```bash
cd backend
npm install ts-node --save-dev
npx ts-node scripts/create-admin.ts
```

## Option 3: Use Prisma Studio on Render

1. SSH into Render or use Render shell
2. Run: `npx prisma studio`
3. Manually create user with hashed password

## After Creating User

Test login:
```bash
curl -X POST https://portfolio-fullstack-6n4u.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_secure_password"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin"
  }
}
```

## Debugging 500 Errors

Check Render logs:
1. Go to Render Dashboard
2. Select your backend service
3. Click "Logs" tab
4. Look for error messages when you try to login

Common issues:
- ❌ No users in database → Create one with Option 1
- ❌ JWT_SECRET not set → Add it in Render environment variables
- ❌ DATABASE_URL incorrect → Verify connection string
- ❌ Prisma not generated → Redeploy or run `npm run build`
