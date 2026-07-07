@echo off
title Traveling Star Service Master Setup

echo ======================================
echo TRAVELING STAR SERVICE SETUP
echo ======================================

set ROOT=C:\TravelingStarService

echo Checking folders...

mkdir "%ROOT%\Customers" 2>nul
mkdir "%ROOT%\Jobs" 2>nul
mkdir "%ROOT%\Invoices" 2>nul
mkdir "%ROOT%\Photos" 2>nul
mkdir "%ROOT%\Transfers" 2>nul
mkdir "%ROOT%\Logs" 2>nul
mkdir "%ROOT%\Sponsors" 2>nul
mkdir "%ROOT%\Donations" 2>nul
mkdir "%ROOT%\Finance" 2>nul
mkdir "%ROOT%\Communications" 2>nul
mkdir "%ROOT%\Reports" 2>nul


echo Creating system files...

type nul > "%ROOT%\Customers\Customer_List.txt"
type nul > "%ROOT%\Customers\Customer_Notes.txt"

type nul > "%ROOT%\Sponsors\Sponsor_List.txt"
type nul > "%ROOT%\Donations\Donation_Log.txt"

type nul > "%ROOT%\Finance\Income_Log.txt"
type nul > "%ROOT%\Finance\Expense_Log.txt"

type nul > "%ROOT%\Communications\Message_Log.txt"

type nul > "%ROOT%\Reports\Monthly_Report.txt"

type nul > "%ROOT%\Logs\System_Log.txt"


echo %date% %time% - System setup completed >> "%ROOT%\Logs\System_Log.txt"

echo.
echo ======================================
echo SETUP COMPLETE
echo ======================================

tree "%ROOT%"

pause