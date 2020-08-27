IF EXIST N:\em\work1\Pahmeyer\Node SET PATH=%PATH%;N:\em\work1\Pahmeyer\Node;N:\em\work1\Pahmeyer\FarmDyn\FarmDynDoku\bin\Scripts
call npm run create
call npm run excel
call npm run word
%SystemRoot%\explorer.exe "%~dp0output"
if NOT ["%errorlevel%"]==["0"] pause
