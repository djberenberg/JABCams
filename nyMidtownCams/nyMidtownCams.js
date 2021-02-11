/* ************************************************************************* *
 * nyMidtownCams                                                             *
 * =============                                                             *
 * This is a hand-coded web page that displays traffic camera images on      *
 * Manhattan island in the mile or so between Grand Central Terminal and     *
 * the intersection of 5th Ave with 23rd St.  The HTML, the CSS, and the     *
 * JavaScript are all original by me and I make no copyright or ownership    *
 * stipulations.  Note that the camera images that I link to are not mine,   *
 * but are instead from web sites operated by the NYC DOT.                   *
 *                                                                           *
 * -John Berenberg, February 2020.                                           *
 * ************************************************************************* */

/* ************************************************************************* *
 * I use the following site to validate my JavaScript.                       *
 *                                                                           *
 * https://validatejavascript.com/                                           *
 *                                                                           *
 * The comments below configure the validation.                              *
 * ************************************************************************* */

/* eslint-env browser */

/* eslint eqeqeq                      : "off" */   // disables: no == or != rather than === and !==
/* eslint no-multi-spaces             : "off" */   // disables: no multiple white space
/* eslint indent                      : "off" */   // disables: enforce consistent indentation
/* eslint comma-dangle                : "off" */   // disables: force { a, b, c, }
/* eslint vars-on-top                 : "off" */   // disables: no declarations except at top of scope
/* eslint one-var-declaration-per-line: "off" */   // disables: no var a, b, c
/* eslint one-var                     : "off" */   // disables: just one each const, let, and var per scope
/* eslint no-var                      : "off" */   // disables: force const or let, never var
/* eslint no-unused-vars              : "off" */   // disables: no unused var
/* eslint no-eval                     : "off" */   // disables: no eval( "foo" )
/* eslint no-multi-assign             : "off" */   // disables: no a == b == c

/* eslint no-use-before-define        : ["error", { "functions": false }] */
/* eslint no-plusplus                 : ["error", { "allowForLoopAfterthoughts": true }] */
/* eslint no-param-reassign           : ["error", { "props": true,
                                                    "ignorePropertyModificationsFor": ["iIMGRef"]  }] */
/* eslint quotes                      : ["error", "double"] */  // This requires double
/* eslint space-in-parens             : ["error", "always"] */  // This enforces ( foo )
/* eslint computed-property-spacing   : ["error", "always"] */  // This enforces { fee: "fie" }
/* eslint space-before-function-paren : ["error", "never"]  */  // This enforces function(

/* eslint max-len                     : ["error", { "ignoreComments": true,
                                                    "ignoreUrls": true,
                                                    "ignoreRegExpLiterals": true,
                                                    "ignoreTemplateLiterals": true,
                                                    "ignoreStrings": true }] */

/* global iDIV_TOD, iDIVW_Sz, iDIVMain, iDIVAlt,
          iSPANCountDown, iSPANinfo,
          iSPANcompassN, iSPANcompassE, iSPANcompassS, iSPANcompassW,
          iINP_toggleTimer, iINP_camNumber, iINP_refreshTime,
          iBTN_refresh, iBTN_N, iBTN_E, iBTN_S, iBTN_W,
          iSEL, iFIGCAP1, iFIGCAP2, iIMGAlt */

/* ************************************************************************* *
 * End of validation configuration, start of actual code.                    *
 * ************************************************************************* */

/* **************************************************************** *
 * Global variables                                                 *
 * **************************************************************** */
  const msPerSec          =    1000;
  const keyCodeEnter      =      13;  // event.keycode for the Enter key
  const nbsp              = "\u00A0"; // &nbsp; No-break space

  const logoURL           = "NYCDOT.jpg";
  const inactURL          = "inactive-camera.gif";
  const VTransNotAvailURL = "unavail.png";
