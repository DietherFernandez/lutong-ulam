# 🍽️ Restaurant Website — Full-Stack (Supabase + Cloudflare Pages)

A modern, fully responsive restaurant website with a public site and a complete
admin dashboard. Built with React + TypeScript + Vite + Tailwind CSS for the
frontend, Supabase (PostgreSQL + Auth + Storage) for the backend, and deployed
for free on Cloudflare Pages.

The public site and the admin dashboard both talk directly to Supabase — there
is no separate backend server to run. You can host the project entirely on free
tiers and the website will keep working even when your computer is off.

---

## 1. Local Development

### Prerequisites
- Node.js 18+ — https://nodejs.org/
- Git — https://git-scm.com/

### Install dependencies
```bash
cd client
npm install
```

### Run the dev server
```bash
npm run dev
```

The site is now running at http://localhost:5173. The public pages will show
a friendly "Supabase not configured" error until you complete step 2 below.

---

## 2. Set up Supabase (free)

Supabase gives you a free PostgreSQL database, auth, and 1 GB of file storage
on the free tier. No credit card required.

### 2.1 Create a Supabase project
1. Go to https://supabase.com/dashboard and sign up.
2. Click New project.
3. Choose a name, a strong database password (save it!), and the closest
   region to your users.
4. Wait ~2 minutes for the project to provision.

### 2.2 Run the database migrations
In your Supabase dashboard, open SQL Editor (left sidebar). Then, for each of
these files (in order), click New query, paste the contents, and click Run:

1. `database/migrations/01_schema.sql` — creates the tables, indexes, triggers.
2. `database/migrations/02_seed.sql` — seeds default categories, opening hours,
   homepage sections, and restaurant settings.
3. `database/migrations/03_rls.sql` — enables Row Level Security and policies.
4. `database/migrations/04_storage.sql` — adds storage RLS policies for the
   `images` and `homepage` buckets.

### 2.3 Create Storage buckets
1. In your Supabase dashboard, open Storage (left sidebar).
2. Click New bucket:
   - Name: `images`   · Public: YES · Max file size: 5 MB · Allowed types:
     `image/jpeg, image/png, image/webp, image/gif`
3. Create another bucket:
   - Name: `homepage` · Public: YES · Max file size: 5 MB · Allowed types:
     `image/jpeg, image/png, image/webp`

### 2.4 Create the admin user
1. Open Authentication (left sidebar) → Users → Add user → Create new user.
2. Enter your email and a strong password (this is what you'll use to log in
   to /admin).
3. Click Create user.
4. (Optional) Click the user, then Confirm email to skip email verification.

Save the email and password — you'll need them to log into the admin dashboard.

### 2.5 Get your API keys
1. Open Settings (gear icon, bottom left) → API.
2. Copy these two values:
   - Project URL (e.g. `https://abcdefghijk.supabase.co`)
   - anon public key (a long `eyJ...` string)

### 2.6 Configure your local .env
1. In the client/ folder, create a file called .env:
   ```bash
   cd client
   cp .env.example .env
   ```
2. Open .env and fill in your values:
   ```env
   VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...rest_of_key
   ```
3. Restart the dev server (`Ctrl+C` then `npm run dev`).

Your site is now fully functional against Supabase! Visit:
- Public site — http://localhost:5173
- Admin login — http://localhost:5173/admin/login (use the email/password
  from step 2.4)

---

## 3. Push to GitHub

```bash
cd restaurant-website
git init
git add .
git commit -m "Initial commit"
```

