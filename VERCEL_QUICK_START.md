# 🚀 Vercel Deployment - Quick Start Guide

## Overview

This setup uses **Vercel** to host your form submission API as serverless functions. This is FREE and much easier than managing a server!

## Architecture

```
Google Form → Apps Script → Vercel API → Discord Message with Buttons
                                              ↓
                              Your Main Bot → Handles Button Clicks
```

**Two components:**
1. **Vercel API** - Receives forms, posts to Discord (serverless, always online)
2. **Main Discord Bot** - Handles button interactions (runs locally or on VPS)

---

## Step 1: Deploy to Vercel

### Option A: Vercel CLI (Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd vercel_setup
   vercel
   ```

4. **Answer the prompts:**
   - Set up and deploy? → `Y`
   - Which scope? → Select your account
   - Link to existing project? → `N`
   - Project name? → `discord-bot-form-api`
   - Directory? → `./`
   - Override settings? → `N`

5. **You'll get a URL like:**
   ```
   https://discord-bot-form-api.vercel.app
   ```

### Option B: GitHub + Vercel Website

1. **Create a new GitHub repository**
2. **Push the `vercel_setup` folder to it**
3. **Go to [vercel.com](https://vercel.com)**
4. **Click "New Project"**
5. **Import your GitHub repository**
6. **Vercel auto-configures everything**
7. **Click "Deploy"**

---

## Step 2: Add Environment Variables to Vercel

**CRITICAL:** Without these, your API won't work!

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add these **THREE** variables:

   ### Variable 1: DISCORD_TOKEN
   ```
   Name:  DISCORD_TOKEN
   Value: Your Discord bot token
   ```
   (Get from: Discord Developer Portal → Your App → Bot → Token)

   ### Variable 2: API_SECRET
   ```
   Name:  API_SECRET
   Value: your-random-secret-key-123
   ```
   (Make up any random string - this secures your API)

   ### Variable 3: FORM_SUBMISSION_CHANNEL_ID
   ```
   Name:  FORM_SUBMISSION_CHANNEL_ID
   Value: 1234567890123456789
   ```
   (Right-click Discord channel → Copy Channel ID)

4. **Important:** After adding variables, click **Redeploy**
   - Go to: Deployments tab
   - Click the three dots `...` on latest deployment
   - Click "Redeploy"

---

## Step 3: Test Your Vercel Deployment

### Test the Health Endpoint

Open your browser and visit:
```
https://your-project-name.vercel.app/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "service": "Discord Bot Form API",
  "timestamp": "2024-01-13T..."
}
```

✅ If you see this, your Vercel API is working!

---

## Step 4: Update Google Apps Script

1. Open your Google Form
2. **Extensions** → **Apps Script**
3. Delete default code
4. Paste code from `GoogleAppsScript_Vercel.js`
5. **Update these two lines:**
   ```javascript
   const DISCORD_BOT_URL = 'https://your-actual-vercel-url.vercel.app';
   const API_SECRET = 'your-actual-secret-key';
   ```

6. **Run setup function:**
   - Select `createFormSubmitTrigger` from dropdown
   - Click **Run**
   - Authorize when prompted

7. **Test it:**
   - Select `testConnection` → Run → Check logs
   - Select `testFormSubmission` → Run → Check Discord!

---

## Step 5: Run Your Main Discord Bot

**Important:** Vercel only handles the API. Your main bot must run separately to handle button clicks!

### Keep Running Your Original Bot:

```bash
cd /path/to/your/original/bot
npm start
```

This bot handles:
- ✅ Button interactions (Allow/Deny clicks)
- ✅ Updating embeds with colors
- ✅ Showing "Accepted by [username]"

**Where to run it:**
- Your local computer (for testing)
- VPS (DigitalOcean, Linode, etc.)
- Railway.app
- Heroku
- Any always-on server

---

## 🎯 Complete Workflow

1. **User submits Google Form**
   ↓
2. **Apps Script sends to Vercel API**
   ↓
3. **Vercel API posts to Discord** (with buttons)
   ↓
4. **Staff clicks Allow or Deny button**
   ↓
5. **Your main bot handles the click** (updates embed)

---

## ✅ Checklist

Before testing, make sure:

- [ ] Vercel project is deployed
- [ ] All 3 environment variables added to Vercel
- [ ] Redeployed after adding environment variables
- [ ] Health endpoint returns `{"status": "ok"}`
- [ ] Google Apps Script updated with Vercel URL
- [ ] Google Apps Script API_SECRET matches Vercel
- [ ] Trigger created in Apps Script
- [ ] Main Discord bot is running (for button handling)

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check `API_SECRET` matches in both Vercel and Apps Script
- Verify you added environment variables in Vercel
- Make sure you redeployed after adding variables

### "Channel not found"
- Verify `FORM_SUBMISSION_CHANNEL_ID` is correct in Vercel
- Check your bot has access to that channel
- Make sure the channel ID is from the same server

### Buttons don't work when clicked
- **Your main bot must be running!**
- Vercel only posts the message, your main bot handles clicks
- Check your main bot console for errors

### Health endpoint doesn't load
- Check your Vercel URL is correct
- Look at Vercel function logs (Dashboard → Functions)
- Verify deployment succeeded

### Form submissions not appearing
- Run `testFormSubmission()` in Apps Script
- Check Apps Script logs (View → Logs)
- Check Vercel function logs
- Verify all environment variables are set

---

## 💰 Cost

**Vercel Free Tier includes:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited serverless function executions
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ More than enough for form submissions!

**Free Forever for this use case!**

---

## 🔄 Updating Your Code

To update after making changes:

```bash
cd vercel_setup
vercel --prod
```

Or just push to GitHub if using GitHub integration.

---

## 📊 Monitoring

### View Logs in Vercel:
1. Go to your project on vercel.com
2. Click **Logs** or **Functions**
3. See real-time function executions

### View Google Apps Script Logs:
1. In Apps Script editor
2. Click **View** → **Logs**
3. See form submission attempts

---

## 🎉 You're Done!

Your form submission system is now:
- ✅ Hosted on Vercel (free, serverless, always online)
- ✅ Secure with API key authentication
- ✅ Connected to Google Forms
- ✅ Posting to Discord with buttons
- ✅ Handling button clicks via your main bot

**Test it by submitting your form and clicking the buttons!**
