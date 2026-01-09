# Google Search Console - Quick Start Guide

## What You Need to Do

Follow these steps to verify your site with Google Search Console and submit your sitemap:

### Step 1: Go to Google Search Console
1. Visit: https://search.google.com/search-console
2. Sign in with your Google account

### Step 2: Add Your Site
1. Click **"Add Property"**
2. Select **"URL prefix"** method
3. Enter: `https://peter-yuill.manus.space`
4. Click **"Continue"**

### Step 3: Get Your Verification Code
1. Google will show verification methods
2. Choose **"HTML tag"** method
3. Google will provide a meta tag that looks like:
   ```html
   <meta name="google-site-verification" content="abc123xyz..." />
   ```
4. **Copy the code** (the part inside `content="..."`)

### Step 4: Add Verification Code to Your Site
1. Open the Management UI → Code panel
2. Navigate to `client/index.html`
3. Find this line (around line 17):
   ```html
   <!-- <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> -->
   ```
4. Replace `YOUR_VERIFICATION_CODE` with your actual code from Google
5. Remove the `<!--` and `-->` comment markers
6. Save the file
7. The line should now look like:
   ```html
   <meta name="google-site-verification" content="abc123xyz..." />
   ```

### Step 5: Publish the Changes
1. In the Management UI, create a new checkpoint
2. Click the **"Publish"** button to deploy your changes
3. Wait 1-2 minutes for deployment to complete

### Step 6: Verify in Google Search Console
1. Go back to Google Search Console
2. Click **"Verify"**
3. You should see a success message!

### Step 7: Submit Your Sitemap
1. In Google Search Console, click **"Sitemaps"** in the left sidebar
2. Enter: `sitemap.xml`
3. Click **"Submit"**

## That's It!

Your site is now registered with Google Search Console. Within 1-2 weeks, Google will start indexing your pages and you'll see search performance data.

## What to Check

After a few days, check these sections in Google Search Console:
- **Coverage**: Shows which pages are indexed
- **Performance**: Shows search impressions and clicks
- **Enhancements**: Shows structured data status

## Need Help?

See the full guide: `GOOGLE_SEARCH_CONSOLE_SETUP.md`
