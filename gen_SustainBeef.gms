********************************************************************************
*
* --- Auxiliary parameters and sets
*
********************************************************************************

* set combining all bought synthetic fertilizers including lime
set syntfert(inputs)
/AHL
 ASS
 PK_18_10
 KAS
 KaliMag
 Lime
/;

*set combining all bought phytosanitary measures
set phytosani(inputs)
/Herb
 Fung
 Insect
 growthContr
 water
/;

*set combinig all beef outputs
set beefout(prods)
/OldCow
 set.allBeef_outputs
/;

*set with different work types
set workThingies
/management
 field
 fertMin
 fertMan
 animalWork
 animalExtraWork
 stableWork
 leisure
/;

*Set used to allocate worktypes to branches
set superBranch
/animals
 cashCrops
 manage
 leisure
/;
parameter
*storage parameters
  p_ProfitFct(*,*,*)
  p_sumHerd(*,*,*,*)
  p_sumFeed(*,*,*,*,*)
  p_crop(*,*,*,*)
  p_envi(*,*,*,*)
  p_soci(*,*,*,*)
  p_econ(*,*,*,*,*,*)
  p_other(*,*,*,*,*)

*auxiliary parameters
  p_build(*,*)
  p_labour(*,*,*,*)
;


*Extra construct for variable costs of stables and other infrastructure sind the stored parameter seems crooked

  p_build(t,nCur) = sum( (stables,hor) $ v_stableInv.up(stables,hor,t,nCur),
                     v_stableInv.l(stables,hor,t,nCur) * p_priceStables(stables,hor,t-1)
                        * (  0.01 $ sameas(hor,"long")
                           + 0.02 $ sameas(hor,"middle")
                           + 0.03 $ sameas(hor,"short") ) )

              +    sum( curBuildings(buildings)
                   $ (     sum(t_n(t1,nCur1) $ isNodeBefore(nCur,nCur1), v_buyBuildings.up(buildings,t1,nCur1))
                       or  sum(tOld, p_iniBuildings(buildings,tOld))),
                   v_buildingsInv.l(buildings,t,nCur) * p_varCostBuild(buildings,t));

* --- Extra construct for work related indicator as the existing structure seems crooked and does not meet the need of the project

*General management (assume even distribution of hours over ther year)
   p_labour("manage","management",tCur,m) = sum(t_n(tCur,nCur), v_hasFarm.l(tCur,nCur) * p_labManag("Farm","const") * p_probN(nCur) / card(m));

*branch specific management
   p_labour("cashcrops","management",tCur,m) = sum(t_n(tCur,nCur),(v_hasBranch.l("cashcrops",tCur,nCur)  * p_labManag("cashcrops","const") + v_branchSize.l("cashcrops",tCur,nCur) * p_labManag("cashcrops","slope"))*p_probN(nCur) / card(m));

   p_labour("animals","management",tCur,m) = sum((t_n(tCur,nCur),branches) $ (sum(branches_to_acts(branches,acts), 1)$(not sameas(branches,"cashcrops") or sameas(branches,"biogas"))),
                                                                (v_hasBranch.l(branches,tCur,nCur)  * p_labManag(branches,"const") + v_branchSize.l(branches,tCur,nCur) * p_labManag(branches,"slope"))* p_probN(nCur) / card(m) );

*Labour for on field activities
   p_labour("cashCrops","field",tCur,m)
                               = sum( (t_n(tCur,nCur),c_s_t_i(curCrops(crops),plot,till,intens)),
                                          v_cropHa.l(crops,plot,till,intens,tCur,nCur) * p_cropLab(crops,till,intens,m) * p_probN(nCur));
*Labour for application of synthetic fertilizer
   p_labour("cashCrops","fertmin",tCur,m) =
                                 sum((t_n(tCur,nCur),c_s_t_i(curCrops(crops),plot,till,intens),manApplicType_manType(ManApplicType,curManType))
                                           $ ((v_cropHa.up(crops,plot,till,intens,tCur,nCur) ne 0)
                                           $ ( v_manDist.up(crops,plot,till,intens,ManApplicType,curManType,tCur,nCur,m) ne 0)),
                                           v_manDist.l(crops,plot,till,intens,ManApplicType,curManType,tCur,nCur,m) * p_manDistLab(ManApplicType) * p_probN(nCur));
