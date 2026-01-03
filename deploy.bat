@echo off
echo 🚀 Dayflow HRMS - Automated Vercel Deployment
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install Vercel CLI if not installed
echo 📦 Checking Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

REM Get environment variables
echo.
set /p MONGODB_URI="Enter MongoDB Atlas URI: "
set /p JWT_SECRET="Enter JWT Secret (or press Enter for auto-generated): "

if "%JWT_SECRET%"=="" (
    set JWT_SECRET=dayflow-jwt-%RANDOM%-%RANDOM%
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm run install-deps

REM Build project
echo.
echo 🔨 Building project...
call npm run build

REM Login to Vercel
echo.
echo 🔐 Please login to Vercel in the browser window that opens...
vercel login

REM Deploy to Vercel
echo.
echo 🚀 Deploying to Vercel...
vercel --prod -e MONGODB_URI="%MONGODB_URI%" -e JWT_SECRET="%JWT_SECRET%" -e JWT_EXPIRE="7d" -e NODE_ENV="production"

echo.
echo ✅ Deployment completed!
echo 📋 Don't forget to update CLIENT_URL in Vercel dashboard
pause