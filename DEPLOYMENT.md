# Deployment Guide

## Backend (Render)

### Fixed Issues:
1. ✅ **Multiple Prisma Client instances** - Created singleton pattern in `src/lib/prisma.ts`
2. ✅ **Missing error handling** - Added global error handler and improved logging
3. ✅ **CORS configuration** - Now accepts Vercel domains (*.vercel.app) and configured origins
4. ✅ **Build process** - Added Prisma generate to build script
5. ✅ **Graceful shutdown** - Added SIGTERM/SIGINT handlers
6. ✅ **Health check** - Enhanced with database connection test

### Environment Variables Required on Render:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key_here
FRONTEND_URL=https://your-app.vercel.app
```

### Build Command (Render):
```bash
npm install && npm run build
```

### Start Command (Render):
```bash
npm start
```

### After Deployment:
1. Run migrations: `npm run prisma:deploy` (or set up auto-migrations)
2. Test health endpoint: `https://your-backend.onrender.com/health`
3. Test root endpoint: `https://your-backend.onrender.com/`

---

## Frontend (Vercel)

### Fixed Issues:
1. ✅ **404 on routes** - Created `vercel.json` with SPA rewrites
2. ✅ **API URL configuration** - Using environment variables with fallback

### Environment Variables Required on Vercel:

```bash
VITE_API_URL=https://your-backend.onrender.com
```

⚠️ **Important**: No trailing slash in VITE_API_URL

### Build Settings (Vercel):
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### After Adding Environment Variable:
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add `VITE_API_URL` with your Render backend URL
4. **Redeploy** - Vercel needs to rebuild with the new env var

---

## Testing Deployment

### Backend Health Check:
```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "Connected",
  "timestamp": "2025-10-31T..."
}
```

### Test API Endpoints:
```bash
# Get projects
curl https://your-backend.onrender.com/api/projects

# Get blogs
curl https://your-backend.onrender.com/api/blogs

# Contact form (POST)
curl -X POST https://your-backend.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hello"}'
```

### Frontend Routes to Test:
- Homepage: `https://your-app.vercel.app/`
- Projects: `https://your-app.vercel.app/#projects`
- Blog: `https://your-app.vercel.app/#blog`
- Admin Login: `https://your-app.vercel.app/admin/login`
- Admin Dashboard: `https://your-app.vercel.app/admin/dashboard`

---

## Common Issues & Solutions

### Issue: "500 Internal Server Error"
**Causes:**
- Database not connected (check DATABASE_URL)
- Prisma Client not generated (run `prisma generate`)
- Missing environment variables

**Solution:**
1. Check Render logs for error details
2. Verify all environment variables are set
3. Ensure database migrations are applied

### Issue: "404 Not Found" on admin routes
**Cause:** Vercel doesn't handle client-side routes

**Solution:** ✅ Fixed with `vercel.json`

### Issue: CORS errors in browser
**Cause:** Backend doesn't allow frontend domain

**Solution:**
1. Add FRONTEND_URL environment variable on Render
2. Make sure it matches your Vercel domain exactly
3. No trailing slash

### Issue: "Cannot connect to backend"
**Causes:**
- Wrong VITE_API_URL in Vercel
- Backend not responding
- CORS blocking requests

**Solution:**
1. Verify VITE_API_URL is correct (no trailing slash)
2. Test backend health endpoint directly
3. Check browser console for CORS errors
4. Redeploy frontend after env var changes

---

## Deployment Checklist

### Backend (Render):
- [ ] Environment variables set (DATABASE_URL, JWT_SECRET, FRONTEND_URL, NODE_ENV)
- [ ] Build succeeds without errors
- [ ] Health endpoint returns OK
- [ ] Database connected
- [ ] Migrations applied
- [ ] Test API endpoints work

### Frontend (Vercel):
- [ ] VITE_API_URL environment variable set
- [ ] Build succeeds
- [ ] All routes accessible (no 404s)
- [ ] API calls work (check Network tab)
- [ ] Admin login works
- [ ] Admin dashboard loads

### Integration:
- [ ] CORS working (no errors in console)
- [ ] Contact form submits successfully
- [ ] Projects/blogs load from backend
- [ ] Images display correctly
- [ ] Analytics tracking works

---

## Next Steps

After successful deployment:

1. **Create initial admin user:**
   ```bash
   # Use Postman or curl
   curl -X POST https://your-backend.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "your_secure_password",
       "name": "Admin"
     }'
   ```

2. **Add content through admin dashboard:**
   - Login at `/admin/login`
   - Add projects, blogs, experiences, achievements

3. **Monitor:**
   - Check Render logs for backend issues
   - Check Vercel logs for frontend issues
   - Monitor database usage

4. **Performance:**
   - Enable Vercel Analytics (optional)
   - Monitor API response times
   - Check database query performance

---

## Files Changed

### Backend:
- ✅ `src/lib/prisma.ts` (NEW) - Singleton Prisma client
- ✅ `src/server.ts` - Enhanced error handling, CORS, health check
- ✅ `package.json` - Updated build scripts
- ✅ `.env.example` - Added FRONTEND_URL
- ✅ All route files - Use singleton Prisma instance

### Frontend:
- ✅ `vercel.json` (NEW) - SPA routing configuration
- ✅ `src/config.ts` - API URL from environment
- ✅ `src/vite-env.d.ts` - TypeScript declarations
- ✅ `.env` - Local development config
- ✅ All components - Use centralized API_URL

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → [Latest] → View Function Logs
3. Check browser console: F12 → Console/Network tabs
4. Test backend directly with Postman/curl
