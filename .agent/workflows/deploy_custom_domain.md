---
description: How to connect a custom domain to Vercel while keeping the original domain active.
---

# Connect Custom Domain to Vercel

Follow these steps to point your new domain to the project while ensuring `novaibeta.vercel.app` remains active (either as a redirect or independent site).

## 1. Add Domain in Vercel
1.  Go to your **Vercel Dashboard**.
2.  Select the project (`novai-intelligence` or `novai-restored`).
3.  Click **Settings** (top tabs) -> **Domains** (side menu).
4.  Enter your new domain (e.g., `novai.com`) in the input box and click **Add**.

## 2. Configure DNS (If domain is NOT bought on Vercel)
If you bought the domain elsewhere (GoDaddy, Namecheap, etc.), Vercel will show you data to add to your registrar.
1.  Log in to your Domain Registrar.
2.  Find **DNS Settings** or **Manage DNS**.
3.  Add the **A Record** (for root domain) and **CNAME** (for www) as shown in Vercel.
    *   **Type**: A | **Name**: @ | **Value**: `76.76.21.21`
    *   **Type**: CNAME | **Name**: www | **Value**: `cname.vercel-dns.com`

*It may take minutes or up to 24h for DNS to propagate, but usually it's fast.*

## 3. Recommended: Redirect Strategy (SEO Best Practice)
Vercel allows multiple domains. The best setup is:
*   **Main Domain**: `your-new-domain.com` (Status: Valid, Assigned to Main Branch)
*   **Old Domain**: `novaibeta.vercel.app` (Status: Valid, Automatically redirects to `your-new-domain.com`)

**Why?** This keeps the old link "active" (it works if clicked) but tells Google that the new domain is the real one.

## 4. Alternative: Independent Domains (No Redirect)
If you literally want `novaibeta.vercel.app` to stay in the address bar when visited:
1.  In Vercel **Domains** settings.
2.  Find `novaibeta.vercel.app`.
3.  Click **Edit**.
4.  Ensure **Redirect to** is set to `No Redirect` (or simply ensure it's not redirecting to the new domain).
    *   *Note: This is usually not recommended for SEO (duplicate content).*

## 5. Update Environment Variable
1.  Go to **Settings** -> **Environment Variables**.
2.  Find `NEXT_PUBLIC_BASE_URL`.
3.  Edit the value to your **New Domain** (e.g., `https://novai.com`).
    *   *This ensures shared links and internal API calls use the correct brand.*
4.  **Redeploy** your latest commit for the variable change to take effect (go to Deployments -> Redeploy).
