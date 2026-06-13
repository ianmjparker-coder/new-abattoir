# Website Launch & Data Storage Roadmap

This guide outlines the steps to take your project from a local prototype to a live website with user data storage.

## 1. Connecting to GitHub
I have already initialized a local Git repository for your project at `/Users/ianparker/.gemini/antigravity/playground/luminescent-kuiper`. To connect it to your GitHub account:

### Option A: Using the Terminal (Requires Git)
> [!IMPORTANT]
> Your system currently doesn't have Git command line tools installed. If you want to use the terminal, you'll need to install them by running `xcode-select --install` and following the prompts.

If you have Git installed, run these commands:
```bash
cd /Users/ianparker/.gemini/antigravity/playground/luminescent-kuiper
git remote add origin https://github.com/YOUR_USERNAME/abattoir.git
git branch -M main
git push -u origin main
```

### Option B: Manual Upload (Easiest)
1. **Create a Repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name it `abattoir`.
2. **Upload Files Directly**:
   - On your new repository page, click the **"uploading an existing file"** link.
   - Drag and drop all the files from your project folder (`/Users/ianparker/.gemini/antigravity/playground/luminescent-kuiper`) into the browser.
   - Click **"Commit changes"**.

## 2. Launching (Hosting)
To make your website accessible to everyone, you need a hosting provider:

- **GitHub Pages (Free)**: Best for static sites. You can enable this in your GitHub repository settings under "Pages".
- **Netlify / Vercel (Free Tier)**: Highly recommended for better performance and easier custom domain setup. You just connect your GitHub repo, and it deploys automatically.
- **Custom Domain**: You can buy a domain (e.g., `abattoir-scamcheck.com`) from Namecheap or Google Domains and point it to your host.

## 3. Storing User Data
Your current site is primarily frontend. To store user data (like scam reports or contact messages), you have two main paths:

### Option A: The "Modern" Way (Serverless)
Use a tool like **Supabase** or **Firebase**.
- **Pros**: Very fast to set up, handles authentication, and has a built-in database.
- **Cons**: Requires learning their specific API.

### Option B: The "Traditional" Way (Node.js Backend)
Use a Node.js server (like the one we started) with a database.
- **Database**: Use **PostgreSQL** (via a service like Railway or Supabase) for production. SQLite is great for local development but harder to manage in some cloud hosting environments.
- **Hosting**: You would need a host that supports Node.js, like **Railway**, **Render**, or **Heroku**.

---

### Recommended Next Step
If you want to start storing data **now**, I recommend we integrate **Supabase**. It provides a real-time database and auth with minimal setup. Would you like me to walk you through that?
