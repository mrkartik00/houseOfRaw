# 🚀 Deploy House of Raw to Existing Digital Ocean Droplet
## Complete Beginner-Friendly Guide

## 📖 Your Situation:
- ✅ You're using your **friend's Digital Ocean account and droplet**
- ✅ Your friend's app is already running on that server
- ✅ You have access to the server with your friend's credentials
- ✅ You don't want to disturb or break the existing app
- ✅ You want to add House of Raw (houseofraw.tech) to the same server
- ✅ Both apps should run together without interfering with each other

**Think of it like:** Your friend has an apartment building (server) with a tenant already living there (their app). You want to rent another room (add House of Raw) in the same building without disturbing the existing tenant.

---

## 🔑 Important: About SSH Keys and Credentials

### Can You Use Your Friend's Credentials?

**YES! You can use your friend's existing credentials for everything. Here's how:**

**For Server Access (SSH):**
- ✅ **Use your friend's password** - If they login with password, you can use the same
- ✅ **Use your friend's SSH key** - If they have an SSH key, they can share it with you
- ✅ **You DON'T need to create your own SSH key** for basic server access

**For GitHub Actions (CI/CD - Automatic Deployment):**
- ✅ **You'll create a NEW deployment key** - This is separate and only for automatic deployments
- ✅ **This won't affect your friend's setup** - It's specifically for YOUR GitHub repository
- ✅ **Your friend's CI/CD will continue working** - Completely independent

### What Your Friend Needs to Share With You:

1. **Droplet IP Address** - The server's address (e.g., `165.232.45.78`)
2. **SSH Username** - Usually `root`, `deploy`, `ubuntu`, or a custom name
3. **Their current login method** - So you know how to set up yours

### Three Ways to Access the Server:

### ⭐ **OPTION 1: Create Your Own SSH Key (RECOMMENDED)**

**Why this is best:**
- ✅ You have your own independent access
- ✅ Your friend keeps their access
- ✅ Better security (separate credentials)
- ✅ Professional approach
- ✅ Easy to revoke your access later if needed
- ✅ Doesn't affect existing project at all

**What you need from your friend:**
1. Droplet IP address
2. SSH username (e.g., `root` or `deploy`)
3. **One-time access** to add your SSH key (they can login and add it for you)