Create a new repository at https://github.com/new (do NOT initialise with a
README). Then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/restaurant-website.git
git branch -M main
git push -u origin main
```

---

## 4. Deploy to Cloudflare Pages (free)

Cloudflare Pages is a globally-distributed static-site host with automatic
HTTPS, unlimited bandwidth on the free tier, and instant deploys from GitHub.

### 4.1 Create a Cloudflare account
1. Sign up at https://dash.cloudflare.com/sign-up (free).

### 4.2 Connect your repository
1. From the Cloudflare dashboard, go to Workers & Pages → Create → Pages →
   Connect to Git.
2. Authorise Cloudflare to read your GitHub account.
3. Select your restaurant-website repository → Begin setup.

### 4.3 Configure the build

If the project root is the whole restaurant-website folder, use these settings:

| Setting | Value |
|---------|-------|
| Project name | `restaurant-website` (or any name — this becomes your URL) |
| Production branch | `main` |
| Build command | `cd client && npm install && npm run build` |
| Build output directory | `client/dist` |

> Tip: If you set the Root directory to `client`, the build command can be
> `npm run build` and the output directory `dist`.

### 4.4 Add environment variables
Before clicking Save and Deploy, go to Environment variables (advanced) and
add:

| Variable name | Value |
|---------------|-------|
| VITE_SUPABASE_URL | your Supabase Project URL |
| VITE_SUPABASE_ANON_KEY | your anon public key |

Click Save and Deploy. The first build takes 1-2 minutes.

### 4.5 Get your public URL
When the build succeeds, Cloudflare gives you a URL like:

```
https://restaurant-website-abc.pages.dev
```

That is your public website URL — share it with anyone! 🎉

### 4.6 Custom domain (optional)
1. In Cloudflare Pages → your project → Custom domains → Set up a custom
   domain.
2. Enter your domain (e.g. `myrestaurant.com`) and follow the DNS instructions.
3. HTTPS is automatic.

---

## 5. Update your site after deploy

Every time you push to GitHub:
```bash
git add .
git commit -m "Update menu"
git push
```
Cloudflare Pages will automatically rebuild and redeploy in ~1 minute. Your
admin changes (which are stored in Supabase) are reflected instantly — no
redeploy needed.

---

# ✅ Deployment Testing Checklist

After deploying, verify each of the following:

| # | Test | How |
|---|------|-----|
| 1 | Build has no errors | Cloudflare deploy log shows "Success" |
| 2 | Public URL loads | Open `https://your-site.pages.dev/` in any browser |
| 3 | Mobile responsiveness | Open on your phone or DevTools mobile view |
| 4 | Admin login | Go to `/admin/login`, log in with your Supabase user |
| 5 | Add a dish | In `/admin/dishes` → Add Dish → Save |
| 6 | Upload an image | In `/admin/images` → drop a JPG/PNG → see thumbnail |
| 7 | Update a price | In `/admin/dishes` → Edit → change price → Save |
| 8 | Verify on public site | Refresh `/menu` — new dish + new image appear |
| 9 | Persists after refresh | Hard refresh (Ctrl+Shift+R) — still there |
| 10 | Works with PC off | Push the change, then turn off your computer and re-check on your phone |

---

# 🔐 Security & RLS

Row Level Security is enabled on every table (see `03_rls.sql`):

| Role | What they can do |
|------|------------------|
| Public (anonymous) | Read dishes, categories, settings, hours, homepage sections, image URLs |
| Authenticated user (admin) | Everything above + create/update/delete on every table + upload/delete storage objects |

The `service_role` key is NEVER used in the frontend. Only the `anon` public
key is exposed, and the RLS policies guarantee that the anon key can only read
public data.

If you ever need to rotate the anon key (e.g. if it leaks):
1. Supabase dashboard → Settings → API → Roll anon key.
2. Update `VITE_SUPABASE_ANON_KEY` in Cloudflare Pages env vars.
3. Trigger a new deploy.

---

# 🐛 Troubleshooting

### "Supabase is not configured"
- Make sure `client/.env` exists and has both `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY`.
- Restart the dev server after editing `.env`.

### "new row violates row-level security policy"
- You're trying to write to the database without being logged in. Make sure
  you're logged into `/admin/login` first.
- If the error happens during login, the user might not be confirmed. In
  Supabase dashboard → Authentication → Users → click the user → Confirm
  email.

### "Bucket not found"
- Create the `images` and `homepage` buckets in Storage as described in
  step 2.3.

### Cloudflare deploy fails: "Build failed"
- Check the Cloudflare build log.
- Most common: missing env vars. Add them in Settings → Environment
  variables.
- Make sure the build command is exactly `cd client && npm install && npm
  run build` and output is `client/dist`.

### Admin page is blank
- Open the browser DevTools (F12) → Console.
- Look for a Supabase error message. It usually tells you exactly what's
  wrong (missing policy, RLS, bucket, etc.).

---

# 📜 License

MIT — do whatever you want with this project.

---

# 🙏 Credits

- Built with Supabase, Cloudflare Pages, React, Vite, Tailwind CSS.
- Icons by Lucide.
- Stock food images from Unsplash.



