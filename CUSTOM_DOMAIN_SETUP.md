# Custom Domain Setup Guide

## Step 1: Configure DNS Records

### Option A: Using a Root Domain (e.g., xinovates.com)

Add these DNS records to your domain provider:

**A Records:**
```
@    185.199.108.153
@    185.199.109.153
@    185.199.110.153
@    185.199.111.153
```

**OR use CNAME (if your provider supports it):**
```
@    masihhashemi.github.io
```

### Option B: Using a Subdomain (e.g., www.xinovates.com)

Add this CNAME record:
```
www    masihhashemi.github.io
```

## Step 2: Add Domain to GitHub Pages

1. Go to your repository: https://github.com/masihhashemi/xinovates
2. Navigate to: **Settings** → **Pages**
3. Under **Custom domain**, enter your domain (e.g., `xinovates.com` or `www.xinovates.com`)
4. Check **"Enforce HTTPS"** (recommended)
5. Click **Save**

GitHub will automatically create a CNAME file in your gh-pages branch.

## Step 3: Update Vite Configuration

Once your custom domain is set up and working, update `vite.config.js`:

Change:
```js
base: process.env.VITE_BASE_PATH || '/xinovates/',
```

To:
```js
base: '/',
```

Then rebuild and redeploy:
```bash
npm run build
git add -A
git commit -m "Update base path for custom domain"
git push
```

## Step 4: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate
- You can check propagation status at: https://www.whatsmydns.net/
- GitHub will show a green checkmark when DNS is configured correctly

## Step 5: Verify SSL Certificate

GitHub Pages automatically provisions SSL certificates for custom domains. This usually happens within 24 hours after DNS is configured.

## Troubleshooting

- **Domain not working?** Check DNS propagation and wait up to 48 hours
- **SSL not working?** Wait for GitHub to provision the certificate (can take up to 24 hours)
- **404 errors?** Make sure you've updated the base path in `vite.config.js` to `/`
- **Assets not loading?** Clear browser cache and verify the base path is correct

## Notes

- The CNAME file in `/public/CNAME` will be automatically deployed
- You can also manually add the domain in GitHub Settings → Pages
- GitHub will verify ownership before enabling the custom domain

