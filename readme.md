# SustainBeef Report Generator

## Installation
1. (Only after first download) Double click `install.cmd`
2. Make sure that you have the SustainBeef outputfiles included in the exp_starter.gms
3. In order to create the outputs, double click `prepare.cmd`
4. Start the Live Server by clicking `run.cmd`

## Running with FarmDyn

1) In line the `exp_starter.gms` file, paste the following after line `388`:
```gams
$batinclude 'exploiter/gen_sustainbeef.gms' "'base'" "'%exploiterDim2%'"
```


2) At the very end of the `exp_starter.gms` file, copy and adjust the following code:

```gams
execute 'cd C:\path\to\sb-report && node main.js %Resdir%\path\to\SustainBeef\results\%scenDes%.gdx path\where\html\should\be\saved';
```

here's an example of a final code snippet:

```gams
execute 'C: && cd C:\Users\pahmeyer\Documents\sb-report && node main.js %Resdir%\SustainBeef\%scenDes%.gdx C:\Users\pahmeyer\Documents\SustainBeef\results';
```

the additional `C: && ` is required when the FarmDyn checkout is not on the C-Drive (e.g. if the checkout is on `N:`)


3) Make sure the FarmDyn `Results` folder has a `SustainBeef` subfolder. If it does not, create it first. 

4) If you run FarmDyn from the user interface, check the `include social accounting` checkbox in the `Environmental impacts and restrictions` tab. If you run the model from a batch file, paste the following line into the batch file before the `execute gamsrun`:

```
Include social accounting = true
```
 
