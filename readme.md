# SustainBeef Report Generator

## Installation
1. (Only after first download) Double click `install.cmd`
2. Make sure that you have the SustainBeef outputfiles included in the exp_starter.gms
3. In order to create the outputs, double click `prepare.cmd`
4. Start the Live Server by clicking `run.cmd`

## Running with FarmDyn

At the very end of the `exp_starter.gms` file, copy and adjust the following code:

```gams
execute 'cd C:\USERS\%USERPROFILE%\Documents\sb-report && node main.js %Resdir%\SustainBeef\%scenDes%.gdx %Resdir%\SustainBeef';
```

Make sure the FarmDyn `Results` has a `SustainBeef` subfolder. If it does not, first create it. 
