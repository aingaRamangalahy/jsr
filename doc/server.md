```markdown
# 🖥️ VPS ⚙️ Guide for Hosting a 🌐 Fullstack App

This 📄 shows how I set up my VPS 🛠️ to host a fullstack 🧩 web app using ⚡ Vue 3 (🖼️ frontend), Node.js (🧠 backend), and MongoDB (🗃️ database). The 🖥️ runs on a DigitalOcean 🌊 droplet.

---

## 🧾 Table of Contents
1. [🔌 Initial VPS Setup](#initial-vps-setup)
2. [🛡️ Security Config](#security-configuration)
3. [🐳 Docker & 🚀 Deployment](#docker--app-deployment)
4. [🌐 Nginx Config](#nginx-configuration)
5. [🔐 SSL & 🔑 Keys](#ssl--encryption-keys)
6. [🌍 Domain Setup](#domain-configuration)

---

## 🔌 Initial VPS Setup

### ⚒️ Provision Server
- Create 💧 droplet on [DigitalOcean](https://digitalocean.com) with 🐧 Ubuntu.
- Pick 💼 basic plan (📦 1GB RAM, 1vCPU).
- Add 🗝️ SSH keys for 🔐 login.

### 🔗 Connect to Server
```bash
ssh root@your-server-ip
```

### 👤 Create Non-root User
```bash
adduser deployer
usermod -aG sudo deployer
```

### 🔑 SSH Access for New User
```bash
rsync --archive --chown=deployer:deployer ~/.ssh /home/deployer
```

---

## 🛡️ Security Configuration

### 🚫 Disable Root SSH
```bash
sudo nano /etc/ssh/sshd_config
```
- Set `PermitRootLogin no`
- 🔁 Restart SSH: `sudo systemctl restart ssh`

### 🔥 UFW Firewall Rules
```bash
sudo ufw allow OpenSSH
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

---

## 🐳 Docker & 🚀 App Deployment

### 📥 Install Docker + Compose
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker deployer
```

### 📁 App Structure
```
/my-app
  /frontend  # 🖼️ Vue 3 app
  /backend   # 🧠 Node.js API
  /common    # 🗃️ share module
  docker-compose.yml
```

### 🧾 docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
```

### 🚀 Deploy App
```bash
cd /home/deployer/my-app
docker-compose up -d --build
```

---

## 🌐 Nginx Configuration

### 🧱 Install Nginx
```bash
sudo apt install nginx
```

### 🔄 Reverse Proxy Setup
```bash
sudo nano /etc/nginx/sites-available/my-app
```

```nginx
server {
  listen 80;
  server_name yourdomain.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔐 SSL & Encryption Keys

### ⚙️ Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### 📜 Get SSL Cert
```bash
sudo certbot --nginx -d yourdomain.com
```

### 🔁 Test Auto-Renew
```bash
sudo certbot renew --dry-run
```

---

## 🌍 Domain Configuration

### ➕ Add A Record
- Go to 🌐 domain provider’s DNS 🛠️.
- Add A record:
  - Name: `@`
  - Type: `A`
  - Value: `your-server-ip`



## 🗄️ MongoDB Atlas Setup

### 1. Create a MongoDB Atlas Account
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster (the free tier is sufficient for most small projects)

### 2. Configure Database Access
- Create a database user with appropriate permissions
- Add your IP to the IP Access List or allow access from anywhere (0.0.0.0/0)

### 3. Get Your Connection String
- Click "Connect" on your cluster 
- Choose "Connect your application"
- Copy the connection string, which should look like:

```shell
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/jsresources?retryWrites=true&w=majority
```



📝 This doc will 📈 as the app matures. Customize to match your VPS 🧱 setup!
```

