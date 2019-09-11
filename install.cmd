IF EXIST N:\em\work1\Pahmeyer\Node SET PATH=%PATH%;N:\em\work1\Pahmeyer\Node
call npm install
if NOT ["%errorlevel%"]==["0"] pause
