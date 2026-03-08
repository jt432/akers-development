# Akers Development — Complete Setup Guide

## Table of Contents
1. [Deploy to Vercel](#1-deploy-to-vercel)
2. [Connect Your Domain](#2-connect-your-domain)
3. [Set Up Vercel Blob Storage (File Uploads)](#3-set-up-vercel-blob-storage)
4. [Set Up Google Workspace Email](#4-set-up-google-workspace-email)
5. [Configure SMTP for Form Notifications](#5-configure-smtp)
6. [Set Up Google Business Profile](#6-google-business-profile)
7. [SEO Configuration](#7-seo-configuration)
8. [Cross-Linking Strategy](#8-cross-linking-strategy)

---

## 1. Deploy to Vercel

### Step 1: Push to GitHub
```bash
cd akers-development
git init
git add .
git commit -m "Initial commit — Akers Development website"
```

Create a new repository on GitHub called `akers-development`, then:
```bash
git remote add origin https://github.com/YOUR-USERNAME/akers-development.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Select the `akers-development` repository
4. Framework Preset will auto-detect **Next.js**
5. Click **Deploy**

### Step 3: Set Environment Variables
In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `jt@akers-development.com` |
| `SMTP_PASS` | Your Google App Password (see Section 5) |
| `NOTIFICATION_EMAIL` | `jt@akers-development.com` |
| `BLOB_READ_WRITE_TOKEN` | From Vercel Blob (see Section 3) |
| `NEXT_PUBLIC_SITE_URL` | `https://akers-development.com` |

After adding variables, click **Redeploy** to apply them.

---

## 2. Connect Your Domain

### Step 1: Add Domain in Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Type `akers-development.com` and click **Add**
3. Also add `www.akers-development.com`

### Step 2: Update DNS Records
Go to your domain registrar (GoDaddy, Namecheap, etc.) and update DNS:

**For root domain (akers-development.com):**
| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |

**For www subdomain:**
| Type | Name | Value |
|------|------|-------|
| CNAME | www | `cname.vercel-dns.com` |

DNS propagation takes 1–48 hours. Vercel will automatically provision an SSL certificate.

---

## 3. Set Up Vercel Blob Storage

Vercel Blob is used to store uploaded plan files securely.

### Step 1: Enable Blob Storage
1. Go to Vercel Dashboard → Your Project → Storage
2. Click **Create Database** → Select **Blob**
3. Name it `akers-uploads`
4. Click **Create**

### Step 2: Get the Token
1. After creation, go to the Blob store settings
2. Copy the `BLOB_READ_WRITE_TOKEN`
3. Add it to your Environment Variables (see Section 1, Step 3)

### File Storage Details
- Files are stored with public read access so you can view them from notification emails
- Each file gets a unique URL
- Files are organized under the `uploads/` prefix with timestamps
- Maximum 25MB per file, 10 files per submission
- Accepted types: PDF, JPG, PNG, DOCX

---

## 4. Set Up Google Workspace Email

### Step 1: Sign Up for Google Workspace
1. Go to [workspace.google.com](https://workspace.google.com)
2. Click **Get Started**
3. Enter your business name: **Akers Development**
4. Choose number of employees
5. Enter your domain: `akers-development.com`
6. Create your primary admin account: `jt@akers-development.com`
7. Choose a plan (Business Starter is $7.20/month)
8. Complete payment

### Step 2: Verify Your Domain
Google will ask you to verify domain ownership. The easiest method:

1. Google provides a TXT record
2. Go to your domain registrar's DNS settings
3. Add a TXT record:

| Type | Name | Value |
|------|------|-------|
| TXT | @ | `google-site-verification=XXXXXXX` (Google provides this) |

4. Return to Google Workspace and click **Verify**

### Step 3: Configure MX Records
Replace any existing MX records with Google's:

| Type | Name | Priority | Value |
|------|------|----------|-------|
| MX | @ | 1 | `ASPMX.L.GOOGLE.COM` |
| MX | @ | 5 | `ALT1.ASPMX.L.GOOGLE.COM` |
| MX | @ | 5 | `ALT2.ASPMX.L.GOOGLE.COM` |
| MX | @ | 10 | `ALT3.ASPMX.L.GOOGLE.COM` |
| MX | @ | 10 | `ALT4.ASPMX.L.GOOGLE.COM` |

### Step 4: Add SPF Record
This prevents your emails from going to spam:

| Type | Name | Value |
|------|------|-------|
| TXT | @ | `v=spf1 include:_spf.google.com ~all` |

### Step 5: Set Up DKIM
1. In Google Admin Console → Apps → Google Workspace → Gmail → Authenticate Email
2. Click **Generate New Record**
3. Add the DKIM TXT record to your DNS
4. Return and click **Start Authentication**

### Step 6: Access Your Inbox
- Go to [mail.google.com](https://mail.google.com)
- Sign in with `jt@akers-development.com` and your password
- Or use the Gmail mobile app

### Future Email Addresses
To add additional email addresses later:
1. Go to Google Admin Console → Users
2. Click **Add New User**
3. Create accounts like `info@akers-development.com` or `projects@akers-development.com`

---

## 5. Configure SMTP for Form Notifications

The website sends notification emails when someone submits the contact form or uploads plans.

### Step 1: Generate a Google App Password
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification (enable if not already)
3. At the bottom of the 2-Step Verification page, find **App Passwords**
4. Select "Mail" and "Other (custom name)" → name it "Akers Development Website"
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Add to Vercel
Add the password as `SMTP_PASS` in your Vercel environment variables (remove spaces from the app password).

### Step 3: Test
After deploying, submit a test message through the contact form. You should receive a formatted notification email at `jt@akers-development.com`.

---

## 6. Google Business Profile

### Step 1: Create Your Profile
1. Go to [business.google.com](https://business.google.com)
2. Click **Manage Now**
3. Search for your business or click **Add your business**
4. Business name: **Akers Development**
5. Category: **Real Estate Developer** (primary)
6. Add secondary categories:
   - Construction Consultant
   - Real Estate Consultant

### Step 2: Service Area
- Select **"I deliver goods and services to my customers"**
- Add your service area: Mississippi (or specific cities/counties)

### Step 3: Contact Info
- Phone: Your business phone
- Website: `https://akers-development.com`
- Email: `jt@akers-development.com`

### Step 4: Verify
Google will send a verification postcard or call you. Follow their instructions to verify ownership.

### Step 5: Optimize Your Profile
After verification:
- Add a business description mentioning: development consulting, residential development, construction cost planning, Mississippi
- Upload photos of completed projects
- Add your services list
- Encourage satisfied clients to leave reviews

---

## 7. SEO Configuration

### Already Built Into the Website
The website includes the following SEO elements:

**Meta Tags (in layout.tsx and each page):**
- Unique title tags per page (e.g., "Services | Akers Development")
- Meta descriptions targeting key search terms
- Open Graph tags for social sharing
- Keywords meta tag with target terms

**Schema.org Structured Data:**
- ProfessionalService schema on every page
- Includes: name, description, services, founder, service area

**Technical SEO:**
- Clean URL structure (`/services`, `/become-a-developer`, etc.)
- Semantic HTML headings (h1 → h2 → h3)
- Internal linking between all pages
- Mobile-responsive design
- Fast load times (Next.js static optimization)

### Additional SEO Steps

**Add a sitemap** — Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://akers-development.com/</loc><priority>1.0</priority></url>
  <url><loc>https://akers-development.com/about</loc><priority>0.8</priority></url>
  <url><loc>https://akers-development.com/services</loc><priority>0.9</priority></url>
  <url><loc>https://akers-development.com/projects</loc><priority>0.7</priority></url>
  <url><loc>https://akers-development.com/become-a-developer</loc><priority>0.9</priority></url>
  <url><loc>https://akers-development.com/our-companies</loc><priority>0.6</priority></url>
  <url><loc>https://akers-development.com/upload-plans</loc><priority>0.8</priority></url>
  <url><loc>https://akers-development.com/contact</loc><priority>0.7</priority></url>
</urlset>
```

**Add robots.txt** — Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://akers-development.com/sitemap.xml
```

**Submit to Google Search Console:**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → URL prefix → `https://akers-development.com`
3. Verify via DNS TXT record or HTML file
4. Submit your sitemap URL

**Target Keywords by Page:**
| Page | Primary Keywords |
|------|-----------------|
| Home | development consulting, Akers Development, build a house Mississippi |
| About | real estate development consultant, Jon Tyler Akers |
| Services | development consulting services, construction cost planning |
| Projects | residential development projects, land development Mississippi |
| Become a Developer | how to become a real estate developer, first-time developer |
| Upload Plans | house build cost estimate, construction cost review |
| Contact | development consultant contact, building consultant Mississippi |

---

## 8. Cross-Linking Strategy

### Three-Domain Ecosystem
| Domain | Role |
|--------|------|
| `akers-development.com` | Primary brand hub — planning & consulting |
| `vast.construction` | Construction resources & execution |
| `magnoliagranitems.com` | Interior finishes — countertops & stone |

### Cross-Linking Implementation (Already Built)

**Akers Development → Vast Construction:**
- Our Companies page links to `vast.construction`
- Footer includes Vast Construction link
- Natural context: "Construction resources are coordinated through our affiliated company, Vast Construction"

**Akers Development → Magnolia Granite:**
- Our Companies page links to `magnoliagranitems.com`
- Footer includes Magnolia Granite link
- Natural context: "Interior finishes including countertops are provided by Magnolia Granite"

### Recommended Backlinks (Add to Other Sites)

**On vast.construction:**
- Add a "Partners" or "Our Network" section
- Link text: "Development consulting and project planning by Akers Development"
- Link to: `https://akers-development.com`

**On magnoliagranitems.com:**
- Add a "Development Partners" section or footer link
- Link text: "Residential development consulting — Akers Development"
- Link to: `https://akers-development.com`

### Best Practices
- Use natural anchor text (not keyword-stuffed)
- Keep cross-links relevant and contextual
- Each site should maintain its own branding
- Don't overdo it — 2-3 links per site is plenty
- Focus on the "Our Companies" / ecosystem narrative

---

## Quick Start Checklist

- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Add environment variables in Vercel
- [ ] Connect `akers-development.com` domain
- [ ] Set up Google Workspace
- [ ] Configure DNS (MX, SPF, DKIM records)
- [ ] Generate Google App Password for SMTP
- [ ] Set up Vercel Blob Storage
- [ ] Create `sitemap.xml` and `robots.txt`
- [ ] Submit to Google Search Console
- [ ] Create Google Business Profile
- [ ] Test contact form
- [ ] Test plan upload form
- [ ] Add cross-links on vast.construction and magnoliagranitems.com