*Labour for manure applications
   p_labour("cashCrops","fertman",tCur,m) =
                                 sum((t_n(tCur,nCur),c_s_t_i(crops,plot,till,intens),syntFertilizer),
                                       v_syntDist.l(crops,plot,till,intens,syntFertilizer,tCur,nCur,m) * p_syntDistLab(syntFertilizer) * p_probN(nCur));

* labour for animal activities, expressed per animal and month of standing herd
   p_labour("animals","animalWork",tCur,m) =
                                 sum( (t_n(tCur,nCur),actHerds(sumHerds,breeds,feedRegime,tCur,m1)) $ m_to_herdm(m,m1),
                                     v_herdSize.l(sumHerds,breeds,feedRegime,tCur,nCur,m1) * p_herdLab(sumHerds,feedRegime,m) * p_probN(nCur));

* labour for animal activities, per starting animal (hours for giving birth and similar)
   p_labour("animals","animalExtraWork",tCur,m) =
                                 sum( (t_n(tCur,nCur),sumHerds,breeds,m1) $ (sum(feedRegime, actHerds(sumHerds,breeds,feedRegime,tCur,m1)) $ m_to_herdm(m,m1)),
                                     v_herdStart.l(sumHerds,breeds,tCur,nCur,m1)* p_herdLabStart(sumHerds,m) * p_probN(nCur));

* fixed amount of hours for stables (maintenance, cleansing), captures also labour saving effects of large stables
   p_labour("animals","stableWork",tCur,m) =
                                 sum( (t_n(tCur,nCur),stables) $ v_stableInv.up(stables,"long",tCur,nCur),
                                       v_stableShareCost.l(stables,tCur,nCur) * p_stableLab(stables,m) * p_probN(nCur) );


********************************************************************************
*
* --- Profit table
*
********************************************************************************
* Profit
  p_ProfitFct("%scenDes%","Profit(Euro)","") = p_res("Base","red0","profit","sum","","mean");
*Income
  p_ProfitFct("%scenDes%","Revenues","") = p_res("Base","red0","SalesRevenue","sum","","mean")  +  p_res("Base","red0","sfPrem","sum","","mean") + p_res("Base","red0","intGain","sum","","mean");
  p_ProfitFct("%scenDes%","SalesRevenues","") = p_res("Base","red0","SalesRevenue","sum","","mean");
  p_ProfitFct("%scenDes%","RevenuesAnimals","") = sum(allBeef_outputs, p_res("Base","red0",allBeef_outputs,"SReve","","mean")) + p_res("Base","red0","milk","SReve","","mean")
                                                    + p_res("Base","red0","oldCow","SReve","","mean") + sum(calv_prods, p_res("Base","red0",calv_prods,"SReve","","mean"));
  p_ProfitFct("%scenDes%","RevenuesBeef","") = sum(allBeef_outputs, p_res("Base","red0",allBeef_outputs,"SReve","","mean")) + p_res("Base","red0","oldCow","SReve","","mean");
  p_ProfitFct("%scenDes%","RevenuesByBeef",beefout) = p_res("Base","red0",beefout,"SReve","","mean");
  p_ProfitFct("%scenDes%","RevenuesMilk","") = p_res("Base","red0","milk","SReve","","mean");
  p_ProfitFct("%scenDes%","RevenuesCalves",calv_prods) = p_res("Base","red0",calv_prods,"SReve","","mean");
  p_ProfitFct("%scenDes%","sumCropSales","") = sum(cropProds, p_res("Base","red0",cropProds,"SReve","","mean"));
  p_ProfitFct("%scenDes%","CropSales",cropProds) = p_res("Base","red0",cropProds,"SReve","","mean");
* sum of premiums and subsidies
  p_ProfitFct("%scenDes%","SumSubsidies","") = p_res("Base","red0","sfPrem","sum","","mean");
  p_ProfitFct("%scenDes%","directPay","") = p_res("Base","red0","dirPaym","sum","","mean");
  p_ProfitFct("%scenDes%","coupledSupport","") = p_res("Base","red0","coupSup","sum","","mean");
* itnerest gained
  p_ProfitFct("%scenDes%","InterestGained","") = p_res("Base","red0","intGain","sum","","mean");

* --- Costs