**How it works:**
1. **You create an SSH key on YOUR computer**
2. **You send the public key to your friend** (it's safe to share)
3. **Your friend adds it to the server** (takes 30 seconds)
4. **Now you can login with your own key!**
5. **Your friend keeps their key** (both keys work)

**Jump to Step 2.2a below for detailed instructions!**

---

### **OPTION 2: Use Your Friend's Existing Credentials**

**Good for:** Quick setup, temporary access

**If they use password:**
- They share username + password with you
- You login with those credentials
- Simple but less secure (sharing passwords)

**If they use SSH key:**
- They share their private key file with you
- You use their key to login
- Works but you're using their identity

**What you need:**
- Droplet IP
- Username
- Either their password OR their private key file

**Jump to Step 2.2b below for instructions!**

---

### 🤔 **Which Option Should You Choose?**

**Choose Option 1 (Your Own Key) if:**
- ✅ You'll be working on this project long-term
- ✅ You want professional, secure setup
- ✅ Your friend is comfortable adding your key (very easy)
- ✅ You want independence

**Choose Option 2 (Their Credentials) if:**
- ✅ You need access RIGHT NOW
- ✅ It's a one-time deployment
- ✅ You trust each other completely
- ✅ Simpler for quick tasks

**Our recommendation:** Option 1 - takes 5 extra minutes but much better setup!

---

## 📋 What You'll Learn & Do:

This guide will walk you through:

1. **Add DNS records** - Tell the internet where to find your new website
2. **Create separate folder** - Give your new app its own space
3. **Setup backend** - Configure the server-side code
4. **Build frontend** - Prepare the user interface
5. **Configure web server** - Tell Nginx how to serve both apps
6. **Add SSL certificate** - Enable HTTPS (the padlock 🔒)
7. **Setup automatic deployment** - Push code and it deploys automatically

**Time needed:** 45-60 minutes (take your time, no rush!)

**What you need:**
- Access to your Digital Ocean droplet (server)
- Your domain (houseofraw.tech) from GitHub Student Pack
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Razorpay account (for payments)
- Basic patience and ability to copy-paste commands 😊

---

## 🌐 Step 1: Configure Domain DNS (Making Your Domain Point to Your Server)

### What is DNS?
DNS is like a phonebook for the internet. When someone types "houseofraw.tech", DNS tells their browser which server (your droplet) to connect to.

### 1.1 Find Your Droplet IP Address

**First, let's get your server's IP address:**

1. Open your web browser
2. Go to: https://cloud.digitalocean.com
3. Log in with your credentials
4. You'll see your droplets (servers) list
5. Find your existing droplet - it shows an IP address like `123.45.67.89`
6. **Write this down** or copy it - this is YOUR_DROPLET_IP

**Example:** If your IP is `165.232.45.78`, that's what you'll use everywhere below.

### 1.2 Go to Your Domain Registrar

**What is a domain registrar?**
It's where you got your domain (houseofraw.tech) from. Since you got it from GitHub Student Pack, it's likely one of these:

- **Name.com** - Most common with GitHub Student Pack
- **Namecheap** - Also common
- **Get.tech** - If domain ends in .tech

**How to find out which one:**
1. Check your email for "domain confirmation" or "welcome"
2. Look for emails from Name.com, Namecheap, or Get.tech
3. The email will have a link to manage your domain

### 1.3 Add DNS Records (Connecting Domain to Server)

**Step-by-step for each registrar:**

#### If using Name.com:

1. Go to https://www.name.com
2. Click **Sign In** (top right)
3. Enter your email and password
4. After logging in, you'll see **My Domains**
5. Click on **houseofraw.tech**
6. Look for **DNS Records** or **Manage DNS** button
7. Click it - you'll see a table with existing records

**Now add these THREE records:**

**Record 1: Root Domain**
- Click **Add Record** or **+** button
- Type: Select `A` (from dropdown)
- Host: Type `@` (this means root domain)
- Answer/Value: Paste your droplet IP (e.g., `165.232.45.78`)
- TTL: Leave as `300` or `3600`
- Click **Add Record** or **Save**

**Record 2: WWW Subdomain**
- Click **Add Record** again
- Type: Select `A`
- Host: Type `www`
- Answer/Value: Paste your droplet IP again
- TTL: Leave as `300` or `3600`
- Click **Add Record**

**Record 3: API Subdomain**
- Click **Add Record** again
- Type: Select `A`
- Host: Type `api`
- Answer/Value: Paste your droplet IP again
- TTL: Leave as `300` or `3600`
- Click **Add Record**

#### If using Namecheap:

1. Go to https://www.namecheap.com
2. Click **Sign In** (top right)
3. After logging in, click **Domain List** (left sidebar)
4. Find **houseofraw.tech** and click **Manage**
5. Click **Advanced DNS** tab
6. Scroll to **Host Records** section

**Add these THREE records:**

**Record 1:**
- Click **Add New Record**
- Type: Select `A Record`
- Host: Type `@`
- Value: Paste your droplet IP
- TTL: Select `Automatic` or `300`
- Save (checkmark ✓ button)

**Record 2:**
- Click **Add New Record**
- Type: `A Record`
- Host: Type `www`
- Value: Paste your droplet IP
- TTL: `Automatic`
- Save

**Record 3:**
- Click **Add New Record**
- Type: `A Record`
- Host: Type `api`
- Value: Paste your droplet IP
- TTL: `Automatic`
- Save

### 1.4 Summary of What You Just Added

After adding all records, you should have:

```
Type    Host/Name    Points To           What It Does
A       @            YOUR_DROPLET_IP     houseofraw.tech → your server
A       www          YOUR_DROPLET_IP     www.houseofraw.tech → your server
A       api          YOUR_DROPLET_IP     api.houseofraw.tech → your server
```

**Visual Check:** Your DNS table should look something like:
```
A       @       165.232.45.78    (your IP)
A       www     165.232.45.78    (your IP)
A       api     165.232.45.78    (your IP)
```

### 1.5 Wait for DNS Propagation (Very Important!)

**What is DNS propagation?**
When you add DNS records, it takes time for the entire internet to know about them. This is called "propagation."

**How long?** Usually 10-30 minutes, sometimes up to 60 minutes.

**How to check if it's ready:**

**Method 1: Using a website (Easiest)**
1. Open your browser
2. Go to: https://dnschecker.org
3. In the search box, type: `houseofraw.tech`
4. Click **Search**
5. You'll see a map showing if your domain points to your IP worldwide
6. **Wait until most locations show your IP address (green checkmarks)**

**Method 2: Using Command Prompt (Windows)**
1. Press `Win + R` on your keyboard
2. Type `cmd` and press Enter
3. In the black window that opens, type:
   ```
   nslookup houseofraw.tech
   ```
4. Press Enter
5. You should see your droplet IP in the response
6. If you see a different IP or "can't find", wait 10 more minutes and try again

**Example of successful response:**
```
Server:  dns.google
Address:  8.8.8.8

Name:    houseofraw.tech
Address:  165.232.45.78    ← Your droplet IP! ✅
```

**⚠️ IMPORTANT:** Don't proceed to next steps until DNS shows your IP address! If you try to get SSL certificate before DNS is ready, it will fail.

**Take a coffee break ☕ while DNS propagates!**

---

## 📦 Step 2: Connect to Your Server and Create Project Space

### What is SSH?
SSH (Secure Shell) is like a secure tunnel that lets you control your server from your computer. Think of it as remote controlling your server.

### 2.1 Open Command Prompt (Windows)

1. Press `Win + R` keys together on your keyboard
2. Type `cmd` in the box that appears
3. Press Enter
4. You'll see a black window - this is Command Prompt

**You should see something like:**
```
C:\Users\YourName>
```

---

## 🔑 2.2a OPTION 1: Setup Your Own SSH Key (Recommended)

### Step 1: Generate SSH Key on YOUR Computer

**In your Command Prompt (on your local computer), type:**

```bash
ssh-keygen -t ed25519 -C "houseofraw-deployment"
```

**What happens:**

1. **First prompt:**
   ```
   Enter file in which to save the key (C:\Users\YourName/.ssh/id_ed25519):
   ```
   - **Just press Enter** (use default location)

2. **Second prompt:**
   ```
   Enter passphrase (empty for no passphrase):
   ```
   - **Just press Enter** (no passphrase makes automation easier)

3. **Third prompt:**
   ```
   Enter same passphrase again:
   ```
   - **Press Enter again**

4. **You'll see:**
   ```
   Your identification has been saved in C:\Users\YourName/.ssh/id_ed25519
   Your public key has been saved in C:\Users\YourName/.ssh/id_ed25519.pub
   The key fingerprint is:
   SHA256:abc123xyz789... houseofraw-deployment
   ```

**✅ Success! You now have a key pair:**
- **Private key:** `id_ed25519` (NEVER share this!)
- **Public key:** `id_ed25519.pub` (safe to share)

### Step 2: Display Your Public Key

**In Command Prompt, type:**

```bash
type %USERPROFILE%\.ssh\id_ed25519.pub
```

**You'll see something like:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILongRandomStringOfCharactersHere houseofraw-deployment
```

**This is your PUBLIC key.** Copy this ENTIRE line (including `ssh-ed25519` at start and `houseofraw-deployment` at end).

### Step 3: Send Public Key to Your Friend

**Send your friend this message:**

```
Hey! Can you add my SSH public key to the server? 

Here's my public key:
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILongRandomStringOfCharactersHere houseofraw-deployment

All you need to do is SSH to the server and run:
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys

This takes 30 seconds and won't affect anything! Thanks!
```

### Step 4: Your Friend Adds Your Key (They Do This)

**Your friend logs into the server and runs:**

```bash
# Make sure .ssh directory exists
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key (replace with your actual key)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILongRandomStringOfCharactersHere houseofraw-deployment" >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
```

**That's it! Takes literally 30 seconds. Doesn't affect their access or the existing project at all.**

### Step 5: Test Your Connection

**Now YOU can connect with YOUR key!**

**In your Command Prompt:**

```bash
ssh username@DROPLET_IP
```

**Example:**
```bash
ssh deploy@165.232.45.78
```

**First time:** You'll see:
```
The authenticity of host '165.232.45.78' can't be established.
Are you sure you want to continue connecting (yes/no)?
```
Type `yes` and press Enter.

**If successful:**
```
Welcome to Ubuntu 22.04 LTS
...
username@server:~$
```

**🎉 You're in! And you didn't need their password or their key!**

**Troubleshooting:**

**If you get "Permission denied":**
- Make sure your friend added the ENTIRE public key (including `ssh-ed25519` at start)
- Check for extra spaces or line breaks in the key
- Make sure they ran `chmod 600 ~/.ssh/authorized_keys`

**If you get "Connection refused":**
- Check the IP address is correct
- Check your internet connection

---

## 🔓 2.2b OPTION 2: Use Friend's Credentials

### If Your Friend Uses Password Authentication:

**In your Command Prompt:**

```bash
ssh username@DROPLET_IP
```

**Example:**
```bash
ssh deploy@165.232.45.78
```

**You'll be asked for password:**
```
deploy@165.232.45.78's password:
```
- Type the password your friend gave you
- **You won't see any characters** as you type (normal)
- Press Enter

### If Your Friend Uses SSH Key:

**Your friend needs to send you their private key file** (usually `id_rsa` or `id_ed25519`).

**Save it to your computer:**
1. Create file: `C:\Users\YourName\.ssh\friend-key`
2. Paste the private key content
3. Save and close

**Connect using their key:**
```bash
ssh -i %USERPROFILE%\.ssh\friend-key username@DROPLET_IP
```

**Example:**
```bash
ssh -i %USERPROFILE%\.ssh\friend-key deploy@165.232.45.78
```

---

### 2.3 You're Now Connected to the Server!

**After successful login (either method), you'll see:**
```
Welcome to Ubuntu 22.04 LTS
...
username@your-server-name:~$
```

**The `$` symbol means you're now inside your server!** 🎉

**IMPORTANT:** Whether you used your own SSH key (Option 1) or your friend's credentials (Option 2):
- ✅ You now have access to the server
- ✅ The existing project is completely untouched
- ✅ Your friend still has their access
- ✅ You're ready to add House of Raw!

### 2.4 Check Your Current Location on the Server

**Type this command:**
```bash
pwd
```

**What does this do?** `pwd` stands for "Print Working Directory" - it shows where you are on the server.

**You'll see something like:**
```
/home/deploy
```
This means you're in your home folder. Good!

### 2.4 Look at Existing Projects (Optional but Helpful)

**Let's see what's already on your server:**

```bash
ls /var/www/
```

**What does this do?** 
- `ls` = List files/folders
- `/var/www/` = The directory where web projects usually live

**You'll see your existing project, something like:**
```
snacktrack
```
or
```
your-old-project-name
```

**Remember this name** - we'll make sure NOT to touch it!

### 2.5 Create a New Directory for House of Raw

**Now let's create a separate space for House of Raw:**

```bash
mkdir -p /var/www/houseofraw
```

**What does this mean?**
- `mkdir` = Make Directory (create folder)
- `-p` = Create parent directories if needed
- `/var/www/houseofraw` = The path where we're creating the folder

**If successful:** You won't see any message (silence means success in Linux!)

### 2.6 Navigate to Your New Folder

```bash
cd /var/www/houseofraw
```

**What does this do?**
- `cd` = Change Directory (move to a different folder)
- `/var/www/houseofraw` = Where we're moving to

**Check where you are now:**
```bash
pwd
```

**You should see:**
```
/var/www/houseofraw
```

Perfect! You're now in your House of Raw folder.

**Check if it's empty:**
```bash
ls -la
```

**You should see:**
```
total 8
drwxr-xr-x  2 deploy deploy 4096 Jan  5 10:30 .
drwxr-xr-x  4 root   root   4096 Jan  5 10:30 ..
```

This means the folder is empty and ready for your project!

### 2.7 Clone Your GitHub Repository

**What is cloning?**
Cloning means downloading a copy of your code from GitHub to your server.

**Type this command (replace YOUR_GITHUB_USERNAME):**
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/houseOfRaw.git .
```

**IMPORTANT:** 
- Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username
- Don't forget the `.` (dot) at the end! It means "clone into current folder"

**Example:** If your GitHub username is `john123`:
```bash
git clone https://github.com/john123/houseOfRaw.git .
```

**Press Enter**

**What you'll see:**
```
Cloning into '.'...
remote: Enumerating objects: 100, done.
remote: Counting objects: 100% (100/100), done.
remote: Compressing objects: 100% (85/85), done.
Receiving objects: 100% (100/100), 1.5 MiB | 2.3 MiB/s, done.
Resolving deltas: 100% (45/45), done.
```

This means your code is being downloaded!

**If you see "Repository not found":**

**Option 1: Make your repository public (EASIEST)**

This is the simplest solution!

1. **Go to your GitHub repository** in your browser
2. Click **Settings** (top right of repository page)
3. Scroll down to **Danger Zone** (bottom of settings)
4. Click **Change visibility**
5. Select **Make public**
6. Type your repository name to confirm
7. Click **I understand, change repository visibility**

**Now try cloning again:**
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/houseOfRaw.git .
```

**It will work without any authentication!** ✅

---

**Option 2: Keep it private and use SSH key**

If you want to keep your repository private:

1. **Generate an SSH key on the server:**
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```
   - Press Enter 3 times (accept defaults, no passphrase)

2. **Display your public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   - You'll see a long string starting with `ssh-ed25519`
   - Copy this ENTIRE text (drag mouse to select, right-click to copy)

3. **Add to GitHub:**
   - Open browser, go to GitHub.com
   - Click your profile picture (top right) → Settings
   - Click "SSH and GPG keys" (left sidebar)
   - Click "New SSH key" (green button)
   - Title: "House of Raw Server"
   - Key: Paste the key you copied
   - Click "Add SSH key"

4. **Try cloning again with SSH URL:**
   ```bash
   git clone git@github.com:YOUR_GITHUB_USERNAME/houseOfRaw.git .
   ```

---

**Option 3: Check if repository name is correct**
- Go to your GitHub repository in browser
- Check the exact name (case-sensitive!)
- Update the command with correct name

**After successful clone, verify files are there:**
```bash
ls -la
```

**You should now see:**
```
.git
backend/
frontend/
package.json
README.md
... other files
```

**Congratulations! Your code is now on the server!** 🎉

---

## ⚙️ Step 3: Setup Backend (Server-Side Configuration)

### What is the Backend?
The backend is the "brain" of your app - it handles database, payments, user accounts, etc. It runs on Node.js and needs to be configured with your credentials.

### 3.1 Navigate to Backend Folder

```bash
cd /var/www/houseofraw/backend
```

**Check you're in the right place:**
```bash
pwd
```

**Should show:**
```
/var/www/houseofraw/backend
```

**See what's in this folder:**
```bash
ls
```

**You should see files like:**
```
server.js
package.json
controllers/
models/
routes/
config/
```

### 3.2 Edit Environment Variables File

**What are environment variables?**
These are secret settings like database passwords, API keys, etc. We keep them in a special file called `.env`

**Check what's already in the file:**
```bash
cat .env
```

You'll see your development settings. **You need to update these with production values!**

**Edit the file with vi (already installed):**
```bash
vi .env
```

**How to use vi:**

1. **When vi opens**, you'll see your existing .env file
2. **Press `i`** to enter INSERT mode (you'll see `-- INSERT --` at the bottom)
3. **Now you can edit:**
   - Use arrow keys to move around
   - Delete text with Backspace/Delete
   - Type new text
4. **When done editing:**
   - Press `Esc` key (exits insert mode)
   - Type `:wq` and press Enter (saves and quits)
   - If you want to quit without saving: type `:q!` and press Enter

**Vi Quick Reference:**
- `i` = Start editing (INSERT mode)
- `Esc` = Stop editing
- `:wq` = Save and quit
- `:q!` = Quit without saving
- `dd` = Delete entire line (in command mode, not INSERT)

### 3.3 Update Environment Variables for Production

**You need to change these values from development to production:**

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
NODE_ENV=production
PORT=7000

# ============================================
# IMPORTANT: PORT SELECTION
# ============================================
# Your existing app is using a port (probably 5000 or 3000)
# We MUST use a DIFFERENT port for House of Raw
# Common choices: 7000, 7001, 8000, 8001
# If 7000 doesn't work, try 7001

# ============================================
# MONGODB DATABASE
# ============================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/houseofraw?retryWrites=true&w=majority

# ============================================
# JWT (JSON Web Token) - For User Authentication
# ============================================
JWT_SECRET=your-random-jwt-secret-key
JWT_EXPIRE=7d

# ============================================
# CLOUDINARY - Image Storage
# ============================================
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ============================================
# RAZORPAY - Payment Gateway
# ============================================
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# ============================================
# FRONTEND URLs
# ============================================
CLIENT_URL=https://houseofraw.tech
FRONTEND_URL=https://houseofraw.tech
ALLOWED_ORIGINS=https://houseofraw.tech,https://www.houseofraw.tech

# ============================================
# EMAIL (Optional - for order confirmations)
# ============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@houseofraw.tech
```

**How to paste in vi:**
- Press `i` to enter INSERT mode
- Right-click in the Command Prompt window to paste
- Your text will be pasted

### 3.4 Fill in YOUR Actual Values

**Now you need to replace the placeholder values with your real credentials. Let me guide you through each one:**

#### A. MONGODB_URI (Database Connection)

**What you need to replace:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/houseofraw?retryWrites=true&w=majority
```

**How to get the correct value:**

1. **Open browser and go to:** https://cloud.mongodb.com
2. **Log in** with your MongoDB Atlas account
3. You'll see your cluster (looks like a card with "Cluster0" or similar)
4. **Click the "Connect" button** (big button on your cluster)
5. **Click "Connect your application"**
6. **Make sure "Driver" is set to: Node.js**
7. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. **Replace `<password>` with your actual database password**
   - This is the password you created when setting up MongoDB
   - NOT your MongoDB account password
9. **Add database name before the `?`:**
   ```
   mongodb+srv://admin:YourPass123@cluster0.xxxxx.mongodb.net/houseofraw?retryWrites=true&w=majority
   ```
   
**Final example:**
```env
MONGODB_URI=mongodb+srv://admin:MySecret123@cluster0.ab1cd.mongodb.net/houseofraw?retryWrites=true&w=majority
```

**⚠️ CRITICAL: Make sure:**
- No spaces in the connection string
- Password is correct (case-sensitive)
- Added `/houseofraw` before the `?`

#### B. JWT_SECRET (Security Key)

**What you need to replace:**
```env
JWT_SECRET=your-random-jwt-secret-key
```

**How to generate a secure random secret:**

**Method 1: In your server terminal (easiest)**
```bash
# Open a new terminal session (don't close vi!)
# Press Ctrl+Z to suspend vi
openssl rand -base64 32
```

You'll get something like:
```
K7xN3mP9qR5vW8yE2aS4dF6gH8jL0nM=
```

**Copy this entire string** (including the `=` at the end)

**Method 2: Use an online generator**
- Go to: https://www.random.org/strings/
- Generate a long random string

**Replace in .env:**
```env
JWT_SECRET=K7xN3mP9qR5vW8yE2aS4dF6gH8jL0nM=
```

**Bring back vi:**
```bash
fg
```

#### C. CLOUDINARY Credentials (Image Storage)

**What you need to replace:**
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**How to get these:**

1. **Go to:** https://cloudinary.com
2. **Log in** to your account
3. **You'll land on the Dashboard** - this is the main page
4. **Look for "Account Details" section** (top of page)
5. **You'll see three values:**
   - **Cloud Name:** (e.g., `dkxy9z8ab`)
   - **API Key:** (e.g., `123456789012345`)
   - **API Secret:** Click "reveal" to show it (e.g., `abcdefghijklmnopqrstuv`)

**Copy each value and paste into your .env:**
```env
CLOUDINARY_CLOUD_NAME=dkxy9z8ab
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuv
```

#### D. RAZORPAY Credentials (Payment Gateway)

**What you need to replace:**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
```

**How to get these:**

1. **Go to:** https://dashboard.razorpay.com
2. **Log in** with your Razorpay account
3. **Make sure you're in "Test Mode"** (check toggle in header)
4. **Go to: Settings → API Keys** (left sidebar)
5. **Click "Generate Test Keys"** if you haven't already
6. **You'll see:**
   - **Key ID:** (e.g., `rzp_test_1A2b3C4d5E6f7G`)
   - **Key Secret:** Click "Show" to reveal (e.g., `H8i9J0k1L2m3N4o5P6q7`)

**Copy and paste:**
```env
RAZORPAY_KEY_ID=rzp_test_1A2b3C4d5E6f7G
RAZORPAY_KEY_SECRET=H8i9J0k1L2m3N4o5P6q7
```

#### E. Check PORT Setting

**Very important!** Look at this line:
```env
PORT=5001
```

**What port is your existing app using?**

**To check, open a new terminal and connect to server, then:**
```bash
pm2 status
```

You'll see something like:
```
┌─────┬──────────────┬─────────┬──────┬─────────┐
│ id  │ name         │ status  │ cpu  │ memory  │
├─────┼──────────────┼─────────┼──────┼─────────┤
│ 0   │ snacktrack   │ online  │ 0%   │ 50MB    │
└─────┴──────────────┴─────────┴──────┴─────────┘
```

**Now check which port it uses:**
```bash
pm2 info snacktrack
```

Look for a line showing:
```
│ env  │ PORT: 5000   ← Your old app uses port 5000
```

**Rule:** If old app uses 5000, House of Raw should use 7000 ✅

**If old app uses 3000, you can use 7000 or 7001 ✅**

**The ports MUST be different!** Otherwise, apps will conflict.

### 3.5 Save the .env File

**After filling in all values:**

1. **Press `Esc`** (exit insert mode)
2. **Type `:wq`** (write and quit)
3. **Press Enter**
4. **You're back to the normal terminal!**

**Alternative save commands:**
- `:w` = Save without quitting
- `:q!` = Quit without saving changes

### 3.6 Verify Your .env File

**Let's check if the file was created correctly:**

```bash
ls -la
```

**You should see `.env` in the list.**

**Check the contents (this shows the file without editing):**
```bash
cat .env
```

**You should see all your configuration** (don't worry, only you can see this on your server)

**⚠️ NEVER share your .env file or commit it to GitHub!** It contains all your secrets!

### 3.7 Install Backend Dependencies

**What are dependencies?**
These are external code packages that your app needs to work (like Express, Mongoose, etc.)

**Install them:**
```bash
npm install --production
```

**What you'll see:**
```
npm WARN deprecated ...
added 245 packages, and audited 246 packages in 45s
```

**This takes 2-5 minutes.** Be patient!

**What `--production` means:**
- Only installs packages needed to run the app
- Skips development tools (faster and smaller)

### 3.8 Start Backend with PM2

**What is PM2?**
PM2 is a process manager - it keeps your Node.js app running 24/7, automatically restarts it if it crashes, and helps manage multiple apps.

**Start your backend:**
```bash
pm2 start server.js --name houseofraw-api --env production
```

**What this command does:**
- `pm2 start` = Start a new process with PM2
- `server.js` = The main file of your backend
- `--name houseofraw-api` = Give it a unique name (different from your old app!)
- `--env production` = Use production environment

**What you'll see:**
```
[PM2] Starting /var/www/houseofraw/backend/server.js in fork_mode (1 instance)
[PM2] Done.
┌─────┬──────────────────┬─────────┬──────┬─────────┐
│ id  │ name             │ status  │ cpu  │ memory  │
├─────┼──────────────────┼─────────┼──────┼─────────┤
│ 1   │ houseofraw-api   │ online  │ 0%   │ 45MB    │
└─────┴──────────────────┴─────────┴──────┴─────────┘
```

**Look at the "status" column:**
- ✅ **online** = Great! It's running
- ❌ **errored** = Something's wrong

### 3.9 Check Status of All Apps

```bash
pm2 status
```

**You should see BOTH apps:**
```
┌─────┬──────────────────┬─────────┬──────┬─────────┐
│ id  │ name             │ status  │ cpu  │ memory  │
├─────┼──────────────────┼─────────┼──────┼─────────┤
│ 0   │ your-old-app     │ online  │ 0%   │ 50MB    │  ← Existing app still running ✅
│ 1   │ houseofraw-api   │ online  │ 0%   │ 45MB    │  ← New app running ✅
└─────┴──────────────────┴─────────┴──────┴─────────┘
```

**Perfect! Both apps are running side by side!**

### 3.10 If Status Shows "errored"

**If houseofraw-api shows "errored" status:**

```bash
pm2 logs houseofraw-api --lines 30
```

**This shows the last 30 lines of logs. Common errors:**

**Error: "Port 7000 already in use"**
- Solution: Change PORT in .env to 7001, then restart:
  ```bash
  vi .env
  # Press 'i' to edit
  # Change PORT=7000 to PORT=7001
  # Press Esc, type :wq, press Enter
  pm2 restart houseofraw-api
  ```

**Error: "MongooseError: Invalid connection string"**
- Solution: Check your MONGODB_URI in .env
- Make sure no spaces, password is correct

**Error: "Cannot find module"**
- Solution: Install dependencies again:
  ```bash
  npm install --production
  pm2 restart houseofraw-api
  ```

### 3.11 Save PM2 Configuration

**Save the current PM2 configuration so apps restart after server reboot:**

```bash
pm2 save
```

**You'll see:**
```
[PM2] Saving current process list...
[PM2] Successfully saved in /home/deploy/.pm2/dump.pm2
```

### 3.12 Test Backend Locally

**Check if your backend is responding:**

```bash
curl http://localhost:7000
```

**If you get any response (even an error message), it means backend is listening! ✅**

**Examples of good responses:**
```
{"message":"Cannot GET /"}
```
or
```
{"error":"Not Found"}
```
or
```
{"status":"ok"}
```

**Bad response:**
```
curl: (7) Failed to connect to localhost port 7000: Connection refused
```
This means backend is not running - check PM2 status and logs.

**Congratulations! Your backend is now running!** 🎉

---

## 🎨 Step 4: Build Frontend (User Interface)

### What is the Frontend?
The frontend is what users see and interact with in their browser - the website interface. It's built with React and needs to be "built" (compiled) into optimized files.

### 4.1 Navigate to Frontend Folder

```bash
cd /var/www/houseofraw/frontend
```

**Check you're in the right place:**
```bash
pwd
```

**Should show:**
```
/var/www/houseofraw/frontend
```

### 4.2 Create Frontend Environment File

**The frontend also needs some configuration:**

```bash
vi .env.production
```

**Why `.env.production` and not just `.env`?**
- `.env` is for local development
- `.env.production` is specifically for the live website
- Vite (our build tool) automatically uses `.env.production` when building for production

**How to create the file with vi:**
1. **Command opens vi** in a new file (doesn't exist yet)
2. **Press `i`** to enter INSERT mode
3. **Type or paste the content** below
4. **Press `Esc`**, type `:wq`, press Enter to save and quit

### 4.3 Add Frontend Environment Variables

**In the vi editor, paste this:**

```env
# ============================================
# API URL - Where the frontend talks to backend
# ============================================
VITE_API_URL=https://api.houseofraw.tech

# ============================================
# RAZORPAY PUBLIC KEY - For payment gateway
# ============================================
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# ============================================
# APP NAME
# ============================================
VITE_APP_NAME=House of Raw

# ============================================
# NOTE: These variables start with VITE_
# This is required by Vite to expose them to the browser
# Variables without VITE_ prefix won't work!
# ============================================
```

**Now replace the placeholders:**

#### A. VITE_API_URL

**This should already be correct:**
```env
VITE_API_URL=https://api.houseofraw.tech
```

**This tells your frontend where to find the backend API.**

**⚠️ Make sure it's `https://api.` (not just `api.` and not `http://`)**

#### B. VITE_RAZORPAY_KEY_ID

**Use the SAME Razorpay Key ID from your backend .env:**

1. Remember the Razorpay Key ID from Step 3.4.D?
2. It looks like: `rzp_test_1A2b3C4d5E6f7G`
3. Paste it here

```env
VITE_RAZORPAY_KEY_ID=rzp_test_1A2b3C4d5E6f7G
```

**⚠️ IMPORTANT:** Use the Key ID, NOT the Key Secret!
- Key ID = Public (safe to use in frontend)
- Key Secret = Private (only in backend!)

### 4.4 Save the File

**After filling in all values:**

1. **Press `Esc`** (exit insert mode)
2. **Type `:wq`** (write and quit)
3. **Press Enter**
4. **You're back to the normal terminal!**

**Verify the file was created:**
```bash
cat .env.production
```

You should see your configuration values.

### 4.5 Install Frontend Dependencies

**Your frontend needs packages too (React, React Router, etc.):**

```bash
npm install
```

**This takes 3-5 minutes.** You'll see:
```
added 1247 packages, and audited 1248 packages in 180s

234 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**If you see "vulnerabilities":** Don't panic! 
- Low/moderate vulnerabilities in development dependencies are usually fine
- Only worry if you see "critical" vulnerabilities in production

### 4.6 Build the Frontend

**Now let's compile the frontend into optimized files:**

```bash
npm run build
```

**What happens during build:**
```
vite v5.0.0 building for production...
✓ 1247 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-a1b2c3d4.css   125.32 kB
dist/assets/index-e5f6g7h8.js    482.15 kB

✓ built in 45.23s
```

**This takes 1-2 minutes.**

**What does this create?**
- A `dist/` folder with optimized HTML, CSS, and JavaScript
- All your React code is compiled into a few files
- Images are optimized
- Code is minified (made smaller)

### 4.7 Verify the Build

**Check if the dist folder was created:**

```bash
ls -la
```

**You should see a `dist` folder in the list.**

**Look inside dist:**
```bash
ls -la dist/
```

**You should see:**
```
index.html           ← Main HTML file
assets/              ← Folder with CSS and JavaScript files
favicon.ico          ← Website icon
... other files
```

**Check if index.html exists and is not empty:**
```bash
ls -lh dist/index.html
```

**Should show something like:**
```
-rw-r--r-- 1 deploy deploy 450 Jan  5 11:30 dist/index.html
```

**The file size should be a few hundred bytes or KB, not 0.**

**If dist folder is missing or empty:**
```bash
# Check for build errors
npm run build

# Look for error messages in red
# Common issues: missing dependencies, syntax errors
```

### 4.8 Quick Preview Test (Optional)

**⚠️ This step is completely OPTIONAL - you can skip it!**

**Want to see if your build works? You can quickly test it:**

**First, check if port 8080 is free:**
```bash
lsof -i :8080
```

**If nothing shows up, port 8080 is free! If something is already using it, try 8081, 8082, etc.**

**Start a temporary test server:**
```bash
cd dist
python3 -m http.server 8080
```

**Or if port 8080 is busy, use a different port:**
```bash
python3 -m http.server 8081  # Try 8081
# or
python3 -m http.server 8082  # Try 8082
```

**Then in your local computer browser, visit:**
```
http://YOUR_DROPLET_IP:8080
```
(Replace 8080 with whatever port you used)

**You should see your website (without API working yet).**

**To stop the test server:** Press `Ctrl + C`

**Go back to frontend folder:**
```bash
cd /var/www/houseofraw/frontend
```

**Note:** This test server is just temporary for testing. Nginx will serve your real site once configured!

**Great! Your frontend is built and ready!** 🎉

---

## ⚙️ Step 4: Add Nginx Configuration (Separate from Existing)

### 4.1 Create New Nginx Site Config

```bash
vi /etc/nginx/sites-available/houseofraw
```

**How to create the file with vi:**
1. **Command opens vi** in a new file
2. **Press `i`** to enter INSERT mode
3. **Paste the configuration** below (right-click to paste)
4. **Press `Esc`**, type `:wq`, press Enter to save and quit

**Paste this configuration:**

```nginx
# House of Raw - Frontend
server {
    listen 80;
    listen [::]:80;
    server_name houseofraw.tech www.houseofraw.tech;

    root /var/www/houseofraw/frontend/dist;
    index index.html;

    # Logs for this site only
    access_log /var/log/nginx/houseofraw-access.log;
    error_log /var/log/nginx/houseofraw-error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Static assets cache
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# House of Raw - Backend API
server {
    listen 80;
    listen [::]:80;
    server_name api.houseofraw.tech;

    # Logs for API
    access_log /var/log/nginx/houseofraw-api-access.log;
    error_log /var/log/nginx/houseofraw-api-error.log;

    # Request size limit
    client_max_body_size 10M;

    # Proxy to Node.js backend on port 7000
    location / {
        proxy_pass http://localhost:7000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**IMPORTANT:** Notice `proxy_pass http://localhost:7000;` matches your backend PORT!

**Save:** Press `Esc`, type `:wq`, press Enter

### 4.2 Enable New Site

```bash
# Enable the new site
ln -s /etc/nginx/sites-available/houseofraw /etc/nginx/sites-enabled/

# Test Nginx config (IMPORTANT - checks if syntax is correct)
nginx -t
```

**You should see:**
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If you see errors:**
- Check for typos in the config file
- Make sure paths are correct
- Make sure port 7000 matches your backend

### 4.3 Reload Nginx (NOT Restart - Keeps Existing App Running!)

```bash
systemctl reload nginx
```

**This reloads config WITHOUT disrupting your existing app!**

### 4.4 Check Both Sites Work

**Check your existing app:**
```bash
curl -I http://YOUR_EXISTING_DOMAIN.com
# Should return 200 OK
```

**Check new app:**
```bash
curl -I http://houseofraw.tech
# Should return 200 OK
```

**Check new API:**
```bash
curl http://api.houseofraw.tech
# Should get response from backend
```

**If existing app stopped working:**
```bash
# Check Nginx status
systemctl status nginx

# Check Nginx error logs
tail -50 /var/log/nginx/error.log

# Restart Nginx if needed
systemctl restart nginx
```

---

## 🔒 Step 5: Add SSL Certificate for New Domain

### 5.1 Get SSL for Frontend

```bash
certbot --nginx -d houseofraw.tech -d www.houseofraw.tech
```

**Prompts:**
- Email: Your email (or press Enter if already configured)
- Terms: Y
- Redirect HTTP to HTTPS: 2

**This ONLY affects houseofraw.tech - your existing site is untouched!**

### 5.2 Get SSL for API

```bash
certbot --nginx -d api.houseofraw.tech
```

Same prompts as above.

### 5.3 Verify SSL

**Open browser:**
- ✅ https://houseofraw.tech (🔒 green padlock)
- ✅ https://api.houseofraw.tech (🔒 green padlock)
- ✅ Your existing site still works with SSL

**Check certificates:**
```bash
certbot certificates
```

Should show:
- Your existing domain's certificate(s)
- houseofraw.tech certificate
- api.houseofraw.tech certificate

**All certificates auto-renew - no action needed!**

---

## 🔄 Step 6: Setup CI/CD for This Project Only

### 6.1 Check Existing SSH Keys

**On your server:**

```bash
ls ~/.ssh/
```

**If you already have `github-actions` or similar keys from your previous project:**

Option A: **Reuse the same key** (simpler)
```bash
cat ~/.ssh/github-actions  # Or whatever key name you used
# Copy this - you'll use it in GitHub secrets
```

Option B: **Create a new key for this project** (more organized)
```bash
ssh-keygen -t ed25519 -C "github-houseofraw" -f ~/.ssh/github-houseofraw
cat ~/.ssh/github-houseofraw.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github-houseofraw  # Copy this
```

### 6.2 Add GitHub Secrets (For This Repository Only)

Go to **your House of Raw GitHub repository** (not the old one):

**Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret Name | Value |
|------------|--------|
| `DEPLOY_HOST` | Your droplet IP (same as existing) |
| `DEPLOY_USER` | Your SSH username (same as existing) |
| `DEPLOY_KEY` | SSH private key (from step 6.1) |
| `DEPLOY_PATH` | `/var/www/houseofraw` |
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID |

### 6.3 Create Deployment Workflow

**On your LOCAL computer, in your houseOfRaw project:**

Create: `.github/workflows/deploy.yml`

```yaml
name: Deploy House of Raw

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            echo "🚀 Deploying House of Raw..."
            
            cd ${{ secrets.DEPLOY_PATH }}
            git pull origin main
            
            # Backend
            echo "📦 Updating Backend..."
            cd backend
            npm install --production
            pm2 restart houseofraw-api
            
            # Frontend
            echo "🎨 Building Frontend..."
            cd ../frontend
            npm install
            npm run build
            
            echo "✅ Deployment Complete!"
            pm2 status
```

**IMPORTANT:** Notice:
- Uses `${{ secrets.DEPLOY_PATH }}` which is `/var/www/houseofraw`
- Restarts only `houseofraw-api` (not your other app)
- Separate workflow - doesn't affect your existing app's CI/CD

### 6.4 Commit and Push

```bash
git add .github/workflows/deploy.yml
git commit -m "Add deployment workflow"
git push origin main
```

### 6.5 Verify Deployment

1. Go to GitHub → Your Repo → Actions tab
2. You should see "Deploy House of Raw" running
3. Click on it to watch progress
4. Wait for green checkmark ✅

**Your existing app's CI/CD continues to work independently!**

---

## ✅ Step 7: Final Verification

### 7.1 Check Both Apps Are Running

```bash
pm2 status
```

Should show:
```
┌─────┬──────────────────┬─────────┬──────┬─────────┐
│ id  │ name             │ status  │ cpu  │ memory  │
├─────┼──────────────────┼─────────┼──────┼─────────┤
│ 0   │ your-old-app     │ online  │ 0%   │ 50MB    │
│ 1   │ houseofraw-api   │ online  │ 0%   │50MB     │
└─────┴──────────────────┴─────────┴──────┴─────────┘
```

### 7.2 Check Nginx Sites

```bash
# List all enabled sites
ls -la /etc/nginx/sites-enabled/
```

Should show:
- Your existing site config
- `houseofraw` symlink

### 7.3 Test All URLs

**Your existing app:**
- ✅ https://your-existing-domain.com (should work as before)

**New House of Raw app:**
- ✅ https://houseofraw.tech (should load)
- ✅ https://api.houseofraw.tech (should respond)

### 7.4 Test User Flow

1. Register new user on houseofraw.tech
2. Login
3. Browse products
4. Add to cart
5. Test checkout with Razorpay test mode
6. Check admin panel works

### 7.5 Check Resource Usage

```bash
# Memory
free -h

# Disk space
df -h

# CPU and processes
htop  # or top
```

**If running low on memory:** Consider upgrading your droplet.

---

## 📊 Resource Management

### Your Droplet Now Runs:

1. **Existing App:**
   - Process: Your old PM2 process
   - Port: Your old port (e.g., 5000)
   - Domain: Your existing domain
   - Directory: Your existing directory

2. **House of Raw:**
   - Process: `houseofraw-api`
   - Port: 7000
   - Domain: houseofraw.tech
   - Directory: /var/www/houseofraw

3. **Shared Services:**
   - Nginx (serving both sites)
   - PM2 (managing both processes)
   - Certbot (SSL for all domains)
   - MongoDB Atlas (cloud, not on server)

### Typical Resource Usage

**1GB Droplet:** Might be tight with 2 apps
**2GB Droplet:** Should handle 2 apps comfortably
**4GB Droplet:** Plenty of room

**Check memory:**
```bash
free -h
```

**If < 200MB free:** Consider upgrading droplet size.

---

## 🔧 Maintenance Commands

### Managing Both Apps

**Check status of all apps:**
```bash
pm2 status
```

**Restart specific app:**
```bash
pm2 restart houseofraw-api      # Only House of Raw
pm2 restart your-old-app         # Only existing app
pm2 restart all                  # Both apps
```

**View logs:**
```bash
pm2 logs houseofraw-api          # House of Raw logs
pm2 logs your-old-app            # Existing app logs
pm2 logs                         # All logs
```

**Update House of Raw only:**
```bash
cd /var/www/houseofraw
git pull origin main
cd backend && npm install --production
pm2 restart houseofraw-api
cd ../frontend && npm run build
```

**Or just push to GitHub - CI/CD does it automatically!**

### Nginx Management

**Test config (always do this before reload/restart):**
```bash
nginx -t
```

**Reload config (doesn't drop connections):**
```bash
systemctl reload nginx
```

**Restart Nginx (only if reload doesn't work):**
```bash
systemctl restart nginx
```

**Check Nginx logs:**
```bash
# House of Raw logs
tail -f /var/log/nginx/houseofraw-error.log

# Existing app logs (whatever filename you used)
tail -f /var/log/nginx/your-old-app-error.log

# General Nginx logs
tail -f /var/log/nginx/error.log
```

### SSL Certificate Management

**List all certificates:**
```bash
certbot certificates
```

**Renew all certificates:**
```bash
certbot renew
```

**Auto-renewal is already configured - no action needed!**

---

## 🆘 Troubleshooting

### Issue: "Port Already in Use"

**Error:** `EADDRINUSE: address already in use :::7000`

**Solution:**
```bash
# Check what's using the port
lsof -i :7000

# If it shows old process, kill it
pm2 delete houseofraw-api
pm2 start server.js --name houseofraw-api

# Or use a different port
# Edit /var/www/houseofraw/backend/.env
# Change PORT=7000 to PORT=7001
# Update Nginx config to proxy_pass http://localhost:7001
```

### Issue: "Existing App Stopped Working"

**Quick fix:**
```bash
# Check PM2 status
pm2 status

# Restart if needed
pm2 restart your-old-app

# Check Nginx
systemctl status nginx
nginx -t
systemctl reload nginx
```

### Issue: "502 Bad Gateway on New Site"

**Checklist:**
```bash
# 1. Backend running?
pm2 status

# 2. Backend listening on correct port?
pm2 logs houseofraw-api

# 3. Nginx proxy to correct port?
cat /etc/nginx/sites-available/houseofraw | grep proxy_pass
# Should show: proxy_pass http://localhost:7000;

# 4. Test backend directly
curl http://localhost:7000

# 5. Check Nginx logs
tail -20 /var/log/nginx/houseofraw-error.log
```

### Issue: "Out of Memory"

**Check memory:**
```bash
free -h
```

**If very low:**

Option 1: **Upgrade droplet** (recommended)
- Digital Ocean Dashboard → Your Droplet → Resize
- Choose larger plan

Option 2: **Add swap space** (temporary fix)
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Issue: "SSL Certificate Failed"

**Most common:** DNS not fully propagated yet.

**Solution:**
```bash
# Wait 30 more minutes, then retry
certbot --nginx -d houseofraw.tech -d www.houseofraw.tech
```

**Check DNS:**
```bash
nslookup houseofraw.tech
# Should show your droplet IP
```

---

## 🎯 Quick Command Reference

```bash
# SSH to server
ssh your-user@YOUR_DROPLET_IP

# Check both apps
pm2 status

# View House of Raw logs
pm2 logs houseofraw-api

# Restart House of Raw only
pm2 restart houseofraw-api

# Update House of Raw manually
cd /var/www/houseofraw
git pull origin main
cd backend && npm install --production
pm2 restart houseofraw-api
cd ../frontend && npm run build

# Check Nginx
nginx -t
systemctl status nginx

# Check SSL certificates
certbot certificates

# Check resources
free -h
df -h
pm2 monit
```

---

## 🎉 Success!

You now have **TWO apps running on the same droplet:**

**Existing App:**
- ✅ Still running
- ✅ Same domain
- ✅ Same configuration
- ✅ Independent CI/CD

**House of Raw:**
- ✅ Running on houseofraw.tech
- ✅ Separate directory
- ✅ Separate PM2 process
- ✅ Separate Nginx config
- ✅ Independent CI/CD
- ✅ Own SSL certificates

**Both apps:**
- Run independently
- Don't interfere with each other
- Have separate logs
- Can be updated separately
- Auto-deploy on git push

**Cost:** Still same droplet cost - no additional hosting fees! 💰

---

**Deployment Complete! Your House of Raw is live! 🎉**
