IF EXIST N:\em\work1\Pahmeyer\Node SET PATH=%PATH%;N:\em\work1\Pahmeyer\Node
call npm run create
call npm run excel
%SystemRoot%\explorer.exe "%~dp0output"
if NOT ["%errorlevel%"]==["0"] pause