* sum variable costs
  p_ProfitFct("%scenDes%","sumVarCost","") = p_res("Base","red0","sumVarCost","sum","","mean");
  p_ProfitFct("%scenDes%","sumBuyCost","") = sum(curInputs, p_res("Base","red0",curInputs,"sum","","mean"));
  p_ProfitFct("%scenDes%","sumFeedBuyCost","") = p_res("Base","red0","feedBuyCost","sum","","mean");
  p_ProfitFct("%scenDes%","fertBuyCost","") =sum(syntfert, p_res("Base","red0",syntfert,"sum","","mean"));
  p_ProfitFct("%scenDes%","phytobuyCost","") =sum(phytosani, p_res("Base","red0",phytosani,"sum","","mean"));
  p_ProfitFct("%scenDes%","BuyCost",curInputs) = p_res("Base","red0",curInputs,"sum","","mean");
  p_ProfitFct("%scenDes%","buildVarCost","") = sum((t_n(tCur,nCur)), p_probn(nCur) *  p_build(tCur,nCur));
  p_ProfitFct("%scenDes%","machVarCost","") = p_res("Base","red0","machCost","sum","","mean");
  p_ProfitFct("%scenDes%","manVarCost","") = p_res("Base","red0","manCost","sum","","mean");
  p_ProfitFct("%scenDes%","otherVarCost","") = p_res("Base","red0","vcostsActivity","sum","","mean");
* depreciation
  p_ProfitFct("%scenDes%","depreciation","") =  p_res("Base","red0","depr","sum","","mean");
* itnerest paid
  p_ProfitFct("%scenDes%","InterestPaid","") = p_res("Base","red0","intPaid","sum","","mean");

********************************************************************************
*
* --- Herds table
*
********************************************************************************
$$ifthen.dairy %cowherd% == true
    p_sumHerd("%scenDes%","dairyCows",breeds,"No")                  = p_res(%1,%2,"sumHerdCows","Quant",Breeds,"mean");
    p_sumHerd("%scenDes%","heifers",breeds,"No")                    = p_res(%1,%2,"sumHerdheifs","Quant",Breeds,"mean");
    p_sumHerd("%scenDes%","remonteDairy","%basBreed%","No")         = p_res(%1,%2,"sumHerdremonte","Quant","%basBreed%","mean");
    p_sumHerd("%scenDes%","femCalvesRaised",breeds,"No")            = p_res(%1,%2,"sumHerdfCalvsRais","Quant",Breeds,"mean");
    p_sumHerd("%scenDes%","sucklerCows",breeds,"No")                = p_res(%1,%2,"sumHerdMothercows","Quant",Breeds,"mean");
    p_sumHerd("%scenDes%","remonteSuckler","%motherCowBreed%","No") = p_res(%1,%2,"sumHerdremonte","Quant","%motherCowBreed%","mean");
    p_sumHerd("%scenDes%","maleCalvsRaised",breeds,"No")            = p_res(%1,%2,"sumHerdmCalvsRais","Quant",Breeds,"mean");

    p_sumHerd("%scenDes%","femCalvesSold",breeds,"No") = p_res(%1,%2,"sumHerdfCalvsSold","Quant",Breeds,"mean");
    p_sumHerd("%scenDes%","malCalevsSold",breeds,"No") = p_res(%1,%2,"sumHerdmCalvsSold","Quant",Breeds,"mean");
    p_sumHerd("%scenDes%","heifersSold",breeds,"No") = p_res(%1,%2,"sumHerdheifsSold","Quant",Breeds,"mean");
    p_sumHerd("%scenDes%","oldCows","","No") = p_res(%1,%2,"sumHerdoldcow","Quant","","mean");
$$endif.dairy
$$iftheni.beef "%farmBranchBeef%"=="on"
    p_sumHerd("%scenDes%","bullsKept",breeds,"No") = p_res(%1,%2,"sumHerdBulls","Quant",Breeds,"mean");
    p_sumHerd("%scenDes%","bullsSold",breeds,"No") = p_res(%1,%2,"sumHerdBullsSold","Quant",Breeds,"mean");
$$endif.beef
    p_sumHerd("%scenDes%","sumLU","","LU") = p_res(%1,%2,"LUtot","Quant","","mean");
    p_sumHerd("%scenDes%","LUperHa","","LU") = p_res(%1,%2,"LUperha","Quant","","mean");
    p_sumHerd("%scenDes%",possherds,"","LU") = p_res(%1,%2,"LUperherd","Quant",possherds,"mean");