//const HeadCCTV          = "http://207.251.86.238/cctv";
  const HeadCCTV          = "https://jpg.nyctmc.org/cctv";
  const TailCCTV          = ".jpg?date=";

  var   refreshInterval   =  0.5;             /* Seconds */
  var   timeLeft          = refreshInterval;  /* Seconds before refresh      */

  var   timerOn           = true;             /* Is the refresh timer active */
  var   errorPause        = false;

  var   anEnterKeyupEvent;
 /* **************************************************************** *
  * camDef array                                                     *
  * ============                                                     *
  * Each NYCDOT camera has two identifying numbers.                  *
  *                                                                  *
  * The php# is the one used by the nyctmc.org site, but that is the *
  * only place it can be used.  A php script (hypertext pre-         *
  * processor) is interpreted by the server, not by the client, and  *
  * it returns a full web page, not just a single image.  It's not   *
  * suitable for embedding in another page.                          *
  *                                                                  *
  * At nyctmc.org the two uses of the php# are                       *
  *   https://webcams.nyctmc.org/google_popup.php?cid=xxx            *
  * and                                                              *
  *   https://webcams.nyctmc.org/multiview2.php?listcam=xxx,yyy,...  *
  *                                                                  *
  * The CCTV#, on the other hand, gives a direct connection to one   *
  * IMG object, suitable for embedding.                              *
  *   http://207.251.86.238/cctv<CCTV#>.jpg                          *
  * **************************************************************** */
  const camDef = [
   /* Title                     php#   CCTV#        NN */
   /* =======================   =====  =====        == */
    [ "7 Ave @ 43 St"         , "891", "782" ],  // 00
    [ "Broadway @ 43 St"      , "899", "787" ],  // 01
                                                      
    [ "Broadway @ 42 St"      , "475", "403" ],  // 02
    [ "6 Ave @ 42 St"         , "173",  "12" ],  // 03
    [ "5 Ave @ 42 St"         , "523", "466" ],  // 04
    [ "Madison Ave @ 42 St"   , "522", "467" ],  // 05
    [ "Lexington Ave @ 42 St" , "413", "303" ],  // 06
    [ "3 Ave @ 42 St"         , "398", "290" ],  // 07
                                                      
    [ "7 Ave @ 34 St"         , "501", "440" ],  // 08
    [ "6 Ave @ 34 St"         , "170",   "9" ],  // 09
    [ "5 Ave @ 34 St"         , "415", "305" ],  // 10
    [ "Madison Ave @ 34 St"   , "406", "296" ],  // 11
    [ "Park Ave @ 34 St"      , "419", "309" ],  // 12
    [ "Lexington Ave @ 34 St" , "542", "482" ],  // 13
    [ "3 Ave @ 34 St"         , "403", "431" ],  // 14
                                                      
    [ "7 Ave @ 23 St"         , "510", "447" ],  // 15
    [ "6 Ave @ 23 St"         , "511", "448" ],  // 16
    [ "5 Ave @ 23 St"         , "168",   "7" ],  // 17
    [ "Park Ave @ 23 St"      , "531", "473" ],  // 18
    [ "3 Ave @ 23 St"         , "495", "430" ]   // 19
  ];

 /* **************************************************************** *
  * Manual procedure to discover php# and CCTV#                      *
  *                                                                  *
  * You cannot "view source" in the browser for                      *
  *   https://webcams.nyctmc.org/                                    *
  * because that's disabled, and anyway the camera data is hiding in *
  * some other file.                                                 *
  *                                                                  *
  * However, from that webcams page zoom in and then click on a      *
  * desired camera, to bring up a mini pop-up window.  You can't     *
  * "view source" of this either, but the URL for the pop-up is in   *
  * the address bar, for example                                     *
  *   https://webcams.nyctmc.org/google_popup.php?cid=415            *
  * (The numeric cid at the end is the desired php#.)                *
  *                                                                  *
  * Now use notepad to file/open this found URL.  Search for         *
  * "function setImage" (without the quotes).  Line 2 of the         *
  * function discloses the target URL, in this example               *
  *   http://207.251.86.238/cctv305.jpg                              *
  * (the numeric cctv suffix is the desired CCTV#).  You can display *
  * this jpg in the browser, but it won't refresh, that's what the   *
  * elaborate script is for.                                         *
  *                                                                  *
  * Still in notepad, search for "myLabel" (this time WITH the       *
  * quotes).  Now you have the official camera title, in this case   *
  *   "5 Ave @ 34 St"                                                *
  * **************************************************************** */

 /* **************************************************************** *
  * MDN Polyfill #50 for Number.isInteger, because it's not          *
  * supported in some browsers.                                      *
  * **************************************************************** */
  /* eslint-disable func-names, no-restricted-globals */
  Number.isInteger = Number.isInteger || function( value ) {
    return typeof value === "number"
        && isFinite( value )
        && Math.floor( value ) === value;
  };
  /* eslint-enable func-names, no-restricted-globals */

 /* **************************************************************** *
  * Every HTML tag with an id automatically generates a global       *
  * JavaScript var with the same name as the id.                     *
  *                                                                  *
  * It's the same object returned by an explicit call to             *
  *   document.getElementById( id )                                  *
  *                                                                  *
  * There's nothing magic about the leading lowercast letter i.      *
  * It's simply my convention for the id of an HTML tag.             *
  *                                                                  *
  * iDIV_TOD         DIV where the TOD gets inserted                 *
  * iSPANCountDown   SPAN where seconds remaining are counted down   *
  * iINP_toggleTimer BUTTON whose text is modified: Pause / Resume   *
  * iINP_camNumber   INPUT field for camera site number              *
  * iINP_refreshTime INPUT field for refresh interval                *
  * iBTN_refresh     BUTTON to trigger an immediate refresh          *
  * iSEL             SELECT drop-down                                *
  * iFIGCAP1         FIGCAPTION to show camera site text             *
  * iIMG0            IMG for camera 0                                *
  * iIMG1            IMG for maximum size                            *
  *                                                                  *
  * **************************************************************** */

 /* **************************************************************** *
  * tester is a global array of the same length as camDef,           *
  * needed by functions repopulateImages and testImageResponse.      *
  * **************************************************************** */
  var tester = [...Array( camDef.length )];

 /* **************************************************************** *
  * function setGlobals()                                            *
  *                                                                  *
  * This function is triggered from <BODY onload=...>                *
  * **************************************************************** */
  function setGlobals() {
    createDivs();

    try {
      anEnterKeyupEvent = new KeyboardEvent( "keyup", { "key" : "Enter" } );
    } catch ( err ) {
      anEnterKeyupEvent = document.createEvent( "KeyboardEvent" );
      anEnterKeyupEvent.initKeyboardEvent( "keyup", true, false, null, 0, keyCodeEnter );
    } finally {
      /* */
    }

   /* ************************************************************** *
    * keyCode Polyfill                                               *
    *                                                                *
    * event.keyCode has been deprecated in favor of event.key,       *
    * because "inconsistent across platforms", but not all browsers  *
    * are on board with this.  The event listeners below show        *
    * "graceful degradation" by favoring "key" but falling back to   *
    * "keyCode".                                                     *
    * ************************************************************** */

   /* ************************************************************** *
    * This event listener generates a "click" on the refresh         *
    * interval input button if the user presses "Enter" instead of   *
    * doing a button click.  Either way, the new interval is set.    *
    *                                                                *
    * The event is a KeyboardEvent, event.type is "keyup".           *
    * ************************************************************** */
    iINP_refreshTime.value = refreshInterval;
    iINP_refreshTime.onkeyup = ( e ) => {
      var key = e.key || e.keyCode;
      if ( key === "Enter" || key == keyCodeEnter ) {
        refreshInterval = iINP_refreshTime.value;
        timeLeft        = refreshInterval;
      }
    }; // anonymous function

   /* ************************************************************** *
    * This event listener dynamically stuffs the window size into    *
    * iDIVW_Sz for display.  Intended for debugging Responsive Web   *
    * Design.                                                        *
    *                                                                *
    * The event is just an Event, event.type is "resize".            *
    * ************************************************************** */
    window.onresize = ( e ) => {
      // Deconstruct system object "window" .innerWidth ==> w, .innerHeight ==> h
      const { innerWidth: w, innerHeight: h } = window;
      const s = w >= 1200 ? "XL" :
                w >=  992 ? "L"  :
                w >=  768 ? "M"  :
                w >=  600 ? "S"  :
                            "XS" ;
      const o = w > h ? "Landscape" : "Portrait";
      iDIVW_Sz.innerHTML = `${w} &times; ${h}:${o} (${s})`;
    }; // anonymous function
    window.onresize();

    whatTimeIsIt();
  } // function setGlobals

 /* **************************************************************** *
  * function toggleEmbiggen( event )                                 *
  *                                                                  *
  * event        is a MouseEvent{...}                                *
  * event.type   is "click"                                          *
  * event.target is iIMGAlt or else one of the iIMGnn objects        *
  *                                                                  *
  * Whichever image was clicked, the function hides it and unhides   *
  * the other one.                                                   *
  * **************************************************************** */
  function toggleEmbiggen( event ) {
    if ( event.target == iIMGAlt ) {    // Clicked on iIMGAlt, the single IMG in the alternate DIV
      iDIVAlt.style.display  = "none";  // ==> Hide the alternate DIV
      iDIVMain.style.display = "block"; // ==> Unhide the main DIV

    } else {                            // Clicked on an IMG in the main DIV
      iIMGAlt.src  = event.target.src;   // ==> Copy the clicked IMG to the alternate IMG location
      iIMGAlt.alt  = event.target.alt;
      iIMGAlt.slot = event.target.slot;

      const slot = iIMGAlt.slot;
      eval( `iFIGCAPAlt.innerHTML = iFIGCAP${slot}.innerHTML;` );

      iDIVMain.style.display = "none";  // ==> Hide the main DIV
      iDIVAlt.style.display  = "block"; // ==> Unhide the alternate DIV

    }
  } // function toggleEmbiggen

 /* **************************************************************** *
  * function whatTimeIsIt()                                          *
  *                                                                  *
  * This function runs on a timer, once per second, with two         *
  * objectives.                                                      *
  * 1. Update the displayed date and time of day.                    *
  * 2. Every refreshInterval seconds while the count down is enabled,*
  *    refresh the camera images.                                    *
  * **************************************************************** */
  function whatTimeIsIt() {
    iDIV_TOD.innerHTML = new Date();
    if ( !errorPause ) {
      if ( timerOn      ) {
        iSPANCountDown.innerHTML = timeLeft--;             // eslint-disable-line no-plusplus
      }
      if ( timeLeft < 0 ) {
        repopulateImages();                           // Reload the current image(s) from the internet.
        if ( iDIVAlt.style.display === "block" ) {
          const { slot } = iIMGAlt;
          eval( `iIMGAlt.src = iIMG${slot}.src;` );   // Refresh the alternate IMG location
          eval( `iIMGAlt.alt = iIMG${slot}.alt;` );
        }
        timeLeft = refreshInterval;
      }
    }
    var t = setTimeout( whatTimeIsIt, msPerSec );
  } // function whatTimeIsIt

 /* **************************************************************** *
  * function toggleTimer()                                           *
  *                                                                  *
  * This function is triggered by the button labeled                 *
  * Pause Timer / Resume Timer.                                      *
  * **************************************************************** */
  function toggleTimer() {
    timerOn     = !timerOn;
    iINP_toggleTimer.value = timerOn ? "Pause Timer   "
                                     : "Resume Timer";
    if ( !errorPause ) {
      iSPANinfo.style.opacity = timerOn ? 1
                                        : 0.25;
    }
  } // function toggleTimer

 /* **************************************************************** *
  * function createDivs()                                            *
  *                                                                  *
  * This function creates a DIV inside iDIVMain for every camera     *
  * defined in camDef, and also copies the camera titles from        *
  * camDef into the DIVs.  Finally it creates a not-quite-similar    *
  * section inside iDIVAlt.                                          *
  * **************************************************************** */
  function createDivs() {
    const dateNow = Date.now();
    var   title, phpNo, cctvNo, NN;
    for ( var index = 0; index < camDef.length; index++ ) {
      [ title, phpNo, cctvNo ] = camDef[ index ];
      NN                     = `00${index}`.slice( -2 );

      newDiv                 = document.createElement( "div"        );
      newDiv.className       = "col-12 col-s-6 col-m-4 col-l-3 col-xl-3";

      newFigure              = document.createElement( "figure"     );

      newFigCap              = document.createElement( "figcaption" );
      newFigCap.id           = `iFIGCAP${NN}`;
      newFigCap.innerHTML    = title;

      newImg                 = document.createElement( "img"        );
      newImg.id              = `iIMG${NN}`;
      newImg.src             = "#";
      newImg.alt             = phpNo;
      newImg.slot            = NN;
      newImg.style.width     = "100%";
      newImg.style.maxWidth  = "100%";
      newImg.onclick         = toggleEmbiggen;

      newFigure.appendChild( newFigCap );
      newFigure.appendChild( newImg    );

      newDiv.appendChild( newFigure );

      iDIVMain.appendChild( newDiv );

      tester[ index ]        = new Image();
      tester[ index ].src    = `${HeadCCTV}${cctvNo}${TailCCTV}${dateNow}`;
      tester[ index ].alt    = phpNo;
      tester[ index ].slot   = NN;
      tester[ index ].addEventListener( "load",  testImageResponse );
      tester[ index ].addEventListener( "error", testImageResponse );
    }

    /* And now for iDIVAlt */
    newFigure              = document.createElement( "figure"     );

    newFigCap              = document.createElement( "figcaption" );
    newFigCap.id           = "iFIGCAPAlt";

    newImg                 = document.createElement( "img"        );
    newImg.id              = "iIMGAlt";
    newImg.src             = "#";
    newImg.alt             = "#";
    newImg.style.width     = "100%";
    newImg.style.maxWidth  = "100%";
    newImg.onclick         = toggleEmbiggen;

    newFigure.appendChild( newFigCap );
    newFigure.appendChild( newImg    );

    iDIVAlt.appendChild( document.createTextNode( "Click on image to exit full screen." ) );
    iDIVAlt.appendChild( newFigure );

  }

 /* **************************************************************** *
  * function repopulateImages()                                      *
  *                                                                  *
  * This function refreshes loading of camera images defined in      *
  * camDef.  The asynchronous event listener testImageResponse()     *
  * completes the action, depending on whether it detects a          *
  * successful load or an error.                                     *
  *                                                                  *
  * The function is called every refresh cycle, to get the latest    *
  * camera images from the web.                                      *
  * **************************************************************** */
  function repopulateImages() {
    const dateNow = Date.now();
    var   CCTVNo, NN;
    for ( var index = 0; index < camDef.length; index++ ) {
      [ , , CCTVNo ]  = camDef[ index ];
      tester[ index ].src  = `${HeadCCTV}${CCTVNo}${TailCCTV}${dateNow}`;
    }
  } // function repopulateImages

 /* **************************************************************** *
  * function testImageResponse( event )                              *
  *                                                                  *
  * This asynchronous event listener hopes to see a successful image *
  * load, and if so, updates the corresponding HTML <IMG> tag in the *
  * document.  The event parameter will be an onload or onerror      *
  * event object for a private HTML <IMG> tag (i.e. an IMG that is   *
  * in memory but not in the document).                              *
  * **************************************************************** */
  function testImageResponse( event ) {
    const { type, srcElement: { src, alt, slot } } = event;
    switch ( type ) {
      case "load":
        eval( `iIMG${slot}.src = src;` );
        break;
      case "error":
        eval( `iIMG${slot}.src = VTransNotAvailURL;` );
        break;
      default:
        break;
    }

    errorPause = false;
    if ( timerOn ) { iSPANinfo.style.opacity = 1; }
  } // function testImageResponse

 /* **************************************************************** *
  *                                                                  *
  *                                                                  *
  *                                                                  *
  * **************************************************************** */
