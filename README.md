# Discord Bot Form API - Vercel Deployment

This is a serverless API for handling Google Forms submissions and posting them to Discord with interactive buttons.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd vercel_setup
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? (Select your account)
   - Link to existing project? `N`
   - What's your project's name? `discord-bot-form-api`
   - In which directory is your code located? `./`
   - Want to override settings? `N`

5. **Your API is now live!** You'll get a URL like:
   ```
   https://discord-bot-form-api.vercel.app
   ```

### Option 2: Deploy via GitHub

1. **Push this folder to GitHub**
2. **Go to [vercel.com](https://vercel.com)**
3. **Click "Import Project"**
4. **Select your GitHub repository**
5. **Vercel will auto-detect the configuration**
6. **Click "Deploy"**

## 🔧 Environment Variables Setup

After deploying, you MUST add these environment variables in Vercel:

### Method 1: Via Vercel Dashboard

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add these three variables:

   | Name | Value |
   |------|-------|
   | `DISCORD_TOKEN` | Your bot token from Discord Developer Portal |
   | `API_SECRET` | Your random secret key (e.g., `my-secret-key-123`) |
   | `FORM_SUBMISSION_CHANNEL_ID` | Your Discord channel ID |

4. Click **Save**
5. **Redeploy** your project (Settings → Deployments → ... → Redeploy)

### Method 2: Via Vercel CLI

```bash
vercel env add DISCORD_TOKEN
# Paste your Discord bot token when prompted

vercel env add API_SECRET
# Enter your secret key (e.g., my-secret-key-123)

vercel env add FORM_SUBMISSION_CHANNEL_ID
# Enter your Discord channel ID
```

Then redeploy:
```bash
vercel --prod
```

## 📝 Using Your Vercel API URL

Once deployed, use your Vercel URL in Google Apps Script:

```javascript
const DISCORD_BOT_URL = 'https://your-project-name.vercel.app';
const API_SECRET = 'your-secret-key-123'; // Same as in Vercel env vars
```

## 🧪 Testing Your Deployment

### Test 1: Health Check
Visit: `https://your-project-name.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "service": "Discord Bot Form API",
  "timestamp": "2024-01-13T..."
}
```

### Test 2: Form Submission
Use the `testFormSubmission()` function in your Google Apps Script.

## 📁 Project Structure

```
vercel_setup/
├── api/
│   ├── form-submission.js   # Main API endpoint
│   └── health.js             # Health check endpoint
├── package.json              # Dependencies
├── vercel.json              # Vercel configuration
├── .gitignore               # Git ignore file
└── README.md                # This file
```

## 🔗 API Endpoints

Once deployed, your API will have:

- **POST** `/api/form-submission` - Receives form data and posts to Discord
- **GET** `/api/health` - Health check endpoint

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check that `API_SECRET` in Vercel matches the one in Google Apps Script
- Make sure you're using `Bearer` authentication in the header

### "Channel not found" Error
- Verify `FORM_SUBMISSION_CHANNEL_ID` is correct
- Make sure your bot has access to that channel

### Bot not responding to buttons
- **IMPORTANT:** You still need to run your main Discord bot locally or on another service
- Vercel only handles the API - it doesn't run the full Discord bot
- The button interactions need to be handled by your main bot

## ⚠️ Important Notes

### About Discord Bot Architecture

**Vercel API (Serverless):**
- ✅ Receives form submissions
- ✅ Posts messages with buttons to Discord
- ❌ Cannot handle button interactions (serverless functions are stateless)

**Your Main Bot (Must Run Separately):**
- ✅ Handles button clicks
- ✅ Updates embeds when Allow/Deny is clicked
- Must run on: Your local machine, VPS, Railway, Heroku, etc.

### Two-Part Setup Required:

1. **Vercel** - Handles incoming form submissions (this folder)
2. **Main Bot** - Handles Discord interactions (your original bot)

Both must be running for full functionality!

## 🔄 Updating Your Deployment

To update after making changes:

```bash
vercel --prod
```

Or push to GitHub if using GitHub integration.

## 💰 Pricing

- Vercel Free tier includes:
  - 100GB bandwidth/month
  - Unlimited serverless function executions
  - Custom domains
  - More than enough for form submissions!

## 🎯 Next Steps

1. ✅ Deploy this API to Vercel
2. ✅ Add environment variables in Vercel dashboard
3. ✅ Get your Vercel URL
4. ✅ Update Google Apps Script with Vercel URL
5. ✅ Run your main Discord bot (locally or on VPS) for button handling
6. ✅ Test form submission!

## 📞 Support

If you have issues:
- Check Vercel function logs (Dashboard → Functions → Logs)
- Verify all environment variables are set
- Test the health endpoint first
- Make sure your main bot is running for button interactions
