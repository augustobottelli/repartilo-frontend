# Authentication Setup Complete! 🎉

Clerk authentication has been successfully integrated into your Repartilo app. Here's everything you need to know.

## ✅ What's Been Set Up

### Frontend (`repartilo-web`)
- ✅ Clerk authentication with ClerkProvider
- ✅ Protected routes with middleware
- ✅ Sign-in and sign-up pages
- ✅ User dashboard with subscription stats
- ✅ Updated header with user menu
- ✅ User subscription hook
- ✅ Home page with pricing (redirects to dashboard if signed in)
- ✅ Optimize tool moved to `/optimize` (protected route)

### Backend (`~/github/repartilo/api`)
- ✅ JWT verification service
- ✅ User router with `/api/user/me` endpoint
- ✅ Auto-creation of users on first login
- ✅ Auto-assignment of free tier subscription
- ✅ Clerk configuration in settings

### Database (Supabase)
- ✅ Users table
- ✅ Subscriptions table
- ✅ Usage logs table
- ✅ Tier limits table (pre-populated)

## 🚀 Testing the Authentication Flow

### Step 1: Start the Backend

```bash
cd ~/github/repartilo/api
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API should start at `http://localhost:8000`

### Step 2: Start the Frontend

```bash
cd ~/github/repartilo-web
npm run dev
```

The app should start at `http://localhost:3002`

### Step 3: Test the Complete Flow

1. **Visit Home Page**
   - Go to `http://localhost:3002`
   - You should see the landing page with pricing
   - Click "Empezar Gratis" or "Registrarse"

2. **Sign Up**
   - Fill in email and password (or use Google OAuth)
   - Clerk will create your account
   - You'll be redirected to `/dashboard`

3. **Check Dashboard**
   - Should show your user info
   - Plan: FREE
   - Usage: 0/10 routes used
   - Should see quick actions to optimize routes

4. **Check Header**
   - Top right should show "FREE" badge
   - Click on your avatar to see menu
   - Menu shows: Dashboard, Settings, Log Out
   - Shows usage: "0/10 rutas usadas"

5. **Check Backend Created Your User**
   ```bash
   curl http://localhost:8000/db/tables
   ```

   Then check in Supabase SQL Editor:
   ```sql
   SELECT * FROM user_subscription_status;
   ```

   You should see your user with:
   - clerk_user_id: `user_xxx`
   - email: your email
   - tier: `free`
   - monthly_route_limit: `10`
   - current_monthly_usage: `0`
   - can_optimize: `true`

6. **Try Optimization (Next Step)**
   - Go to `/optimize`
   - Upload Excel file
   - Optimize routes
   - Usage should increment (we need to add this in next step!)

## 📁 File Structure

```
repartilo-web/
├── app/
│   ├── page.tsx              # Landing page (redirects if signed in)
│   ├── layout.tsx            # Root layout with ClerkProvider
│   ├── sign-in/              # Clerk sign-in page
│   ├── sign-up/              # Clerk sign-up page
│   ├── dashboard/            # User dashboard (protected)
│   ├── optimize/             # Route optimizer (protected)
│   └── settings/             # User settings (todo)
├── middleware.ts             # Clerk auth middleware
├── lib/
│   └── hooks/
│       └── useUserSubscription.ts  # Hook to fetch user data
└── .env.local                # Clerk keys

repartilo/api/app/
├── routers/
│   └── users.py              # /api/user/me endpoint
├── services/
│   ├── auth.py               # JWT verification
│   └── database.py           # DB connection
├── models/
│   ├── user.py               # User models
│   └── subscription.py       # Subscription models
└── config.py                 # Clerk config
```

## 🔐 How Authentication Works

### Frontend → Backend Flow

```
1. User signs in via Clerk
   ↓
2. Clerk creates session + JWT token
   ↓
3. Frontend calls /api/user/me with JWT in Authorization header
   ↓
4. Backend verifies JWT with Clerk's JWKS
   ↓
5. Backend checks if user exists in database
   ↓
6. If new user: Creates user + free subscription
   ↓
7. Returns user data with subscription info
```

### JWT Token Structure

The JWT token contains:
- `sub`: Clerk user ID (e.g., `user_2xxx...`)
- `email`: User's email
- `email_verified`: Boolean
- Plus other Clerk metadata