********************************************************************************
*
* --- Cropping
*
********************************************************************************

    p_crop("%scenDes%","cropHA",curCrops,"")            = p_res("Base","red0",curCrops,"levl","","mean");
    p_crop("%scenDes%","cropYield",curCrops,"")         = p_res("Base","red0",curCrops,"yield","","mean");
    p_crop("%scenDes%","cropYieldProd",curCrops,Prods)  = p_res("Base","red0",curCrops,"YieldProd",Prods,"mean");
    p_crop("%scenDes%","cropProduction",curCrops,Prods) = p_res("Base","red0",curCrops,"Production",Prods,"mean");
    p_crop("%scenDes%","NmanAplHa",curCrops,"N")        = p_res("Base","red0",curCrops,"NmanAplHa","","mean");
    p_crop("%scenDes%","PmanAplHa",curCrops,"P")         = p_res("Base","red0",curCrops,"PmanAplHa","","mean");
    p_crop("%scenDes%","NGrazHa",curCrops,"N")          = p_res("Base","red0",curCrops,"NGrazHa","","mean");
    p_crop("%scenDes%","PGrazHa",curCrops,"P")          = p_res("Base","red0",curCrops,"PGrazHa","","mean");
    p_crop("%scenDes%","NMinappl",curCrops,"N")         = p_res("Base","red0",curCrops,"NMin","","mean");
    p_crop("%scenDes%","PMinappl",curCrops,"P")          = p_res("Base","red0",curCrops,"PMin","","mean");


********************************************************************************
*
* --- Environmental Indicators
*
********************************************************************************

*LCA
   p_envi("%scenDes%","GWP","total","")    = p_res("Base","red0","totGWP","Quant","","mean");
   p_envi("%scenDes%","PMFP","total","")   = p_res("Base","red0","totPMFP","Quant","","mean");
   p_envi("%scenDes%","TAP","total","")    = p_res("Base","red0","totTAP","Quant","","mean");
   p_envi("%scenDes%","FEP","total","")    = p_res("Base","red0","totFEP","Quant","","mean");
   p_envi("%scenDes%","MEP","total","")    = p_res("Base","red0","totMEP","Quant","","mean");
   p_envi("%scenDes%","detail",emCat,source)     = sum(tCur, sum((curChain,t_n(tCur,nCur)), p_probn(nCur) *   v_emissionsCat.l(curChain,source,emCat,tCur,ncur) ) )/ p_cardtCur;
*field balances
   p_envi("%scenDes%","humC","total","")   = p_res("Base","red0","CarbBal","Quant","","mean");
   p_envi("%scenDes%","lossP","total","")  = p_res("Base","red0","lossP","Quant","","mean");
   p_envi("%scenDes%","leachN","total","") = p_res("Base","red0","leachN","Quant","","mean");

********************************************************************************
*
* --- Social Indicators
*
********************************************************************************

*Calorie

   p_soci("%scenDes%","totCalProd","","Calorie")          = p_res("Base","red0","CalProd","Quant","","mean");
   p_soci("%scenDes%","CalProdAnim","","Calorie")         = p_res("Base","red0","CalProdAni","Quant","","mean");
   p_soci("%scenDes%","totCalHa","","Calorie")            = p_res("Base","red0","CalHa","Quant","","mean");
   p_soci("%scenDes%","CalFeed","","Calorie")             = p_res("Base","red0","CalFeed","Quant","","mean");
   p_soci("%scenDes%","CalFeedPlant+Input","","Calorie")  = p_res("Base","red0","CalVeg","Quant","","mean");
   p_soci("%scenDes%","CalProdperFeed","","Calorie")      = p_res("Base","red0","CalEffi","Quant","","mean");


*Protein

   p_soci("%scenDes%","totProtProd","","Calorie")         = p_res("Base","red0","ProtProd","Quant","","mean");
   p_soci("%scenDes%","ProtProdAnim","","Calorie")        = p_res("Base","red0","ProtProdAni","Quant","","mean");
   p_soci("%scenDes%","totProtHa","","Calorie")           = p_res("Base","red0","ProtHa","Quant","","mean");
   p_soci("%scenDes%","ProtFeed","","Calorie")            = p_res("Base","red0","ProtFeed","Quant","","mean");
   p_soci("%scenDes%","ProtFeedPlant+Input","","Calorie") = p_res("Base","red0","ProtVeg","Quant","","mean");
   p_soci("%scenDes%","ProtProdperFeed","","Calorie")     = p_res("Base","red0","ProtEffi","Quant","","mean");


