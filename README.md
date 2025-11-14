# 🏨 Hotel Management System

## 🚀 Installation & Setup

### 1. Install Node.js

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### 2. Setup Backend

```bash
cd backend
npm install
nohup npm start > app.log 2>&1 &
```

### 3. Setup Frontend

```bash
cd frontend
npm install
nohup npm start > app.log 2>&1 &
```

### 4. Configuration (For EC2 Deployment)

Edit `frontend/src/services/config.js` and change:

```javascript
const API_BASE_URL = "http://www.hepin.site:5000/api";  
const API_BASE_URL = 'http://YOUR_EC2_PUBLIC_IP:5000/api';
```
if you have not domain name than use second url with ec2-publicip

Example:
```javascript
const API_URL = 'http://54.123.45.67:5000/api';
```

---

## 🔧 Alternative: Using PM2

### Install PM2

```bash
sudo npm install -g pm2
```

### Start Backend

```bash
cd backend
npm install
pm2 start npm --name "hotel-backend" -- start
```

### Start Frontend

```bash
cd frontend
npm install
pm2 start npm --name "hotel-frontend" -- start
```

### PM2 Commands

```bash
pm2 list                  # View all processes
pm2 logs hotel-backend    # View backend logs
pm2 logs hotel-frontend   # View frontend logs
pm2 restart hotel-backend # Restart backend
pm2 stop hotel-backend    # Stop backend
pm2 delete hotel-backend  # Delete backend process
```

### Save PM2 Process (Auto-start on reboot)

```bash
pm2 save
pm2 startup
```