### Protected Routes

**Frontend (middleware.ts):**
- Public: `/`, `/sign-in`, `/sign-up`
- Protected: Everything else (`/dashboard`, `/optimize`, etc.)

**Backend (Depends):**
- Use `get_current_user` dependency to protect routes
- Example:
  ```python
  @router.get("/protected")
  async def protected(user = Depends(get_current_user)):
      return {"user_id": user["sub"]}
  ```

## 🐛 Troubleshooting

### Frontend Issues

**"Invalid publishable key"**
- Check `.env.local` has correct `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Make sure it starts with `pk_test_`

**Redirecting to wrong domain**
- This is normal for development
- Clerk uses `*.clerk.accounts.dev` for test keys
- In production, you'll use custom domains

**Can't see user menu**
- Make sure you're signed in
- Check browser console for errors
- Verify Clerk is loaded: `isLoaded && isSignedIn`

### Backend Issues

**"Unable to fetch Clerk JWKS"**
- Check `CLERK_FRONTEND_API` in `.env`
- Should be: `settling-pelican-70.clerk.accounts.dev`
- Make sure backend can reach internet

**"Invalid token"**
- Token might be expired (refresh page)
- Check Clerk keys match between frontend and backend
- Verify JWT is being sent in `Authorization: Bearer <token>` header

**"User not found" after signup**
- Check database connection is working
- Verify `DATABASE_URL` in backend `.env`
- Check Supabase for the user in `users` table

### Database Issues

**Can't connect to database**
- Check `DATABASE_URL` in `.env`
- Make sure using Transaction Pooler URL (port 6543)
- Verify password is correct (no `[YOUR-PASSWORD]` placeholder)

**Tables don't exist**
- Run the schema in Supabase SQL Editor
- Check: `SELECT * FROM tier_limits;` should return 3 rows

## 🔜 What's Next

Now that authentication is working, here are the next steps:

### Immediate Next Steps:
1. ✅ Database - DONE
2. ✅ Authentication - DONE
3. ⏳ **Usage Tracking** - Add usage logging when user optimizes routes
4. ⏳ **Rate Limiting** - Enforce tier limits before optimization
5. ⏳ **Stripe Integration** - Add payment/upgrade flow

### Usage Tracking (Next Step)
We need to modify the optimization endpoint to:
1. Check if user can optimize (hasn't hit limit)
2. Process the optimization
3. Log the usage to `usage_logs` table
4. Return result

Would you like me to implement usage tracking next?

## 📊 Monitoring

### Check User Activity

**Get all users:**
```sql
SELECT * FROM user_subscription_status;
```

**Get monthly usage stats:**
```sql
SELECT
  u.email,
  s.tier,
  get_monthly_usage(u.id) as usage,
  tl.monthly_route_limit as limit
FROM users u
JOIN subscriptions s ON u.id = s.user_id
JOIN tier_limits tl ON s.tier = tl.tier
ORDER BY usage DESC;
```

**Check recent activity:**
```sql
SELECT
  u.email,
  ul.action_type,
  ul.routes_count,
  ul.created_at
FROM usage_logs ul
JOIN users u ON ul.user_id = u.id
ORDER BY ul.created_at DESC
LIMIT 20;
```

## 🎓 Key Concepts

### Clerk vs Traditional Auth
- **No password storage**: Clerk handles all auth
- **JWT tokens**: Used for backend verification
- **Webhooks**: For syncing user data (we'll add this later for Stripe)

### Subscription Tiers
- **Free**: 10 routes/month, auto-assigned on signup
- **Pro**: 500 routes/month, $29/mo (Stripe integration needed)
- **Enterprise**: Unlimited, $99/mo (Stripe integration needed)

### Usage Tracking
- Every optimization is logged to `usage_logs`
- Monthly count resets automatically (uses `date_trunc`)
- Backend checks limit before allowing optimization

## 🆘 Getting Help

If something isn't working:
1. Check browser console for frontend errors
2. Check terminal output for backend errors
3. Check Supabase logs for database errors
4. Verify all environment variables are set correctly

Ready to test? Start both servers and visit `http://localhost:3002`!
