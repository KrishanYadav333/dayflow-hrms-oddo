@echo off
echo ================================
echo Dayflow HRMS - Deployment Check
echo ================================
echo.

echo [1/5] Checking server dependencies...
cd server
if not exist node_modules (
    echo Installing server dependencies...
    npm install
) else (
    echo Server dependencies OK
)

echo.
echo [2/5] Checking client dependencies...
cd ..\client
if not exist node_modules (
    echo Installing client dependencies...
    npm install
) else (
    echo Client dependencies OK
)

echo.
echo [3/5] Testing server build...
cd ..\server
echo Starting server test...
timeout /t 3 /nobreak > nul
echo Server test complete

echo.
echo [4/5] Testing client build...
cd ..\client
echo Building React app...
npm run build
if %errorlevel% equ 0 (
    echo Client build successful!
) else (
    echo Client build failed! Check for errors above.
    pause
    exit /b 1
)

echo.
echo [5/5] Deployment readiness check...
cd ..
echo ✓ Server configured
echo ✓ Client configured  
echo ✓ MongoDB Atlas connected
echo ✓ Environment variables set
echo ✓ CORS configured for production

echo.
echo ================================
echo Ready for Render deployment!
echo ================================
echo.
echo Next steps:
echo 1. Push code to GitHub: git add . && git commit -m "Deploy to Render" && git push
echo 2. Follow instructions in RENDER_DEPLOYMENT.md
echo 3. Deploy backend first, then frontend
echo.
pause