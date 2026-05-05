# 🚀 Hosting Guide: CaddAxis

You asked how to host this on **InfinityFree**.

## ❌ Why InfinityFree Will NOT Work
InfinityFree is a **PHP Hosting** provider.
Your project is built with **Next.js (Node.js)**.
- InfinityFree cannot run Node.js servers.
- It cannot execute your Server Actions or connect to your database using the current code.
- Uploading the files will result in a blank page or 404 errors.

---

## ✅ Option 1: The "Instant Demo" (Recommended for Client View)
If you just want to **show the customer** how it looks *right now* while running it on your laptop (XAMPP):

Use **Ngrok** (A free tool to expose your localhost to the internet).

### Steps:
1. **Download Ngrok**: Go to [ngrok.com](https://ngrok.com) and sign up (free).
2. **Install**: Download and unzip it.
3. **Run Command**: Open your terminal (PowerShell) and run:
   ```powershell
   ngrok http 3000
   ```
4. **Copy URL**: Ngrok will give you a URL like `https://a1b2-c3d4.ngrok-free.app`.
   - Send this URL to your customer.
   - As long as your **`npm run dev`** is running, they can see the website!

**Pros:** No database migration needed. Uses your local XAMPP.
**Cons:** The link stops working if you close your laptop.

---

## 🌍 Option 2: Professional Hosting (Vercel)
If you want the site to be live 24/7.

1. **Frontend**: Deploy the code to **Vercel** (Free for hobby).
   - Push your code to GitHub.
   - Connect GitHub to Vercel.
   
2. **Database (CRITICAL)**: 
   - Vercel **cannot** connect to your laptop's XAMPP MySQL.
   - You must move your database to a Cloud Provider.
   - **Free MySQL Options:**
     - **TiDB Cloud** (Serverless MySQL)
     - **Aiven** (Free tier MySQL)
     - **PlanetScale** (Not free anymore, but high quality)
   
   - **Steps:**
     1. Create an account on TiDB Cloud.
     2. Create a Cluster.
     3. Get the `DB_HOST`, `DB_USER`, `DB_PASSWORD`.
     4. Update your `.env` in Vercel with these new credentials.
     5. Run the `deploy_franchise_schema.js` script pointing to the NEW cloud database to set up tables.

---

## 💡 Recommendation
For **today**, use **Option 1 (Ngrok)**. It takes 5 minutes and works perfectly for a demo.
For **launch**, use **Option 2**.
