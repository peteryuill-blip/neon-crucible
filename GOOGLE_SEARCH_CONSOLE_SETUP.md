# Google Search Console Setup Instructions

## Overview
Google Search Console is a free tool that helps you monitor and maintain your site's presence in Google Search results.

## Setup Steps

### 1. Access Google Search Console
- Go to [https://search.google.com/search-console](https://search.google.com/search-console)
- Sign in with your Google account

### 2. Add Your Property
- Click "Add Property"
- Choose "URL prefix" method
- Enter your site URL: `https://peter-yuill.manus.space`
- Click "Continue"

### 3. Verify Ownership
Google offers several verification methods. The easiest for this site:

**HTML Tag Method (Recommended)**:
1. Google will provide an HTML meta tag like:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
2. Add this tag to `/home/ubuntu/neon-crucible/client/index.html` in the `<head>` section
3. Deploy the updated site
4. Click "Verify" in Google Search Console

**Alternative: HTML File Upload**:
1. Download the HTML verification file from Google
2. Upload it to `/home/ubuntu/neon-crucible/client/public/`
3. Deploy the site
4. Click "Verify"

### 4. Submit Sitemap
Once verified:
1. In Google Search Console, go to "Sitemaps" in the left sidebar
2. Enter your sitemap URL: `https://peter-yuill.manus.space/sitemap.xml`
3. Click "Submit"

### 5. Monitor Performance
After submission (may take a few days):
- Check "Performance" tab for search analytics
- Review "Coverage" for indexing status
- Monitor "Enhancements" for structured data validation
- Check "Mobile Usability" for mobile-friendliness

## Expected Results
- **Sitemap**: Should show all 9 pages submitted
- **Coverage**: All pages should be indexed within 1-2 weeks
- **Structured Data**: Should detect Person and WebSite schema
- **Performance**: Search impressions and clicks will appear after indexing

## Troubleshooting
- If verification fails, ensure the meta tag or file is deployed correctly
- If sitemap shows errors, check `/sitemap.xml` is accessible
- For structured data issues, use [Google Rich Results Test](https://search.google.com/test/rich-results)

## Maintenance
- Check Search Console monthly for crawl errors
- Update sitemap when adding new pages
- Monitor search performance trends
- Review mobile usability reports

## Additional Resources
- [Google Search Console Help](https://support.google.com/webmasters)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
