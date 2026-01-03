@echo off
echo Copying React build files...

if not exist "public" mkdir public
if not exist "public\\static" mkdir public\\static
if not exist "public\\static\\css" mkdir public\\static\\css
if not exist "public\\static\\js" mkdir public\\static\\js

copy "..\\client\\build\\index.html" "public\\index.html" >nul
copy "..\\client\\build\\asset-manifest.json" "public\\asset-manifest.json" >nul

for %%f in ("..\\client\\build\\static\\css\\*") do copy "%%f" "public\\static\\css\\" >nul
for %%f in ("..\\client\\build\\static\\js\\*") do copy "%%f" "public\\static\\js\\" >nul

echo Build files copied successfully!