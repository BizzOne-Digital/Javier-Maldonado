# MongoDB Atlas Setup Guide

Follow these steps to create your Atlas database and get the connection URI.

## Step 1 — Create Atlas Account

1. Go to **https://cloud.mongodb.com**
2. Sign up or log in (free tier is enough)

## Step 2 — Create a Cluster

1. Click **Build a Database**
2. Choose **M0 FREE** (Shared)
3. Provider: **AWS** (or any)
4. Region: choose closest to Toronto (e.g. `us-east-1` or `ca-central-1` if available)
5. Cluster name: `Cluster0` (default is fine)
6. Click **Create**

## Step 3 — Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Authentication: **Password**
4. Username: `javiermaldonado_admin`
5. Password: create a strong password (save it!)
6. Built-in Role: **Atlas admin** OR **Read and write to any database**
7. Click **Add User**

## Step 4 — Allow Network Access

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. For development: click **Allow Access from Anywhere** (`0.0.0.0/0`)
   - For production, restrict to your server IP only
4. Click **Confirm**

## Step 5 — Get Connection String

1. Go to **Database** → click **Connect** on your cluster
2. Choose **Drivers**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string, it looks like:

```
mongodb+srv://javiermaldonado_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. Replace `<password>` with your actual password
6. Add database name before the `?`:

```
mongodb+srv://javiermaldonado_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/javiermaldonado?retryWrites=true&w=majority
```

## Step 6 — Update `.env.local`

Open `.env.local` and paste your full URI:

```env
MONGODB_URI=mongodb+srv://javiermaldonado_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/javiermaldonado?retryWrites=true&w=majority
```

> **Note:** If your password contains special characters (`@`, `#`, `%`, etc.), URL-encode them:
> - `@` → `%40`
> - `#` → `%23`
> - `%` → `%25`

## Step 7 — Seed Admin & Test

```bash
cd javiermaldonado
npm run seed:admin
npm run dev
```

Then open: http://localhost:3000/admin/login

Login with:
- Email: `jamaldonado@live.ca`
- Password: (value of `ADMIN_PASSWORD` in `.env.local`)

## Troubleshooting

| Error | Fix |
|-------|-----|
| `MONGODB_URI is not defined` | Restart dev server after editing `.env.local` |
| `Authentication failed` | Check username/password in URI |
| `IP not whitelisted` | Add your IP in Network Access |
| `querySrv ENOTFOUND` | Check cluster hostname spelling |

## Database Collections (auto-created)

When you use the app, Mongoose creates these collections automatically:

- `adminusers`
- `listings`
- `leads`
- `bookings`
- `testimonials`
- `blogposts`
- `teammembers`
- `resources`
- `services`
- `sitesettings`

No manual collection creation needed.