*Work

   p_soci("%scenDes%","totWork","","sum")               = sum((superBranch,workThingies,tCur,m), p_labour(superBranch,workThingies,tCur,m))/p_cardTCur;;
   p_soci("%scenDes%","totAnimals","","sum")            = sum((workThingies,tCur,m)$(not sameas(workThingies,"management")), p_labour("animals",workThingies,tCur,m))/p_cardTCur;
   p_soci("%scenDes%","totCashCrops","","sum")          = sum((workThingies,tCur,m)$(not sameas(workThingies,"management")), p_labour("cashcrops",workThingies,tCur,m))/p_cardTCur;
   p_soci("%scenDes%","totManage","","sum")             = sum((superBranch,tCur,m), p_labour(superBranch,"management",tCur,m));
   p_soci("%scenDes%",superBranch,workThingies,m)    = sum(tCur, p_labour(superBranch,workThingies,tCur,m) )/p_cardTCur;
   p_soci("%scenDes%","leisure","","")               = p_res("Base","red0","leisure","hours","","mean") ;






********************************************************************************
*
* --- Economic Indicators
*
********************************************************************************
*contribution margin
*   p_econ("%scenDes%","CMCrops",crops,t,cmRows,cmCols)  = p_resCMCrops(crops,t,cmRows,cmCols);
*   p_econ("%scenDes%","CMCattle",herds,t,cmRows,cmCols) = p_resCMCattle(herds,t,cmRows,cmCols);

*Autonomy I Share of subsidies on overall income
   p_econ("%scenDes%","Autonomy","shareprem","","","") = p_ProfitFct("%scenDes%","Profit(Euro)","") / p_ProfitFct("%scenDes%","Revenues","");
*Autonomy II Share of inputs on variable costs
   p_econ("%scenDes%","Autonomy","shareInput","","","") =  p_ProfitFct("%scenDes%","sumBuyCost","") / p_ProfitFct("%scenDes%","sumVarCost","");


********************************************************************************
*
* --- Other
*
********************************************************************************

  p_other("%scenDes%","outputQuantYear",prodsYearly,"","") = p_res("Base","red0",prodsYearly,"OQuant","","mean") + p_res("Base","red0",prodsYearly,"OQuantResi","","mean");
  p_other("%scenDes%","outputPasture",prodsMonthly,"","")  = p_res("Base","red0",prodsMonthly,"OQuantPast","","mean");
  p_other("%scenDes%","outputQuantTotal",prods,"","")      = p_other("%scenDes%","outputQuantYear",prods,"","") + p_other("%scenDes%","outputPasture",prods,"","");
  p_other("%scenDes%","SoldOutputQuant",prods,"","")       = p_res("Base","red0",prods,"SQuant","","mean");
  p_other("%scenDes%","prodsPrice",prods,"","")            = p_res("Base","red0",prods,"Price","","mean");
  p_other("%scenDes%","prodsRevenue",prods,"","")          = p_res("Base","red0",prods,"SReve","","mean");
  p_other("%scenDes%","boughtFeed",feeds,"","")   = p_res("Base","red0",feeds,"quant","","mean") $sum(t_n(tCur,nCur), v_feedusebuy.l(feeds,tCur,nCur));
  p_other("%scenDes%","inputQuant",inputs,"","")  = p_res("Base","red0",Inputs,"quant","","mean");
  p_other("%scenDes%",feeds,herds,"Feed",m) = Sum(tCur, sum((curbreeds,feedregime,reqsphase,t_n(tCur,nCur)), v_feeding.l(herds,curbreeds,feedregime,reqsPhase,m,feeds,tCur,nCur) *p_probN(nCur)))/p_cardTCur;

* --- Yearly verage feedning per animal in kg DM per day
 $$ifthen.dairy %cowherd% == true
*  p_other("%scenDes%",cattle,feedRegime,reqsPhase,feeds) =   p_dailyFeedDMRes(cattle,feedRegime,reqsPhase,feeds);
 $$endif.dairy


execute_unload "../results/SustainBeef/%scenDes%.gdx" , p_ProfitFct, p_sumHerd, p_crop, p_envi, p_soci, p_econ, p_other;
