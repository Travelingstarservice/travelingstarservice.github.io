@echo off
title Traveling Star Service Control Center
color 0A

:MENU
cls
echo ==========================================
echo      TRAVELING STAR SERVICE SYSTEM
echo ==========================================
echo.
echo 1. Customers
echo 2. Jobs
echo 3. Sponsors
echo 4. Donations
echo 5. Finance
echo 6. Communications
echo 7. Reports
echo 8. Backup System
echo 9. File Transfers
echo 0. Exit
echo.
echo ==========================================

set /p choice=Select an option:

if "%choice%"=="1" goto CUSTOMERS
if "%choice%"=="2" goto JOBS
if "%choice%"=="3" goto SPONSORS
if "%choice%"=="4" goto DONATIONS
if "%choice%"=="5" goto FINANCE
if "%choice%"=="6" goto COMMUNICATIONS
if "%choice%"=="7" goto REPORTS
if "%choice%"=="8" goto BACKUP
if "%choice%"=="9" goto TRANSFER
if "%choice%"=="0" exit

goto MENU


:CUSTOMERS
cls
echo CUSTOMER MANAGEMENT
dir Customers
pause
goto MENU


:JOBS
cls
echo JOB MANAGEMENT
dir Jobs
pause
goto MENU


:SPONSORS
cls
echo SPONSOR MANAGEMENT
dir Sponsors
pause
goto MENU


:DONATIONS
cls
echo DONATION MANAGEMENT
dir Donations
pause
goto MENU


:FINANCE
cls
echo FINANCE MANAGEMENT
dir Finance
pause
goto MENU


:COMMUNICATIONS
cls
echo COMMUNICATION CENTER
dir Communications
pause
goto MENU


:REPORTS
cls
echo REPORT CENTER
dir Reports
pause
goto MENU


:BACKUP
cls
echo STARTING BACKUP...
call backup.bat
pause
goto MENU


:TRANSFER
cls
echo STARTING FILE TRANSFER...
call transfer.bat
pause
goto MENU