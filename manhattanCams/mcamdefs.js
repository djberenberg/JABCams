/*eslint no-unused-vars: "off"*/
/*    Cross St                  Title                  php#   CCTV# */
/*    =========  ===================================  ======  ===== */
  const text_ave1 = "[ Willis Ave Bridge ]\n\u2191\n1 Ave\n\u2191\nAllen St\n||\nPike St\n||\n[ Manhattan Bridge] ";
  const ave1 = [       /* Allen St, Pike St */
    [ "South"  , "South St @ Pike St"               ,  "438",  "328" ],
    [ "Canal"  , "Canal St @ Allen St"              ,  "435",  "325" ],
    [ "Delancey","Allen St @ Delancey St"           , "1196", "1090" ],
    [ "Delancey","Allen St @ Delancey St"           , "1117",  "994" ],
    [ "Houston", "1 Ave @ Houston St"               , "1014",  "901" ],
    [ "14"     , "1 Ave @ 14 St"                    ,  "789",  "696" ],
    [ "14"     , "1 Ave @ 14 St"                    , "1189", "1083" ],
    [ "42"     , "1 Ave @ 42 St"                    ,  "550",  "490" ],
    [ "57"     , "1 Ave @ 57 St-QBB"                ,  "176",   "15" ],
    [ "59"     , "1 Ave @ 59 St"                    , "1308", "1198" ],
    [ "62"     , "1 Ave @ 62 St"                    ,  "940",  "827" ],
    [ "86"     , "1 Ave @ 86 St"                    ,  "370",  "263" ],
    [ "96"     , "1 Ave @ 96 St"                    ,  "537",  "644" ],
    [ "110"    , "1 Ave @ 110 St"                   ,  "368",  "261" ],
    [ "124"    , "1 Ave @ 124 St"                   ,  "360",  "254" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=438,435,1196,1117,1014,789,1189,550,176,1308,940,370,537,368,360
*/

  const text_ave2 = "2 Ave\n\u2193\nChrystie St";
  const ave2 = [       /* Chrystie St */
    [ "Canal"  , "Canal St @ Chrystie St"           ,  "434",  "324" ],
    [ "Houston", "Houston St @ Chrystie St"         ,  "721",  "670" ],
    [ "14"     , "2 Ave @ 14 St"                    ,  "846",  "740" ],
    [ "23"     , "2 Ave @ 23 St"                    ,  "794",  "669" ],
    [ "36"     , "2 Ave @ 36 St-Midtown Tunnel"     ,  "165",    "4" ],
    [ "42"     , "2 Ave @ 42 St"                    ,  "551",  "491" ],
    [ "49"     , "2 Ave @ 49 St"                    ,  "366",  "258" ],
    [ "58"     , "2 Ave @ 58 St"                    ,  "472",  "400" ],
    [ "59"     , "2 Ave @ 59 St-QBB"                ,  "164",    "3" ],
    [ "72"     , "2 Ave @ 72 St"                    ,  "539",  "480" ],
    [ "74"     , "2 Ave @ 74 St"                    ,  "934",  "822" ],
    [ "125"    , "2 Ave @ 125 St-Harlem R Lift Span",  "247",  "102" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=434,721,846,794,165,551,366,472,164,539,934,247
*/

  const text_ave3 = "[ 3rd Ave Bridge ]\n\u2193\n3 Ave\n\u2191\nThe Bowery";
  const ave3 = [       /* The Bowery */
    [ "Worth"  , "Worth St @ Bowery"                ,  "433",  "323" ],
    [ "Canal"  , "Canal St @ Bowery-MHB"            ,  "459",  "371" ],
    [ "Grand"  , "Grand St @ Bowery"                ,  "838",  "734" ],
    [ "4"      , "Bowery @ Cooper Sq &amp; 4 St"    , "1085",  "963" ],
    [ "14"     , "3 Ave @ 14 St"                    , "1190", "1084" ],
    [ "14"     , "3 Ave @ 14 St"                    ,  "845",  "739" ],
    [ "23"     , "3 Ave @ 23 St"                    ,  "495",  "430" ],
    [ "34"     , "3 Ave @ 34 St"                    ,  "403",  "431" ],
    [ "42"     , "3 Ave @ 42 St"                    ,  "398",  "290" ],
    [ "49"     , "3 Ave @ 49 St"                    ,  "410",  "429" ],
    [ "57"     , "3 Ave @ 57 St"                    ,  "399",  "429" ],
    [ "86"     , "3 Ave @ 86 St"                    , "1226", "1119" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=433,459,838,1085,1190,845,495,403,398,410,399,1226
*/

  const text_aveLex = "Lexington Ave\n\u2193\n[ Gramercy Park ]\n||\nIrving Pl";
  const aveLex = [     /* Irving Pl */
    [ "14"     , "14 St @ Irving Pl/Lexington Av"   , "1116",  "993" ],
    [ "14"     , "Irving Pl @ 14 St"                , "1191", "1085" ],
    [ "23"     , "Lexington Ave @ 23 St"            ,  "541",  "483" ],
    [ "34"     , "Lexington Ave @ 34 St"            ,  "542",  "482" ],
    [ "42"     , "Lexington Ave @ 42 St"            ,  "413",  "303" ],
    [ "57"     , "Lexington Ave @ 57 St"            ,  "404",  "294" ],
    [ "72"     , "Lexington Ave @ 72 St"            ,  "540",  "181" ],
    [ "96"     , "Lexington Ave @ 96 St"            , "1304", "1199" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=1116,1191,541,542,413,404,540,1304
*/

  const text_avePark = "Park Ave\n||\n[ Union Sq ]\n\u2191\n4 Ave";
  const avePark = [
    [ "14"     , "Union Sq @ 14 St"                 ,  "535",  "474" ], 
    [ "23"     , "Park Ave @ 23 St"                 ,  "531",  "473" ],
    [ "34"     , "Park Ave @ 34 St"                 ,  "419",  "309" ],
    [ "57"     , "Park Ave @ 57 St"                 ,  "552",  "492" ],
    [ "72"     , "Park Ave @ 72 St"                 ,  "909",  "797" ],
    [ "96"     , "Park Ave @ 96 St"                 ,  "910",  "798" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=535,531,419,552,909,910
*/

  const text_aveMad = "[ Madison Ave Bridge ]\n\u2191\n[ Madison Sq Park ]\n\u2191\nMadison Ave";
  const aveMad = [
    [ "34"     , "Madison Ave @ 34 St"              ,  "406",  "296" ],
    [ "42"     , "Madison Ave @ 42 St"              ,  "522",  "467" ],
    [ "46"     , "Madison Ave @ 46 St"              , "1087",  "965" ],
    [ "49"     , "Madison Ave @ 49 St"              ,  "528",  "470" ],
    [ "57"     , "Madison Ave @ 57 St"              ,  "407",  "297" ],
    [ "96"     , "Madison Ave @ 96 St"              ,  "536",  "475" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=406,522,1087,528,407,536
*/

  const text_ave5 = "5 Ave\n\u2193\n[ Washington Sq Park ]";
  const ave5 = [
    [ "23"     , "5 Ave @ 23 St"                    ,  "168",    "7" ],
    [ "34"     , "5 Ave @ 34 St"                    ,  "415",  "305" ],
    [ "42"     , "5 Ave @ 42 St"                    ,  "523",  "466" ],
    [ "46"     , "5 Ave @ 46 St"                    , "1088",  "966" ],
    [ "47"     , "5 Ave @ 47 St"                    , "1086",  "964" ],
    [ "49"     , "5 Ave @ 49 St"                    ,  "169",    "8" ],
    [ "57"     , "5 Ave @ 57 St"                    ,  "409",  "299" ],
    [ "59"     , "5 Ave @ 59 St"                    , "1184",  "183" ],
    [ "65"     , "5 Ave @ 65 St"                    ,  "906",  "794" ],
    [ "66"     , "5 Ave @ 66 St"                    ,  "907",  "795" ],
    [ "72"     , "5 Ave @ 72 St"                    ,  "408",  "298" ],
    [ "84"     , "5 Ave @ 84 St"                    , "1158", "1029" ],
    [ "86"     , "5 Ave @ 86 St"                    , "1159", "1030" ],
    [ "96"     , "5 Ave @ 96 St"                    ,  "908",  "796" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=168,415,523,1088,1086,169,409,1184,906,907,408,1158,1159,908
*/

  const text_ave6 = "Lenox Ave/Malcolm X Blvd\n||\n[ Central Park ]\n\u2191\n6 Ave\n\u2191\nChurch St\n\u2191\nTrinity Pl\n\u2191\nGreenwich St\n\u2191\n[ The Battery ]";
  const ave6 = [       /* Lenox Ave, Malcolm X Blvd */
    [ "Houston", "6 Ave @ Houston St"               ,  "717",  "666" ],
    [ "14"     , "6 Ave @ 14 St"                    ,  "509",  "446" ],
    [ "23"     , "6 Ave @ 23 St"                    ,  "511",  "448" ],
    [ "34"     , "6 Ave @ 34 St"                    ,  "170",    "9" ],
    [ "42"     , "6 Ave @ 42 St"                    ,  "173",   "12" ],
    [ "49"     , "6 Ave @ 49 St"                    ,  "171",   "10" ],
    [ "57"     , "6 Ave @ 57 St"                    ,  "414",  "304" ],
    [ "58"     , "6 Ave @ 58 St"                    ,  "473",  "401" ],
    [ "110"    , "Malcolm X Blvd/Lenox Ave @ 110 St", "1038",  "924" ],
    [ "125"    , "Lenox Ave @ 125 St"               ,  "530",  "472" ],
    [ "135"    , "Lenox Ave @ 135 St"               ,  "521",  "450" ],
    [ "145"    , "Malcolm X Blvd @ 145 St"          ,  "932",  "821" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=717,509,511,170,173,171,414,473,1038,530,521,932
*/

  const text_ave7 = "[ Macombs Dam Bridge ]\n||\nAdam Clayton Powell Jr Blvd\n||\n[ Central Park ]\n\u2193\n7 Ave\n\u2193\nVarick St";
  const ave7 = [       /* ACPowell Blvd */
    [ "Houston", "Houston @ Varick St"              ,  "725",  "674" ],
    [ "23"     , "7 Ave @ 23 St"                    ,  "510",  "447" ],
    [ "34"     , "7 Ave @ 34 St"                    ,  "501",  "440" ],
    [ "43"     , "7 Ave @ 43 St"                    ,  "891",  "782" ],
    [ "49"     , "7 Ave @ 49 St"                    ,  "416",  "439" ],
    [ "54"     , "7 Ave @ 54 St"                    , "1090",  "968" ],
    [ "57"     , "7 Ave @ 57 St"                    ,  "504",  "444" ],
    [ "110"    , "Adam C. Powell Blvd @ 110 St"     , "1037",  "923" ],
    [ "145"    , "7 Ave @ 145 St"                   ,  "529",  "471" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=725,510,501,891,416,1090,504,1037,529
*/

  const text_ave8 = "Frederick Douglass Blvd\n||\nCentral Park West\n\u2191\n8 Ave\n\u2191\nHudson St";
  const ave8 = [       /* Central Park West, FDouglass Blvd */
    [ "14"     , "8 Ave @ 14 St"                    ,  "503",  "443" ],
    [ "34"     , "8 Ave @ 23 St"                    ,  "500",  "441" ],
    [ "42"     , "8 Ave @ 34 St"                    ,  "180",   "19" ],
    [ "42"     , "8 Ave @ 42 St"                    ,  "181",   "20" ],
    [ "49"     , "8 Ave @ 49 St"                    ,  "420",  "437" ],
    [ "57"     , "8 Ave @ 57 St"                    , "1183",  "266" ],
    [ "Columbus Cr", "8 Ave @ Columbus Cr"          ,  "179",   "18" ],
    [ "65"     , "CPW @ 65 St"                      ,  "966",  "853" ],
    [ "66"     , "CPW @ 66 St"                      ,  "964",  "851" ],
    [ "72"     , "CPW @ 72 St"                      ,  "967",  "854" ],
    [ "77"     , "CPW @ 77 St"                      ,  "968",  "855" ],
    [ "81"     , "CPW @ 81 St"                      ,  "969",  "856" ],
    [ "86"     , "CPW @ 86 St"                      ,  "970",  "857" ],
    [ "96"     , "CPW @ 96 St"                      ,  "524",  "464" ],
    [ "96"     , "CPW @ 96 St"                      ,  "971",  "858" ],
    [ "100"    , "CPW @ 100 St"                     ,  "965",  "852" ],
    [ "110"    , "CPW @ 110 St"                     , "1167", "1038" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=503,500,180,181,420,1183,179,966,964,967,968,969,970,524,971,965,1167
*/

  const text_aveStNick = "St Nicholas Ave\n||\n[ Central Park ]";
  const aveStNick = [
    [ "125"    , "St Nicholas Ave @ 125 St"         ,  "740",  "688" ],
    [ "145"    , "St Nicholas Ave @ 145 St"         ,  "532",  "476" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=740,532
*/

  const text_ave9 = "Columbus Ave\n\u2193\n9 Ave";
  const ave9 = [       /* Columbus Ave */
    [ "23"     , "9 Ave @ 23 St"                    ,  "229",  "355" ],
    [ "30"     , "9 Ave @ 30 St"                    ,  "359",  "354" ],
    [ "34"     , "9 Ave @ 34 St"                    ,  "178",  "352" ],
    [ "37"     , "9 Ave @ 37 St"                    ,  "507",  "353" ],
    [ "42"     , "9 Ave @ 42 St"                    ,  "506",  "351" ],
    [ "49"     , "9 Ave @ 49 St"                    ,  "502",  "350" ],
    [ "57"     , "9 Ave @ 57 St"                    ,  "508",  "349" ],
    [ "65"     , "Columbus Ave @ 65 St"             ,  "505",  "445" ],
    [ "207"    , "207 St @ 9 Ave"                   ,  "328",  "203" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=229,359,178,507,506,502,508,505,328
*/

  const text_ave10 = "Amsterdam Ave\n\u2191\n10 Ave\n\u2191\n[ Pier 51 ]";
  const ave10 = [      /* Amsterdam Ave */
    [ "42"     , "10 Ave @ 42 St"                   , "1028",  "914" ],
    [ "57"     , "10 Ave @ 57 St"                   ,  "828",  "722" ],
    [ "60"     , "Amsterdam Ave @ 60 St"            ,  "514",  "455" ],
    [ "72"     , "Amsterdam Ave @ 72 St"            ,  "526",  "468" ],
    [ "86"     , "Amsterdam Ave @ 86 St"            ,  "527",  "469" ],
    [ "125"    , "Amsterdam Ave @ 125 St"           ,  "741",  "689" ],
    [ "178"    , "Amsterdam Ave @ 178 St"           ,  "248",  "112" ],
    [ "181"    , "Amsterdam Ave @ 181 St"           ,  "847",  "741" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=1028,828,514,526,527,741,248,847
*/

  const text_broadway = "[ Broadway Bridge ]\n||\nBroadway\n||\n[ The Battery ]";
  const broadway = [
    [ "Houston", "Houston St @ Broadway"            ,  "722",  "671" ],
    [ "14"     , "Union Sq @ 14 St"                 ,  "535",  "474" ],
    [ "42"     , "Broadway @ 42 St"                 ,  "475",  "403" ],
    [ "43"     , "Broadway @ 43 St"                 ,  "899",  "787" ],
    [ "46"     , "Broadway @ 46 St"                 , "1105",  "982" ],
    [ "46"     , "Broadway @ 46 St-Quad North"      , "1099",  "976" ],
    [ "46"     , "Broadway @ 46 St-Quad West"       , "1100",  "977" ],
    [ "46"     , "Broadway @ 46 St-Quad South"      , "1101",  "978" ],
    [ "46"     , "Broadway @ 46 St-Quad East"       , "1102",  "979" ],
    [ "46"     , "Broadway @ 46 St"                 ,  "187",   "26" ],
    [ "46"     , "Broadway @ 46 St"                 , "1127", "1004" ],
    [ "51"     , "Broadway @ 51 St"                 ,  "421",  "438" ],
    [ "59"     , "59 St @ Columbus Cr"              ,  "166",    "5" ],
    [ "96"     , "Broadway @ 96 St"                 ,  "739",  "687" ],
    [ "125"    , "Broadway @ 125 St"                , "1128", "1005" ],
    [ "145"    , "Broadway @ 145 St"                ,  "937",  "825" ],
    [ "169"    , "Broadway @ 169 St"                ,  "224",   "65" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=722,535,475,899,1105,1099,1100,1101,1102,187,1127,421,166,739,1128,937,224
*/

  const text_ave11 = "West End Ave\n||\n11 Ave\n||\n[ Chelsea Piers] ";
  const ave11 = [      /* West End Ave */
    [ "14"     , "11 Ave @ 14 St"                   ,  "548",  "489" ],
    [ "34"     , "11 Ave @ 34 St"                   ,  "326",  "200" ],
    [ "42"     , "11 Ave @ 42 St"                   ,  "192",   "31" ],
    [ "57"     , "11 Ave @ 57 St"                   ,  "827",  "721" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=548,326,192,827
*/

  const text_ave12 = "Henry Hudson Pkwy\n||\n12 Ave\n||\nWest St\n||\n[ Brooklyn-Battery Tunnel ]";
  const ave12 = [      /* West Side Hwy */
    [ "34"     , "12 Ave @ 34 St"                   ,  "545",  "486" ],
    [ "42"     , "12 Ave @ 42 St"                   ,  "544",  "485" ],
    [ "46"     , "West St @ Intrepid"               ,  "319",   "90" ],
    [ "57"     , "12 Ave @ 57 St"                   ,  "543",  "484" ],
    [ "70"     , "HH Pkwy @ 70 St"                  ,  "895",  "779" ],
    [ "96"     , "HH Pkwy @ 96 St"                  ,  "291",  "188" ],
    [ "99"     , "HH Pkwy @ 99 St"                  , "1305", "1200" ],
    [ "125"    , "HH Pkwy @ 125 St"                 ,  "933",  "501" ],
    [ "137"    , "HH Pkwy @ 137 St"                 ,  "558",  "500" ],
    [ "158"    , "HH Pkwy @ 158 St"                 ,  "554",  "495" ] ];
/*
https://webcams.nyctmc.org/multiview2.php?listcam=545,544,319,543,895,291,1305,933,558,554
*/
