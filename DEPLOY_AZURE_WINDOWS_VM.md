# Deploy MedconnectAI on Azure Windows VM

This guide deploys:
- Django backend as a Windows service using Waitress + NSSM
- React frontend as static files served by Caddy
- HTTPS + reverse proxy via Caddy

## 1. Azure VM and Network

1. Assign a Public IP to the VM.
2. In NSG inbound rules, allow ports 22 or 3389 (your admin access), 80, and 443.
3. Point your domain DNS A record to the VM Public IP.

## 2. Install Runtime Dependencies on VM

Run PowerShell as Administrator.

Install Chocolatey (if missing):

Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

Install required tools:

choco install -y git python nodejs-lts vcredist140 nssm

Install SQL Server ODBC Driver 18:
- Download and install from Microsoft: msodbcsql18 x64
- Or install through winget/choco if available in your image

Install Caddy:

choco install -y caddy

## 3. Clone Project and Create Python Environment

cd C:\
mkdir apps -ErrorAction SilentlyContinue
cd C:\apps

git clone <your-repo-url> MedconnectAI
cd C:\apps\MedconnectAI

python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements-freeze.txt
pip install waitress

## 4. Production Environment Variables

Create/update [.env](.env) at repo root with production values.

Required Django production vars:

DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<strong-random-secret>
DJANGO_ALLOWED_HOSTS=api.yourdomain.com,localhost,127.0.0.1
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

Keep your existing DB/Twilio/Pinecone/Gemini keys in this file as needed.

## 5. Django Migrations and Static

cd C:\apps\MedconnectAI\medconnect_backend

C:\apps\MedconnectAI\.venv\Scripts\python.exe manage.py migrate
C:\apps\MedconnectAI\.venv\Scripts\python.exe manage.py collectstatic --noinput

Optional admin user:

C:\apps\MedconnectAI\.venv\Scripts\python.exe manage.py createsuperuser

## 6. Run Backend with Waitress Locally

Quick test:

cd C:\apps\MedconnectAI\medconnect_backend
C:\apps\MedconnectAI\.venv\Scripts\python.exe -m waitress --listen=127.0.0.1:8000 medconnect_backend.wsgi:application

If it starts, stop with Ctrl+C.

## 7. Build Frontend

cd C:\apps\MedconnectAI\medconnect_frontend

Create .env.production:

VITE_API_BASE_URL=https://api.yourdomain.com

Install and build:

npm install
npm run build

Build output will be in medconnect_frontend\dist.

## 8. Configure Caddy for HTTPS + Routing

Create Caddyfile at C:\Caddy\Caddyfile (or your installed Caddy config location):

yourdomain.com {
    root * C:/apps/MedconnectAI/medconnect_frontend/dist
    encode zstd gzip
    try_files {path} /index.html
    file_server
}

api.yourdomain.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:8000
}

Caddy will automatically provision TLS certificates when DNS is correct and 80/443 are open.

Restart Caddy service:

nssm restart caddy

If not installed as service yet, run:

caddy start

## 9. Create Backend Windows Service with NSSM

Create service:

nssm install medconnect-backend C:\apps\MedconnectAI\.venv\Scripts\python.exe

In NSSM GUI set:
- Path: C:\apps\MedconnectAI\.venv\Scripts\python.exe
- Startup directory: C:\apps\MedconnectAI\medconnect_backend
- Arguments: -m waitress --listen=127.0.0.1:8000 medconnect_backend.wsgi:application

Environment (AppEnvironmentExtra):
- Add DJANGO_SETTINGS_MODULE=medconnect_backend.settings

Start and enable service:

nssm start medconnect-backend
sc.exe config medconnect-backend start= auto

## 10. Validation Checklist

1. Backend health:
- Open https://api.yourdomain.com/admin/ (or API endpoint)

2. Frontend:
- Open https://yourdomain.com
- Confirm login/register calls hit https://api.yourdomain.com

3. Service state:

Get-Service medconnect-backend
Get-Service caddy

4. Logs:
- Caddy logs in Windows Event Viewer or configured log path
- NSSM can be configured with stdout/stderr log files

## 11. Common Issues

1. CORS error in browser:
- Confirm CORS_ALLOWED_ORIGINS matches exact frontend origin with https.

2. Database connection fails:
- Verify ODBC Driver 18 installed.
- Check DB firewall rules in Azure SQL to allow VM outbound IP.

3. 502/Bad Gateway on API domain:
- Confirm waitress is running on 127.0.0.1:8000.
- Check NSSM service status and logs.

4. Static/admin not loading:
- Re-run collectstatic from backend folder.

## 12. Security Immediate Action

Your current [ .env ](.env) contains real-looking secret values. Rotate all exposed credentials now:
- TWILIO_AUTH_TOKEN
- TWILIO_API_KEY_SECRET
- PINECONE_API_KEY
- GEMINI_API_KEY
- DB password/user if publicly exposed

Then update [ .env ](.env) and restart services.
