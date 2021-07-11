/* ************************************************************************* *
 * ManhattanCams                                                             *
 * =============                                                             *
 * This is a hand-coded web page that displays traffic camera images on      *
 * Manhattan island, organized along the major N/S avenues.  The HTML, the   *
 * CSS, and the JavaScript are all original by me and I make no copyright    *
 * or ownership stipulations.  Note that the camera images that I link to    *
 * are not mine, but are instead from web sites operated by the NYC DOT.     *
 *                                                                           *
 * -John Berenberg, July 2021.                                               *
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

/* global iDIVHdr, iSPAN_TOD, iSPANW_Sz,
          iINP_toggleTimer, iINP_refreshTime,
          iSPANinfo, iSPANCountDown,
          iBTN_refresh,
          iDIVhdrL, iDIVhdrR,
          iDIVMain, iDIVAlt,
          iFIGCAPAlt, iIMGAlt,
          iDIVFooter,
          tester
         */

/* ************************************************************************* *
 * End of validation configuration, start of actual code.                    *
 * ************************************************************************* */

/* **************************************************************** *
 * Global variables                                                 *
 * **************************************************************** */
  const msPerSec          =    1000;
  const keyCodeEnter      =      13;  // event.keycode for the Enter key

//const logoURL           = "NYCDOT.jpg";
//const inactURL          = "inactive-camera.gif";
  const VTransNotAvailURL = "unavail.png";
