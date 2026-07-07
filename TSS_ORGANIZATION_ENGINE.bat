@echo off
title Traveling Star Service Organization Engine
color 0A

set DB=C:\TravelingStarService\Database
set LOG=C:\TravelingStarService\Logs

:MENU
cls
echo ==========================================
echo    TRAVELING STAR SERVICE
echo    ORGANIZATION ENGINE
echo ==========================================
echo.
echo 1. Add Customer
echo 2. Add Job
echo 3. Add Sponsor
echo 4. Add Donation
echo 5. Add Account
echo 6. Add Project
echo 7. Allocate Funds
echo 8. Record Expense
echo 9. Log Communication
echo 10. View Reports
echo 11. Backup System
echo 12. Transfer System
echo 0. Exit
echo.

set /p choice=Select Option:

if "%choice%"=="1" goto CUSTOMER
if "%choice%"=="2" goto JOB
if "%choice%"=="3" goto SPONSOR
if "%choice%"=="4" goto DONATION
if "%choice%"=="5" goto ACCOUNT
if "%choice%"=="6" goto PROJECT
if "%choice%"=="7" goto FUNDS
if "%choice%"=="8" goto EXPENSE
if "%choice%"=="9" goto COMMUNICATION
if "%choice%"=="10" goto REPORT
if "%choice%"=="11" goto BACKUP
if "%choice%"=="12" goto TRANSFER
if "%choice%"=="0" exit

goto MENU


:CUSTOMER
cls
echo ADD CUSTOMER
set /p id=Customer ID:
set /p name=Customer Name:
set /p phone=Phone:
set /p address=Address:

echo %id%,%name%,%phone%,%address%>>"%DB%\Customers.csv"

echo Customer Added
pause
goto MENU


:JOB
cls
echo ADD JOB
set /p customer=Customer:
set /p service=Service:
set /p date=Date:
set /p status=Status:

echo %customer%,%service%,%date%,%status%>>"%DB%\Jobs.csv"

pause
goto MENU


:SPONSOR
cls
echo ADD SPONSOR
set /p name=Sponsor:
set /p amount=Amount:
set /p project=Project:

echo %name%,%amount%,%project%>>"%DB%\Sponsors.csv"

pause
goto MENU


:DONATION
cls
echo ADD DONATION
set /p donor=Donor:
set /p amount=Amount:
set /p campaign=Campaign:

echo %donor%,%amount%,%campaign%>>"%DB%\Donations.csv"

pause
goto MENU


:ACCOUNT
cls
echo ADD ACCOUNT
set /p account=Account Name:
set /p type=Account Type:

echo %account%,%type%>>"%DB%\Accounts.csv"

pause
goto MENU


:PROJECT
cls
echo ADD PROJECT
set /p project=Project Name:
set /p budget=Budget:

echo %project%,%budget%>>"%DB%\Projects.csv"

pause
goto MENU


:FUNDS
cls
echo FUND ALLOCATION
set /p fund=Fund Name:
set /p amount=Amount:
set /p project=Project:

echo %fund%,%amount%,%project%>>"%DB%\Fund_Allocations.csv"

pause
goto MENU


:EXPENSE
cls
echo RECORD EXPENSE
set /p item=Expense:
set /p amount=Amount:
set /p category=Category:

echo %item%,%amount%,%category%>>"%DB%\Expenses.csv"

pause
goto MENU


:COMMUNICATION
cls
echo COMMUNICATION LOG
set /p person=Person:
set /p message=Message:

echo %person%,%message%>>"%DB%\Communications.csv"

pause
goto MENU


:REPORT
cls
echo ===== CUSTOMERS =====
type "%DB%\Customers.csv"

echo.
echo ===== JOBS =====
type "%DB%\Jobs.csv"

echo.
echo ===== FINANCE =====
type "%DB%\Finance.csv"

echo.
echo ===== DONATIONS =====
type "%DB%\Donations.csv"

pause
goto MENU


:BACKUP
call C:\TravelingStarService\backup.bat
pause
goto MENU


:TRANSFER
call C:\TravelingStarService\transfer.bat
pause
goto MENU