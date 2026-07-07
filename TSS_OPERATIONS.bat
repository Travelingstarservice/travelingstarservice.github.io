@echo off
title Traveling Star Service Operations
color 0A

set DB=C:\TravelingStarService\Database

:MENU
cls
echo ==========================================
echo   TRAVELING STAR SERVICE OPERATIONS
echo ==========================================
echo.
echo 1. Add Customer
echo 2. View Customers
echo.
echo 3. Add Job
echo 4. View Jobs
echo.
echo 5. Add Sponsor
echo 6. Add Donation
echo.
echo 7. Record Income
echo 8. Record Expense
echo.
echo 9. Log Communication
echo 10. View Reports
echo.
echo 0. Exit
echo ==========================================

set /p choice=Select:

if "%choice%"=="1" goto CUSTOMER
if "%choice%"=="2" goto VIEWCUSTOMER
if "%choice%"=="3" goto JOB
if "%choice%"=="4" goto VIEWJOB
if "%choice%"=="5" goto SPONSOR
if "%choice%"=="6" goto DONATION
if "%choice%"=="7" goto INCOME
if "%choice%"=="8" goto EXPENSE
if "%choice%"=="9" goto COMMUNICATION
if "%choice%"=="10" goto REPORT
if "%choice%"=="0" exit

goto MENU


:CUSTOMER
cls
echo ADD CUSTOMER

set /p name=Customer Name:
set /p phone=Phone:
set /p email=Email:

echo %name%,%phone%,%email%>>"%DB%\Customers.csv"

echo Customer Added
pause
goto MENU


:VIEWCUSTOMER
cls
echo CUSTOMER LIST
type "%DB%\Customers.csv"
pause
goto MENU


:JOB
cls
echo ADD JOB

set /p customer=Customer:
set /p service=Service:
set /p status=Status:

echo %customer%,%service%,%status%>>"%DB%\Jobs.csv"

echo Job Added
pause
goto MENU


:VIEWJOB
cls
echo JOB LIST
type "%DB%\Jobs.csv"
pause
goto MENU


:SPONSOR
cls
echo ADD SPONSOR

set /p sponsor=Sponsor Name:
set /p amount=Amount:

echo %sponsor%,%amount%>>"%DB%\Sponsors.csv"

pause
goto MENU


:DONATION
cls
echo ADD DONATION

set /p donor=Donor Name:
set /p amount=Amount:

echo %donor%,%amount%>>"%DB%\Donations.csv"

pause
goto MENU


:INCOME
cls
echo RECORD INCOME

set /p source=Source:
set /p amount=Amount:

echo INCOME,%source%,%amount%>>"%DB%\Finance.csv"

pause
goto MENU


:EXPENSE
cls
echo RECORD EXPENSE

set /p item=Expense:
set /p amount=Amount:

echo EXPENSE,%item%,%amount%>>"%DB%\Finance.csv"

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
echo REPORT SUMMARY
echo.
echo CUSTOMERS:
type "%DB%\Customers.csv"
echo.
echo JOBS:
type "%DB%\Jobs.csv"
echo.
echo FINANCE:
type "%DB%\Finance.csv"

pause
goto MENU