//const HeadCCTV          = "http://207.251.86.238/cctv";
  const HeadCCTV          = "https://jpg.nyctmc.org/cctv";
  const TailCCTV          = ".jpg?date=";

  var   refreshInterval   =  0.9999;          /* Seconds */
  var   timeLeft          = refreshInterval;  /* Seconds before refresh      */

  var   timerOn           = false;            /* Is the refresh timer active */
  var   errorPause        = false;

  var   anEnterKeyupEvent;
  var   aveSelectedName   = null;

 /* **************************************************************** *
  * Camera definition arrays                                         *
  * ========================                                         *
  * Each NYCDOT camera has two identifying numbers, php# and CCTV#.  *
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
  *   https://jpg.nyctmc.org/cctv<CCTV#>.jpg                         *
  * **************************************************************** */

 /* **************************************************************** *
  * Manual procedure to discover php# and CCTV#                      *
  *                                                                  *
  * You cannot "view source" in the browser for                      *
  *   https://webcams.nyctmc.org/                                    *
  * because that's disabled, and anyway the camera data is hiding in *
  * some other file.                                                 *
  *                                                                  *
  * However, from that page of webcams, zoom in and then click on a  *
  * desired camera, to bring up a mini pop-up window.  You can't     *
  * "view source" of this either, but the URL for the pop-up is in   *
  * the address bar, for example                                     *
  *   https://webcams.nyctmc.org/google_popup.php?cid=415            *
  * (The numeric cid at the end is the desired php#.)                *
  *                                                                  *
  * Now use notepad to file/open this found URL.  Search for         *
  * "function setImage" (without the quotes).  Line 2 of the         *
  * function discloses the target URL, in this example               *
  *   https://jpg.nyctmc.org/cctv305.jpg                             *
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
  *   https://github.com/byteball/ocore/issues/50                    *
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
  * iDIVHdr          Non-scrolling DIV at the top of the window      *
  * iSPAN_TOD        SPAN where the TOD is inserted                  *
  * iSPANW_Sz        SPAN where the dynamic window size is inserted  *
  * iINP_toggleTimer BUTTON whose text is modified: Pause / Resume   *
  * iINP_refreshTime INPUT field for refresh interval                *
  * iSPANinfo        SPAN where seconds remaining are counted down   *
  * iBTN_refresh     BUTTON to trigger an immediate refresh          *
  * iDIVMain         DIV containing multiple camera images           *
  * iDIVAlt          DIV containing one window-wide camera image     *
  * iDIVFooter       DIV at the end                                  *
  *                                                                  *
  * **************************************************************** */

 /* **************************************************************** *
  * Named functions in this script:                                  *
  *   setGlobals              One-time init                          *
  *   createCamScript         One-time init for each cam group       *
  *   declareTesterPrototype  One-time init for each cam group       *
  *   populateTesterPrototype One-time init for each camera image    *
  *   changeAveSelect         When a radio button is selected        *
  *   activateTester          When a cam group is selected           *
  *   toggleEmbiggen          Switch between multiple/single view    *
  *   whatTimeIsIt            Background on a 1-sec timer            *
  *   toggleTimer             Turn timer on/off via button click     *
  *   repopulateImages        Refresh images from the internet       *
  *   testImageResponse       Accept refreshed images                *
  *                                                                  *
  * **************************************************************** */

 /* **************************************************************** *
  * tester is a global array of the same length as camera defs.      *
  * needed by functions repopulateImages and testImageResponse.      *
  * **************************************************************** */

 /* **************************************************************** *
  * function setGlobals()                                            *
  *                                                                  *
  * This function is triggered from <BODY onload=...>                *
  * **************************************************************** */
  function setGlobals() {

   /* **************************************************************** *
    * Harvest all the radio buttons in aveSelect.  For each one,       *
    * create an HTML script to display the button's associated cams.   *
    * Then for the one "checked" radio button, append its script to    *
    * iDIVMain.  The others scripts are swapped in when their radio    *
    * button is pressed.                                               *
    * **************************************************************** */
    var selBtnsArray = document.querySelectorAll( "input[name='aveSelect']" );
    for ( var index = 0; index < selBtnsArray.length; index++ ) {
      selBtnsArray[ index ].addEventListener( "change", changeAveSelect );

      var aveNameCurrent = selBtnsArray[ index ].value;

      if ( selBtnsArray[ index ].checked ) {
        aveSelectedName = aveNameCurrent;
      }

      createCamScript( aveNameCurrent, selBtnsArray[ index ].checked );
    }

    iDIVMain.appendChild( eval( `iDIV${aveSelectedName}` ) );

    /* Note: we're still in setGlobals. */

    /* What follows are activations of several general purpose
       event listeners:
         o Listen for the "Enter" key
         o Listen for entry of a new refresh interval
         o Listen for the window to be resized
     */

   /* ************************************************************** *
    * keyCode Polyfill                                               *
    *                                                                *
    * event.keyCode has been deprecated in favor of event.key,       *
    * because "inconsistent across platforms", but not all browsers  *
    * are on board with this.  The event listeners below show        *
    * "graceful degradation" by favoring "key" but falling back to   *
    * "keyCode".                                                     *
    * ************************************************************** */

    try {
      anEnterKeyupEvent = new KeyboardEvent( "keyup", { "key" : "Enter" } );
    } catch ( err ) {
      anEnterKeyupEvent = document.createEvent( "KeyboardEvent" );
      anEnterKeyupEvent.initKeyboardEvent( "keyup", true, false, null, 0, keyCodeEnter );
    } finally {
      /* */
    }

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

    /* Note: we're still in setGlobals. */

   /* ************************************************************** *
    * This event listener dynamically stuffs the window size into    *
    * iSPANW_Sz for display.  Intended for debugging Responsive Web  *
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
      iSPANW_Sz.innerHTML = `${w} &times; ${h}:${o} (${s})`;

      iDIVhdrL.style.minHeight = "0px";
      iDIVhdrR.style.minHeight = "0px";
      var rectL = iDIVhdrL.getBoundingClientRect();
      var rectR = iDIVhdrR.getBoundingClientRect();
      if ( rectL.x != rectR.x ) {
        if ( rectL.height < rectR.height ) { iDIVhdrL.style.minHeight = rectR.height + "px"; }
        if ( rectR.height < rectL.height ) { iDIVhdrR.style.minHeight = rectL.height + "px"; }
      }
   }; // anonymous function

    /* Note: we're still in setGlobals. */

    /* setGlobals concludes by simulating a window resize,
       turning the countdown timer on, and starting the
       once-per-second background timer.
     */

    window.onresize();  // For initialization, simulate a resize

    timerOn = true;     // The timer was statically initialized to false until here

    whatTimeIsIt();     // Start the TOD clock
  } // function setGlobals

 /* **************************************************************** *
  * function createCamScript( camArrayName, isChecked )              *
  *                                                                  *
  * The first parameter is the name of an array of camera ids.       *
  * This function creates a new DIV that will display those cameras  *
  * when the DIV is appended to the active HTML script.              *
  *                                                                  *
  * The DIV object is created in the js global name space, with name *
  * iDIV<camArrayName>.                                              *
  *                                                                  *
  * The second parameter is a Boolean.  When true, the function      *
  * arranges for the passed cameras to be refreshed periodically.    *
  *                                                                  *
  * **************************************************************** */
  function createCamScript( camArrayName, isChecked ) {
    var newDiv, newText, newFigure, newFigCap, newImg;

    eval( `iDIV${camArrayName}    = document.createElement( 'div' );` );
                                           // This creates a div and also a global var named iDIV<camArrayName>

    eval( `iDIV${camArrayName}.id = "iDIV${camArrayName}";` );
                                           // This assigns an id to the new div

    var camArray  = eval( camArrayName );  // This makes var camArray be a reference to the named camera array

    declareTesterPrototype( camArrayName, camArray.length );
                                           // This creates an array with the same array length as the camera array

    // The following section creates an HTML div, in newDiv, to display all the images in the camera array

    newDiv                   = document.createElement( "div"        );
    newDiv.className         = "prewrap center col-12 col-s-6 col-m-4 col-l-3 col-xl-3";

    newText                  = document.createTextNode( eval( `text_${camArrayName}` ) );
    newDiv.appendChild( newText );
    eval( `iDIV${camArrayName}.appendChild( newDiv );` );

    const dateNow = Date.now();
    var   crossSt, title, phpNo, cctvNo, NN;
    for ( var index = 0; index < camArray.length; index++ ) {
      [ crossSt, title, phpNo, cctvNo ] = camArray[ index ];
      NN                     = `00${index}`.slice( -2 );

      newDiv                 = document.createElement( "div"        );
      newDiv.className       = "col-12 col-s-6 col-m-4 col-l-3 col-xl-3";
      newDiv.id              = `iDIV${camArrayName}_${NN}`;

      newFigure              = document.createElement( "figure"     );

      newFigCap              = document.createElement( "figcaption" );
      newFigCap.id           = `iFIGCAP${NN}`;
      newFigCap.innerHTML    = title;

      newImg                 = document.createElement( "img"        );
      newImg.id              = `iIMG${camArrayName}_${NN}`;
      newImg.src             = "#";
      newImg.alt             = phpNo;
      newImg.slot            = NN;
      newImg.style.maxWidth  = "100%";
      newImg.addEventListener( "click", toggleEmbiggen );

      newFigure.appendChild( newFigCap );
      newFigure.appendChild( newImg    );

      newDiv.appendChild( newFigure );

      eval( `iDIV${camArrayName}.appendChild( newDiv );` );

      populateTesterPrototype( camArrayName, index, `${HeadCCTV}${cctvNo}${TailCCTV}${dateNow}`, phpNo, NN );
    }

    // newDiv is now complete.

    // If newDiv is for the active camera array, then also set up the image refresh array.
    if ( isChecked ) {
      activateTester( camArrayName );
    }

    var t0 = 0;                   // This is here just for breakpoints

  } // createCamScript

 /* **************************************************************** *
  * function declareTesterPrototype( name, length )                  *
  *                                                                  *
  * The number of cameras in each group is independent of the other  *
  * groups.  A global array named "tester" has to have the same      *
  * dimension as the active camera group.  This function             *
  * creates a prototype tester_<name> array on each call.  When      *
  * a camera group is activated, global "tester" takes on the        *
  * attributes of the appropriate tester_<name>.                     *
  *                                                                  *
  * **************************************************************** */
  function declareTesterPrototype( name, length ) {
    eval( `tester_${name} = [...Array( ${length} )];` ) ;
                                            // This should declare global array(length) tester_<name>
  }

 /* **************************************************************** *
  * function populateTesterPrototype( name, index, src, alt, slot )  *
  *                                                                  *
  * After the tester_<name> array is declared, each of its elements  *
  * must be populated with camera image information.  This is done   *
  * just once per camera, at initialization time.                    *
  *                                                                  *
  * **************************************************************** */
  function populateTesterPrototype( name, index, src, alt, slot ) {
       eval( `tester_${name}[ index ]      = new Image();` );
       eval( `tester_${name}[ index ].src  = src;`         );
       eval( `tester_${name}[ index ].alt  = alt;`         );
       eval( `tester_${name}[ index ].slot = slot;`        );
//     eval( `tester_${name}[ index ].addEventListener( "load",  testImageResponse );` );
//     eval( `tester_${name}[ index ].addEventListener( "error", testImageResponse );` );
  }

 /* **************************************************************** *
  * function changeAveSelect( event )                                *
  *                                                                  *
  * event        is an Event                                         *
  * event.type   is "change"                                         *
  * event.srcElement is an <input type="radio" ... > object          *
  *                                                                  *
  * This function updates global aveSelectedName when a new radio    *
  * button is pressed.  Then it swaps in the HTML DIV for the new    *
  * camera group, and it activates the associated "tester" array.    *
  *                                                                  *
  * The refresh timer is disabled during these changes, in order to  *
  * not step on any active event listeners.                          *
  *                                                                  *
  * **************************************************************** */
  function changeAveSelect( event ) {
    const timerOnPrev = timerOn;
    if ( timerOnPrev ) toggleTimer();
    /* DO with the timer disabled */ {
      // First of all, if iDIVAlt is active, switch back to iDIVMain
      if ( iDIVAlt.style.display == "block" ) {
        iIMGAlt.src  = "#";
        iIMGAlt.alt  = "#";
        iIMGAlt.slot = null;
        iDIVAlt.style.display  = "none";  // ==> Hide the alternate DIV
        iDIVMain.style.display = "block"; // ==> Unhide the main DIV
      }

      var nameSelectedPrev    = aveSelectedName;
      var divNameSelectedPrev = `iDIV${nameSelectedPrev}`;
//    var divObjSelectedPrev  = eval( divNameSelectedPrev );

      var inpObjSelected      = event.srcElement;
          aveSelectedName     = inpObjSelected.value;
      var camArrayLength      = eval( aveSelectedName ).length;
      var divNameSelected     = `iDIV${aveSelectedName}`;
//    var divObjSelected      = eval( divNameSelected );

      iDIVMain.replaceChild( eval( `${divNameSelected}` ), eval( `${divNameSelectedPrev}` ) );

      activateTester( aveSelectedName );
    }
    if ( timerOn != timerOnPrev ) toggleTimer();
  }

 /* **************************************************************** *
  * function activateTester( name )                                  *
  *                                                                  *
  * This function is called when a new camera group is selected.     *
  * The event listeners in global array "tester" are disabled and    *
  * then "tester" is redeclared (i.e. resized and reinitialized)     *
  * from one of the tester_<name> prototypes.  Then event listeners  *
  * are enabled, to support updating the camera images.              *
  *                                                                  *
  * There's a non-obvious trick in this function.  In javascript,    *
  * a simple array assignment "a2 = a1;" does not copy the elements  *
  * of a1 into a2.  Instead it makes a2 point to a1.  Any change to  *
  * either a1 or a2 immediately changes both.  Fortunately, that is  *
  * what is desired here.  But if an actual copy operation were      *
  * desired, we would have to write "a2 = a1.slice( 0 );".  Go       *
  * figure.                                                          *
  *                                                                  *
  * **************************************************************** */
  function activateTester( name ) {
    var index = null;
    var testerExists = ( typeof tester !== typeof undefined );
    if ( testerExists ) {
      for ( index = 0; index < tester.length; index++ ) {
        tester[ index ].removeEventListener( "load",  testImageResponse );
        tester[ index ].removeEventListener( "error", testImageResponse );
      }
    }
    eval( `tester = tester_${name};` );  // <== This is the trick assignment
    for ( index = 0; index < tester.length; index++ ) {
      tester[ index ].addEventListener( "load",  testImageResponse );
      tester[ index ].addEventListener( "error", testImageResponse );
    }
  }

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
      iIMGAlt.src  = "#";                 // ==> Finished with the alternate image
      iIMGAlt.alt  = "#";
      iIMGAlt.slot = null;
      iDIVAlt.style.display  = "none";    // ==> Hide the alternate DIV
      iDIVMain.style.display = "block";   // ==> Unhide the main DIV

    } else {                            // Clicked on an IMG in the main DIV
      iIMGAlt.src  = event.target.src;    // ==> Copy the clicked IMG to the alternate IMG location
      iIMGAlt.alt  = event.target.alt;
      iIMGAlt.slot = event.target.slot;

      const slot = iIMGAlt.slot;          // ==> Copy the associated figure cption
      const selectedFigCap = eval( `iFIGCAP${slot}.innerHTML` );
      iFIGCAPAlt.innerHTML = selectedFigCap;

      iDIVMain.style.display = "none";    // ==> Hide the main DIV
      iDIVAlt.style.display  = "block";   // ==> Unhide the alternate DIV

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
    iSPAN_TOD.innerHTML = new Date();
    if ( !errorPause ) {
      if ( timerOn      ) {
        iSPANCountDown.innerHTML = timeLeft--;             // eslint-disable-line no-plusplus
      }
      if ( timeLeft < 0 ) {
        repopulateImages();                           // Reload the current image(s) from the internet.
        if ( iDIVAlt.style.display === "block" ) {
          const { slot } = iIMGAlt;
          const selectedFigCapObj = eval( `iFIGCAP${slot}` );
          const selectedImg       = selectedFigCapObj.nextSibling;
          const src               = selectedImg.src;
          iIMGAlt.src = src;                          // Refresh the alternate IMG location
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
    iINP_toggleTimer.value = timerOn ? "Pause Timer "
                                     : "Resume Timer";
    if ( !errorPause ) {
      iBTN_refresh.style.opacity =
      iSPANinfo.style.opacity    = timerOn ? 1
                                           : 0.125;
    }
  } // function toggleTimer

 /* **************************************************************** *
  * function repopulateImages()                                      *
  *                                                                  *
  * This function refreshes loading of camera images defined in cam  *
  * defs.  The asynchronous event listener testImageResponse()       *
  * completes the action, depending on whether it detects a          *
  * successful load or an error.                                     *
  *                                                                  *
  * The function is called every refresh cycle, to get the latest    *
  * camera images from the web.                                      *
  * **************************************************************** */
  function repopulateImages() {
    if ( timerOn ) {
      const dateNow = Date.now();
      var   CCTVNo, NN;
      for ( var index = 0; index < tester.length; index++ ) {
        [ , , , CCTVNo ] = eval( `${aveSelectedName}[ index ]` );
        tester[ index ].src  = `${HeadCCTV}${CCTVNo}${TailCCTV}${dateNow}`;
      }
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
  *                                                                  *
  * But if the load is indeed successful, this function copies the   *
  * <IMG> into the document.                                         *
  *                                                                  *
  * The event is just an Event, event.type is "load" or "error".     *
  * The event.src is the URL of the image, and alt and slot are      *
  * parameters associated with the srcElement.                       *
  *                                                                  *
  * **************************************************************** */
  function testImageResponse( event ) {
    const { type, srcElement: { src, alt, slot } } = event;

    /*                                                           Supposing div1Name is "foo", then
     *  <div id="iDIVfoo">                                         <== this div is the div1Obj
     *    <div>Text node</div>                                     <==   this div is div1Obj.childNodes[0]
     *    <div id="iDIVfoo_00"> ... </div>
     *    <div id="iDIVfoo_01"> ... </div>                         <==   subsequent divs are div1Obj.childNodes[slot+1]
     *         ...                        
     *    <div id="iDIVfoo_nn">                                    <==   this div is the div2Obj (when slot = nn)
     *      <figure                                                <==     this childNode is the figureObj
     *        <figcaption ...> ... </figcaption>                   <==       this is figureObj.childNodes[0]
     *        <img id="iIMGfoo_nn" src="..." alt="..." slot="nn">  <==       and this is the imgObj, i.e. childNodes[1]
     *      </figure>
     *    </div
     *         ...
     *    <div id="iDIVfoo_nn"> ... </div>
     *  </div>
     */

    var div1Name  = `iDIV${aveSelectedName}`;
    var div1Obj   = eval( div1Name );
    var div2Obj   = div1Obj.childNodes[ eval( slot ) + 1 ];
    var figureObj = div2Obj.childNodes[ 0 ];
    var imgObj    = figureObj.childNodes[ 1 ];
    var imgObjId  = imgObj.id;
    var t4        = imgObj.src;
    var t5        = imgObj.slot;
    var t7 = 0;                   // This is here just for breakpoints

    switch ( type ) {
      case "load":
        imgObj.src = src;
        break;
      case "error":
        imgObj.src = VTransNotAvailURL;
        break;
      default:
        break;
    }

    errorPause = false;
    if ( timerOn ) {
      iBTN_refresh.style.opacity =
      iSPANinfo.style.opacity    = 1; }
  } // function testImageResponse

 /* **************************************************************** *
  *                                                                  *
  *                                                                  *
  *                                                                  *
  * **************************************************************** */
