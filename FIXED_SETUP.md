# 🔧 FIXED: Environment Variables Setup

## The Issue
The original `vercel.json` referenced Vercel Secrets with `@` symbols, but you haven't created those secrets yet.

## ✅ The Fix
I've removed the `env` section from `vercel.json`. You'll add environment variables directly in the Vercel dashboard instead.

---

## 🚀 Correct Setup Steps

### Step 1: Deploy to Vercel

```bash
npm install -g vercel
cd vercel_setup
vercel login
vercel
```

Follow the prompts:
- Set up and deploy? → `Y`
- Which scope? → Select your account  
- Link to existing project? → `N`
- Project name? → `discord-bot-form-api` (or your choice)
- Directory? → `./`
- Override settings? → `N`

✅ You'll get a URL like: `https://discord-bot-form-api.vercel.app`

### Step 2: Add Environment Variables in Vercel Dashboard

**DO NOT skip this step!** This is where you add your secrets.

1. **Go to [vercel.com](https://vercel.com)**
2. **Click on your project** (discord-bot-form-api)
3. **Click "Settings" tab** at the top
4. **Click "Environment Variables"** in the left sidebar
5. **Add each variable one by one:**

#### Variable 1: DISCORD_TOKEN
- **Key:** `DISCORD_TOKEN`
- **Value:** `MTM4OTQ5MTIwODQzNDIyMTA2Ng.Glr26a.CN6MUdVJUkSoF9ee0P2CFaStLjn0qqCnDZZVZ0` (your bot token)
- **Environment:** Select all (Production, Preview, Development)
- Click "Save"

#### Variable 2: API_SECRET
- **Key:** `API_SECRET`
- **Value:** `my-secret-key-123` (make up your own)
- **Environment:** Select all
- Click "Save"

#### Variable 3: FORM_SUBMISSION_CHANNEL_ID
- **Key:** `FORM_SUBMISSION_CHANNEL_ID`
- **Value:** `1234567890123456789` (your Discord channel ID)
- **Environment:** Select all
- Click "Save"

### Step 3: REDEPLOY (CRITICAL!)

Environment variables only apply to NEW deployments!

**Option A: Redeploy from Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots** `...`
4. Click **"Redeploy"**
5. Confirm

**Option B: Redeploy from CLI**
```bash
vercel --prod
```

### Step 4: Verify It Works

Visit: `https://your-project.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "service": "Discord Bot Form API",
  "timestamp": "2024-..."
}
```

---

## 🎯 Alternative: Add Variables via CLI

If you prefer command line:

```bash
# Add DISCORD_TOKEN
vercel env add DISCORD_TOKEN
# When prompted, paste: MTM4OTQ5MTIwODQzNDIyMTA2Ng.Glr26a.CN6MUdVJUkSoF9ee0P2CFaStLjn0qqCnDZZVZ0
# Select: Production, Preview, Development (all)

# Add API_SECRET  
vercel env add API_SECRET
# When prompted, enter: my-secret-key-123
# Select: Production, Preview, Development (all)

# Add FORM_SUBMISSION_CHANNEL_ID
vercel env add FORM_SUBMISSION_CHANNEL_ID
# When prompted, enter: your_channel_id
# Select: Production, Preview, Development (all)

# Redeploy
vercel --prod
```

---

## 📋 Full Checklist

- [ ] Deploy to Vercel (`vercel`)
- [ ] Add DISCORD_TOKEN in Vercel dashboard
- [ ] Add API_SECRET in Vercel dashboard  
- [ ] Add FORM_SUBMISSION_CHANNEL_ID in Vercel dashboard
- [ ] **REDEPLOY** after adding variables
- [ ] Test health endpoint
- [ ] Update Google Apps Script with Vercel URL
- [ ] Test form submission

---

## 🐛 Common Issues

### "Environment variable not found"
- Make sure you **redeployed** after adding variables
- Check variable names are EXACTLY correct (case-sensitive)

### "Channel not found"
- Verify channel ID is correct
- Make sure bot has access to that channel

### "Unauthorized"  
- Check API_SECRET matches in both Vercel and Google Apps Script
- Verify you're using `Bearer` in the Authorization header

---

## 🎉 You're Ready!

Once you've:
1. ✅ Deployed to Vercel
2. ✅ Added all 3 environment variables
3. ✅ Redeployed

Your API will be live at: `https://your-project.vercel.app`

Use this URL in your Google Apps Script! 🚀
