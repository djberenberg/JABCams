/* ************************************************************************* *
 * VtCams                                                                    *
 * ======                                                                    *
 * This is a hand-coded web page that displays traffic camera images in the  *
 * state of Vermont.  The HTML, the CSS, and the JavaScript are all original *
 * by me and I make no copyright or ownership stipulations.  Note that the   *
 * camera images that I link to are not mine, but are instead from web sites *
 * operated by the state of Vermont.                                         *
 *                                                                           *
 * -John Berenberg, January 2020.                                            *
 * ************************************************************************* *

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
          iSEL, iFIGCAP1, iFIGCAP2, iIMG0, iIMG1, iIMG2, iIMG3, iIMG4, iIMG5,
          iIMGAlt, iFIGCAPAlt */

/* ************************************************************************* *
 * End of validation configuration, start of actual code.                    *
 * ************************************************************************* */

/* *************************************************************** *
 * Global variables                                                *
 * *************************************************************** */
  const msPerSec          =    1000;
  const keyCodeEnter      =      13;  // event.keycode for the Enter key
  const nbsp              = "\u00A0"; // &nbsp; No-break space

  const VTransImageURL    = "https://gov.seeclickfix.com/wp-content/uploads/2016/04/Screen-Shot-2016-04-27-at-1.50.03-PM.png";
  const VTransNotAvailURL = "https://vtrans.vermont.gov/sites/aot/files/admin/imageNotAvailable-min.jpg";

  var   refreshInterval   =   30;             /* Seconds */
  var   timeLeft          = refreshInterval;  /* Seconds before refresh      */

  var   timerOn           = true;             /* Is the refresh timer active */
  var   errorPause        = false;

  var   selOpts;                              /* The drop-down OPTION array in iSEL */

  var   aChangeEvent;

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
  * iBTN_refresh     BUTTON to trigger a reload                      *
  * iSEL             SELECT drop-down                                *
  * iFIGCAP1         FIGCAPTION to show camera site text             *
  * iIMG0            IMG for camera 0                                *
  * iIMG1            IMG for camera 1                                *
  * iIMG2            IMG for camera 2                                *
  * iIMG3            IMG for camera 3                                *
  * iIMG4            IMG for camera 4                                *
  *                                                                  *
  * **************************************************************** */

 /* **************************************************************** *
  * function setGlobals()                                            *
  *                                                                  *
  * This function is triggered from <BODY onload=...>                *
  * **************************************************************** */
  function setGlobals() {
    createDivs();

    selOpts     = iSEL.options;
    for ( var index = 0; index < selOpts.length; index++ ) {
      selOpts[ index ].value
        = selOpts[ index ].value.replace( /\r?\n|\r/g, "" ).replace( / /g, "" ).replace( /__/g, " " );
      /* For those of us not entirely familiar with regexp, here is what just 
         happened.  The HTML tags at iSEL.options have loads of white space   
         for readability.  But the code doesn't tolerate that.  So the first  
         replace() removes all carriage returns, and the second replace()     
         removes all spaces.  But then the third replace() substitutes a      
         single space for any two consecutive underscores, because there are  
         a few places where a display string ought to have a space.         */
    }

   /* ************************************************************** *
    * The iSEL onchange event is automatically triggered when the    *
    * user clicks in the drop-down list.  When we want to change the *
    * selection programmatically, we trigger the onchange event by   *
    * calling iSEL.dispatchEvent( aChangeEvent ).                    *
    * ************************************************************** */
    try {
      aChangeEvent = new Event( "change" );
    } catch ( err ) {
      aChangeEvent = document.createEvent( "event" );
      aChangeEvent.initEvent( "change", false, false );
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
    * This event listener generates a "click" on the cam number      *
    * input button if the user presses "Enter" instead of doing a    *
    * a button click.  Either way, the numbered camera is loaded.    *
    * ************************************************************** */
    iINP_camNumber.onkeyup = ( e ) => {
      var key = e.key || e.keycode;
      if ( key === "Enter" || key == keyCodeEnter ) {
        getCamByNum( iINP_camNumber.value );
      }
    }; // anonymous function

   /* ************************************************************** *
    * This event listener generates a "click" on the refresh         *
    * interval input button if the user presses "Enter" instead of   *
    * doing a button click.  Either way, the new interval is set.    *
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
    * This event listener responds to a changed selection, whether   *
    * by user mouse click or by programmatic dispatchEvent.          *
    * ************************************************************** */
    iSEL.onchange = ( e ) => {
      getCamBySel( e );
    }; // anonymous function

   /* ************************************************************** *
    * This call loads the default VTrans logo image during           *
    * initialization.                                                *
    * ************************************************************** */
    iSEL.dispatchEvent( aChangeEvent );

   /* ************************************************************** *
    * Dynamically stuffs the window size into iDIVW_Sz for display.  *
    * Intended for debugging Responsive Web Design.                  *
    * ************************************************************** */
    window.onresize = () => {
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
  * event.target is iIMG0 or iIMG1 depending on which was clicked    *
  *                                                                  *
  * Whichever image was clicked, the function hides it and unhides   *
  * the other one.                                                   *
  * **************************************************************** */
  function toggleEmbiggen( event ) {
    if ( event.target === iIMGAlt ) {   // Clicked on iIMGAlt, the alternate image
      iDIVAlt.style.display  = "none";  // Hide the alternate DIV and image
      iDIVMain.style.display = "block"; // Unhide the main DIV and image

    } else {                            // Clicked on one of the main DIV images
      iIMGAlt.src = event.target.src;   // Copy the clicked image to alt
      iIMGAlt.alt = event.target.alt;
      iFIGCAPAlt.innerHTML = iFIGCAP1.innerHTML;

      iDIVMain.style.display = "none";  // Hide the main DIV and image
      iDIVAlt.style.display  = "block"; // Unhide the alternate DIV and image
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
        // This triggers a reload of the current image(s) from the internet.
        iSEL.dispatchEvent( aChangeEvent );
      }
    }
    var t = setTimeout( whatTimeIsIt, msPerSec );
  } // function whatTimeIsIt

 /* **************************************************************** *
  * function toggleTimer()                                           *
  *                                                                  *
  * This function is triggered by the button labeled                 *
  * Pause Timer / Resume TImer.                                      *
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
  * tester is a global array needed by functions                     *
  * populateVTransIMGes and testImageResponse.                       *
  * **************************************************************** */
  var tester = [ "", "", "", "", "" ];

 /* **************************************************************** *
  * function createDivs()                                            *
  *                                                                  *
  * This function creates a DIV inside iDIVMain for numCams cameras. *
  * Finally it creates a not-quite-similar section inside iDIVAlt.   *
  * **************************************************************** */
  function createDivs() {
    const dateNow = Date.now();
    var   newDiv, newImg, iIMGref, newFigure, newFigCap;

    for ( var subCam = 0; subCam < tester.length; subCam++ ) {
      newDiv                 = document.createElement( "div"        );
      newDiv.className       = "col-6 col-s-6 col-m-6 col-l-6 col-xl-6";

      newImg                 = document.createElement( "img"        );
      newImg.id              = `iIMG${subCam}`;
      newImg.src             = "#";
      newImg.alt             = "#";
      newImg.slot            = subCam;
      newImg.onclick         = toggleEmbiggen;

      newDiv.appendChild( newImg );

      iDIVMain.appendChild( newDiv );

      iIMGref                 = eval( `iIMG${subCam}` );
      tester[ subCam ]        = new Image();
      tester[ subCam ].src    = "#";
      tester[ subCam ].alt    = "#";
      tester[ subCam ].slot   = subCam;
      tester[ subCam ].addEventListener( "load",  ( e ) => { testImageResponse( e, iIMGref ); } );
      tester[ subCam ].addEventListener( "error", ( e ) => { testImageResponse( e, iIMGref ); } );
    }

    /* And now for iDIVAlt */
    newFigure              = document.createElement( "figure"     );

    newFigCap              = document.createElement( "figcaption" );
    newFigCap.id           = "iFIGCAPAlt";

    newImg                 = document.createElement( "img"        );
    newImg.id              = "iIMGAlt";
    newImg.src             = "#";
    newImg.alt             = "#";
    newImg.onclick         = toggleEmbiggen;

    newFigure.appendChild( newFigCap );

    iDIVAlt.appendChild( document.createTextNode( "Click on image to exit full screen." ) );
    iDIVAlt.appendChild( newFigure );
    iDIVAlt.appendChild( newImg    );

  } // function createDivs

 /* **************************************************************** *
  * function findSelVal( inVal )                                     *
  *                                                                  *
  * This function returns the 0-origin index into the SELECT OPTION  *
  * array of the HTML <OPTION> tag whose value matches the inVal     *
  * parameter.  The OPTION values look numeric but are really        *
  * 2-character strings "00" to "99", and are not in index order.    *
  *                                                                  *
  * If not found, returns "".                                        *
  * **************************************************************** */
  function findSelVal( inVal ) {
    for ( var index = 0; index < selOpts.length; index++ ) {
      if ( Number( selOpts[ index ].value ) == Number( inVal ) ) {
        return index;
      }
    }
    return "";
  } // function findSelVal

 /* **************************************************************** *
  * function getCamByNum( strCamNum )                                *
  *                                                                  *
  * This function validates its strCamNum parameter as a valid       *
  * camera site identifier, either "" or else "00" to "99".          *
  * If valid, ends with a call to populateVTransIMGes.               *
  * **************************************************************** */
  function getCamByNum( strCamNum ) {
    var newIndex;

    timeLeft  = refreshInterval;

    /* Special case, image is VTrans logo. */
    if ( strCamNum === "" ) {
      iIMG0.src            = iIMGAlt.src            = VTransImageURL;
      iIMG0.alt            = iIMGAlt.alt            = "VTrans jpg image not currently accessible."

      iIMG1.src            = iIMG2.src            = iIMG3.src            = iIMG4.src            = " ";

      iINP_camNumber.value = "";
      newIndex             = 0;
      iSEL.selectedIndex   = newIndex;
      iFIGCAP1.innerHTML   = selOpts[ newIndex ].innerHTML;

      return;
    }

    iFIGCAP1.innerHTML = "";

    const camNum = Number( strCamNum );
    if ( isNaN( camNum ) ) {             // eslint-disable-line no-restricted-globals
      oopsNoSrc( `Hey, ${strCamNum} is not a number.` );
      return;
    }

    if ( !( Number.isInteger( camNum ) && ( camNum >= 0 ) ) ) {
      oopsNoSrc( `Hey, ${camNum} is not a positive whole number.` );
      return;
    }

    iINP_camNumber.value = camNum;
    newIndex = findSelVal( strCamNum );
    if ( newIndex === "" ) {
      oopsNoSrc( `Sorry, ${strCamNum} is not an internal camera number.` );
      return;
    }

    iSEL.selectedIndex = newIndex;
    iFIGCAP1.innerHTML = selOpts[ newIndex ].innerHTML;

    const newValue  = selOpts[ newIndex ].value;
    const newCamNum = `00${newValue}`.slice( -2 );
    populateVTransIMGes( newCamNum );
  } // function getCamByNum

  function oopsNoSrc( reason ) {
      iIMG0.src           = iIMGAlt.src           = " ";
      iIMG0.alt           = iIMGAlt.alt           = reason;
      errorPause              = true;
      iSPANinfo.style.opacity = 0.25;

      iIMG1.src            = iIMG2.src            = iIMG3.src            = iIMG4.src            = " ";
  } // function oopsNoSrc

 /* **************************************************************** *
  * function getCamBySel( event )                                    *
  *                                                                  *
  * The selectedIndex field of iSEL is the new index, used to get    *
  * one <OPTION value=...> value from selOpts, which is a global var *
  * that was harvested by setGlobals() from the <OPTION> tags of     *
  * iSEL.                                                            *
  *                                                                  *
  * **************************************************************** */
  function getCamBySel( event ) {
    timeLeft  = refreshInterval;

    const newIndex = iSEL.selectedIndex;
    var   newValue = Number( selOpts[ newIndex ].value );
    if ( isNaN( newValue ) ) { newValue = ""; }
    iINP_camNumber.value = newValue;
    getCamByNum( newValue );
  }

 /* **************************************************************** *
  * function populateVTransIMGes( strCamNum )                        *
  *                                                                  *
  * This function initiates loading of camera images from site       *
  * number strCamNum.  The asynchronous event listener               *
  * testImageRespons() completes the action, depending on whether it *
  * detects a successful load or an error.                           *
  * **************************************************************** */
  function populateVTransIMGes( strCamNum ) {
    var   URLhead, subCam;
    const URLtail = `.jpg?date=${Date.now()}`;
    var specialCase = false;
    switch( strCamNum ) {
      case "52": // Special case - Bennington US-7
      case "53": // Special case - Waterbury I-89 Exit 10
      case "54": // Special case - Brookfield Gua I-89
      case "55": // Special case - Canada Autoroute 55
        specialCase  = true;
        var cctvKeys = [ "54ad829a024e3a2211065f7d681ea587", "0b8a5cba8bde5560e5ed46e10fc461aa", "a0b534d018aa6e43616fdc83bfcaf2f3", "3b06f3d8cad9452f070ba3a2857b9141" ];
        URLhead      = `http://assets.newengland511.org/cctv/${cctvKeys[ strCamNum - 52 ]}`;
        break;
      default:
        URLhead      = `http://170.222.32.148/rwisimages/Image-7070${strCamNum}-7070${strCamNum}-0-`;
        break;
    }

    if ( specialCase ) {
        tester[ 0 ].src  = `${URLhead}${URLtail}`;
        for ( subCam = 1; subCam < tester.length; subCam++ ) {
          tester[ subCam ].src  = "#";
        }
    } else {
      for ( subCam = 0; subCam < tester.length; subCam++ ) {
        tester[ subCam ].src  = `${URLhead}${subCam}${URLtail}`;
      }
    }
  } // function populateVTransIMGes

 /* **************************************************************** *
  * function testImageResponse( event )                              *
  *                                                                  *
  * This asynchronous event listener hopes to see a successful image *
  * load, and if so, updates the corresponding HTML <IMG> tag in the *
  * document.  The event parameter will be an onload or onerror      *
  * event object for a private HTML <IMG> tag (i.e. an IMG that is   *
  * in memory but not in the document).  We use the "slot" field to  *
  * identify the sub-camera number 0-3, so that the image URL in the *
  * "src" field can be copied into the appropriate <IMG> tag in the  *
  * document.                                                        *
  * **************************************************************** */
  function testImageResponse( event ) {
    // Deconstruct object "event" .type ==> type, .srcElement.src ==> imgURL
    const { type, srcElement: { src: imgURL, slot: subCam } } = event;

   /* ********************************************************** *
    * iIMGRef is a trick to accomplish referencing a variable    *
    * whose name is constructed.  So, when the code says         *
    *     iIMGRef = "iIMG" + "subCam"; (where, say, subCam is 0) *
    *     eval( iIMGRef + ".foo = 'bar';" );                     *
    * that has the effect of                                     *
    *     iIMG0.foo = 'bar';                                     *
    * ********************************************************** */
    const iIMGRef  = `iIMG${subCam}`;

    switch ( type ) {
      case "load":
        eval( `${iIMGRef}.src = '${imgURL}';` );
        eval( `${iIMGRef}.style.opacity = 1;` );
        break;
      case "error":
        if ( subCam == 0 ) {
          eval( `${iIMGRef}.src = VTransNotAvailURL;` );
          eval( `${iIMGRef}.style.opacity = 1;` );
        } else {
          eval( `${iIMGRef}.src = ' ';` );
          eval( `${iIMGRef}.alt = 'SubCamera ${subCam} not currently available.';` );
          eval( `${iIMGRef}.style.opacity = 0;` );
        }
        break;
      default:
        break;
    }

    errorPause = false;
    if ( timerOn ) { iSPANinfo.style.opacity = 1; }

  } // function testImageResponse

 /* **************************************************************** *
  * function nextSel( incr )                                         *
  *                                                                  *
  * Changes the selection for iSEL to the next one up or down.       *
  * Called from the onclick of two (unlabeled) input buttons.        *
  * **************************************************************** */
  function nextSel( incr ) {
    var sel = iSEL.selectedIndex + incr;
    sel = Math.min( sel, iSEL.options.length - 1 );
    sel = Math.max( sel, 0 );
    iSEL.selectedIndex = sel;
    iSEL.dispatchEvent( aChangeEvent );
  } // function nextSel

 /* **************************************************************** *
  * function nextNum( incr )                                         *
  *                                                                  *
  * Changes the number in iINP_camNumber up or down by one.          *
  * Called from the onclick of two input (unlabeled) buttons.        *
  * **************************************************************** */
  function nextNum( incr ) {
    var num = ( ( iINP_camNumber.value === "" ) ? -1 : Number( iINP_camNumber.value ) ) + incr;
    num = Math.min( num, 99 );
    getCamByNum( ( num < 0 ) ? "" : num );
  } // function nextNum

 /* **************************************************************** *
  *                                                                  *
  *                                                                  *
  *                                                                  *
  * **************************************************************** */
