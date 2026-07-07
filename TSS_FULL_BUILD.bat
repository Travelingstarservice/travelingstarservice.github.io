@echo off
title Traveling Star Service - Full Business System Build
color 0A

set ROOT=C:\TravelingStarService

echo ==========================================
echo  TRAVELING STAR SERVICE FULL BUILD
echo ==========================================
echo.

echo Creating business structure...

mkdir "%ROOT%" 2>nul
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
mkdir "%ROOT%\Database" 2>nul


echo Creating database files...

type nul > "%ROOT%\Database\Customers.csv"
type nul > "%ROOT%\Database\Jobs.csv"
type nul > "%ROOT%\Database\Sponsors.csv"
type nul > "%ROOT%\Database\Donations.csv"
type nul > "%ROOT%\Database\Finance.csv"
type nul > "%ROOT%\Database\Communications.csv"


echo Creating customer system...

type nul > "%ROOT%\Customers\Customer_List.txt"
type nul > "%ROOT%\Customers\Customer_Notes.txt"


echo Creating job system...

type nul > "%ROOT%\Jobs\Job_List.txt"
type nul > "%ROOT%\Jobs\Job_Status.txt"


echo Creating sponsor system...

type nul > "%ROOT%\Sponsors\Sponsor_List.txt"
type nul > "%ROOT%\Sponsors\Sponsor_Contacts.txt"


echo Creating donation system...

type nul > "%ROOT%\Donations\Donation_Log.txt"
type nul > "%ROOT%\Donations\Donor_List.txt"


echo Creating finance system...

type nul > "%ROOT%\Finance\Income_Log.txt"
type nul > "%ROOT%\Finance\Expense_Log.txt"
type nul > "%ROOT%\Finance\Fund_Report.txt"


echo Creating communication system...

type nul > "%ROOT%\Communications\Message_Log.txt"
type nul > "%ROOT%\Communications\Email_Log.txt"


echo Creating reports...

type nul > "%ROOT%\Reports\Daily_Report.txt"
type nul > "%ROOT%\Reports\Monthly_Report.txt"


echo Creating backup system...

(
echo @echo off
echo xcopy "%ROOT%" "%ROOT%_BACKUP" /E /I /Y
echo echo Backup Complete
echo pause
) > "%ROOT%\backup.bat"


echo Creating transfer system...

(
echo @echo off
echo echo Traveling Star Service Transfer Module
echo echo Ready for MacBook/HP synchronization
echo pause
) > "%ROOT%\transfer.bat"


echo Logging installation...

echo %date% %time% - Full system build completed >> "%ROOT%\Logs\System_Log.txt"


echo.
echo ==========================================
echo BUILD COMPLETE
echo ==========================================
echo.

tree "%ROOT%" /F

pause