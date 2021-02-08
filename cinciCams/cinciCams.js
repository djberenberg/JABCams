/* ************************************************************************* *
 * CinciCams                                                                 *
 * =========                                                                 *
 * This is a hand-coded web page that displays traffic camera images in the  *
 * greater Cincinnati OH area.  The HTML, the CSS, and the JavaScript are    *
 * all original by me and I make no copyright or ownership stipulations.     *
 * Note that the camera images that I link to are not mine, but are instead  *
 * from web sites operated by departments of the states of Ohio or Kentucky. *
 *                                                                           *
 * -John Berenberg, January 2020.                                            *
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
          iSEL, iFIGCAP1, iFIGCAP2, iIMG0, iIMG1 */

/* ************************************************************************* *
 * End of validation configuration, start of actual code.                    *
 * ************************************************************************* */

/* **************************************************************** *
 * Global variables                                                 *
 * **************************************************************** */
  const msPerSec          =    1000;
  const keyCodeEnter      =      13;  // event.keycode for the Enter key
  const nbsp              = "\u00A0"; // &nbsp; No-break space

  const logosURL          = "logos.png";
  const VTransNotAvailURL = "unavail.png";
  const HeadARTIMIS       = "https://itscameras.dot.state.oh.us/images/artimis/";
  const HeadCCTV          = "https://itscameras.dot.state.oh.us/images/artimis/CCTV";
  const HeadFEMM          = "https://itscameras.dot.state.oh.us/images/artimis/FEMM";
  const HeadCINCI         = "https://itscameras.dot.state.oh.us/images/cincinnati/";
  const HeadKYTC          = "http://www.trimarc.org/images/milestone/CCTV";
/* http://www.trimarc.org/dat/WebCameras.json */

  var   refreshInterval   =   10;             /* Seconds */
  var   timeLeft          = refreshInterval;  /* Seconds before refresh      */

  var   timerOn           = true;             /* Is the refresh timer active */
  var   errorPause        = false;

  var   selOpts;                              /* The drop-down OPTION array in iSEL */
  var   gIndexN, gIndexE, gIndexW, gIndexS;

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
  * iBTN_refresh     BUTTON to trigger an immediate refresh          *
  * iSEL             SELECT drop-down                                *
  * iFIGCAP1         FIGCAPTION to show camera site text             *
  * iIMG0            IMG for camera 0                                *
  * iIMG1            IMG for maximum size                            *
  *                                                                  *
  * **************************************************************** */

 /* **************************************************************** *
  * function setGlobals()                                            *
  *                                                                  *
  * This function is triggered from <BODY onload=...>                *
  * **************************************************************** */
  function setGlobals() {
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
      var key = e.key || e.keyCode;
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
    * This event listener intercepts the four keyboard arrow keys    *
    * and maps them to clicks on the N/E/S/W buttons.  You can click *
    * click on the buttons or you can key in the arrows.             *
    * ************************************************************** */
    document.onkeyup = ( e ) => {
      var key = e.key || e.keyCode;
      switch ( key ) {
        case "ArrowLeft":
        case "Left":
        case 37:
          e.preventDefault();
          e.view.event.preventDefault();
          iBTN_W.click();
          break;
        case "ArrowUp":
        case "Up":
        case 38:
          e.preventDefault();
          e.view.event.preventDefault();
          iBTN_N.click();
          break;
        case "ArrowRight":
        case "Right":
        case 39:
          e.preventDefault();
          e.view.event.preventDefault();
          iBTN_E.click();
          break;
        case "ArrowDown":
        case "Down":
        case 40:
          e.preventDefault();
          e.view.event.preventDefault();
          iBTN_S.click();
          break;
        default:
          break;
      } // switch
    }; // anonymous function

   /* ************************************************************** *
    * This event listener responds to a changed selection, whether   *
    * by user mouse click or by programmatic dispatchEvent.          *
    * ************************************************************** */
    iSEL.onchange = ( e ) => {
      getCamBySel( e );
    }; // anonymous function

   /* ************************************************************** *
    * This call loads the default ODOT/KYTC logo image during        *
    * initialization.                                                *
    * ************************************************************** */
    iSEL.dispatchEvent( aChangeEvent );

   /* ************************************************************** *
    * onclick event listeners for iIMG0 and iIMG1.                   *
    *                                                                *
    * Note that the syntax here does not perform toggleEmbiggen.     *
    * Instead it assigns the function named toggleEmbiggen to the    *
    * onclick handler of each IMG object.  Then when the onclick     *
    * event occurs, toggleEmbiggen( event ) is called.  The event    *
    * object identifies which IMG got the click.                     *
    * ************************************************************** */
    iIMG0.onclick = toggleEmbiggen;
    iIMG1.onclick = toggleEmbiggen;

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
    if ( event.target == iIMG0 ) {      // Clicked on iIMG0, the main image
      iDIVMain.style.display = "none";  // Hide the main DIV and image
      iIMG0.style.opacity    = 0;

      iDIVAlt.style.display  = "block"; // Unhide the alternate DIV and image
      iIMG1.style.opacity    = 1;
    } else {                            // Clicked on iIMG1, the alternate image
      iDIVAlt.style.display  = "none";  // Hide the alternate DIV and image
      iIMG1.style.opacity    = 0;

      iDIVMain.style.display = "block"; // Unhide the main DIV and image
      iIMG0.style.opacity    = 1;
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
  * function findSelVal( inType, inVal )                             *
  *                                                                  *
  * For this script, the <OPTION value=...> items of the HTML        *
  * <OPTION> tag are 4-part strings, with parts delimited by ;'s,    *
  * e.g. "type;val;fie;fum".                                         *
  *                                                                  *
  * This function returns the 0-origin index into the items, of the  *
  * first 4-segment string whose "type" and "val" segments are exact *
  * string matches to the inType and inVal parameters.               *
  *                                                                  *
  * If not found, returns "".                                        *
  * **************************************************************** */
  function findSelVal( inType, inVal ) {
    var nextOpt, nextType, nextVal;
    for ( var index = 0; index < selOpts.length; index++ ) {
      [ nextOpt ]           = selOpts[ index ].value.split( "|" );
      [ nextType, nextVal ] =                nextOpt.split( ";" );
      if ( inType === "" ) {
        if ( Number( nextVal ) == Number( inVal ) ) {
          return index;
        }
      } else if (    ( nextType === inType )
                  && ( Number( nextVal ) == Number( inVal ) ) ) {
          return index;
      }
    }
    return "";
  } // function findSelVal

 /* **************************************************************** *
  * getCamByNum and iBTN_refresh                                      *
  *                                                                  *
  * There are two functions for selecting a camera and loading its   *
  * images for display.  The important one is ...BySel, and it is    *
  * primarily triggered whenever the user clicks in the iSEL drop-   *
  * down list.  All of the supported camera locations are in that    *
  * list.                                                            *
  *                                                                  *
  * The ...BySel function has no parameters.  It retrieves the index *
  * of the selected item, and then the encoded description of the    *
  * camera at that index.                                            *
  *                                                                  *
  * The ...ByNum function is not as useful.  Some of the encoded     *
  * descriptions include a number assigned by the authority          *
  * responsible for the camera, and this function looks through the  *
  * whole iSEL list for an encoded description containing that       *
  * number.  There are two shortcomings.  First, not every camera    *
  * is assigned such a number, so no camera is found.  Second, some  *
  * numbers are the same from different camera authorities, so only  *
  * the first one is found.                                          *
  *                                                                  *
  * **************************************************************** */

 /* **************************************************************** *
  * function getCamByNum( strCamNum )                                *
  * **************************************************************** */
  function getCamByNum( strCamNum ) {
    var newIndex;

    timeLeft = refreshInterval;

    /* Special case, image is ODOT/KYTC logo. */
    if ( strCamNum === "" ) {
      iIMG0.src            = iIMG1.src            = logosURL;
      iIMG0.alt            = iIMG1.alt            = "ODOT/KYTC png image not currently accessible.";
      iIMG0.style.width    = iIMG1.style.width    = "100%";
      iIMG0.style.maxwidth = iIMG1.style.maxwidth = "100%";
      iIMG0.style.opacity  = iIMG1.style.opacity  = 1;

      iINP_camNumber.value = "";
      newIndex             = 0;
      iSEL.selectedIndex   = newIndex;
      iFIGCAP1.innerHTML   = selOpts[ newIndex ].innerHTML;
      iFIGCAP2.innerHTML   = nbsp;

      populateCompass( 0 );
      return;
    }

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
    newIndex = findSelVal( "", strCamNum );
    if ( newIndex === "" ) {
      oopsNoSrc( `Sorry, ${strCamNum} is not an internal camera number.` );
      return;
    }

    const [ newOpt ] = selOpts[ newIndex ].value.split( "|" );
    const [ newType,          , newCamSfx, newLgCam ] = newOpt.split( ";" );
    var   [        , newCamNum ]                      = newOpt.split( ";" );

    iIMG0.alt = iIMG1.alt = "Camera not currently available.";

    iSEL.selectedIndex = newIndex;
    iFIGCAP1.innerHTML = selOpts[ newIndex ].innerHTML;
    iFIGCAP2.innerHTML = iINP_camNumber.value;

    if ( newType === "KYTC" ) {
      newCamNum = `0000${newCamNum}`.slice( -4 );
    } else {
      newCamNum =  `000${newCamNum}`.slice( -3 );
    }

    populateCompass( newIndex );
    populateODOTIMGes( newType, newCamNum, newCamSfx, newLgCam );
  } // function getCamByNum

  function oopsNoSrc( reason ) {
    iIMG0.src           = iIMG1.src           = " ";
    iIMG0.alt           = iIMG1.alt           = reason;
    iIMG0.style.opacity = iIMG1.style.opacity = 1;
    errorPause              = true;
    iSPANinfo.style.opacity = 0.25;
  } // function oopsNoSrc

 /* **************************************************************** *
  * function getCamBySel( event )                                    *
  *                                                                  *
  * The selectedIndex field of iSEL is the new index, used to get    *
  * one <OPTION value=...> value from selOpts, which is a global var *
  * that was harvested by setGlobals() from the <OPTION> tags of     *
  * iSEL.                                                            *
  *                                                                  *
  * The value at the selectedIndex is a 4-segment string, with       *
  * segments delimited by ;'s, e.g. "type;val;suffix1;suffix2".      *
  *                                                                  *
  * The value "type" segment is a clue to how to construct the URL   *
  * of a camera image, because there are a number of different       *
  * schemes used by camera issuing authorities.                      *
  *                                                                  *
  * CCTV :                                                           *
  *   val is a 3- or 4-digit string identifying a particular Artimis *
  *     CCTV camera number, e.g. "035" or "4110".                    *
  *   suffix1 is a (possibly empty) suffix for the camera number,    *
  *     sometimes "a", but sometimes "-5" or other.                  *
  *   suffix2 is a (possibly empty) additional suffix, typically     *
  *     "-L", to generate an alternate URL referencing a larger      *
  *     camera image, if one exists.  If suffix2 is empty, the base  *
  *     URL is used for both images, but the large image gets        *
  *     stretched.                                                   *
  *   The key portions of the URLs will be                           *
  *     images/artimis/CCTV<val><suffix1>.jpg                        *
  *     images/artimis/CCTV<val><suffix1><suffix2>.jpg               *
  *                                                                  *
  * ARTIMIS :                                                        *
  *   val is ""                                                      *
  *   suffix1 is an arbitrary string pasted into the URL             *
  *   suffix2 is ""                                                  *
  *   The key portion of the URL will be                             *
  *     images/artimis/<suffix1>.jpg                                 *
  *                                                                  *
  * CINCI :                                                          *
  *   val is ""                                                      *
  *   suffix1 is an arbitrary string pasted into the URL             *
  *   suffix2 is ""                                                  *
  *   The key portion of the URL will be                             *
  *     images/cincinnati/<suffix1>.jpg                              *
  *                                                                  *
  * FEMM :                                                           *
  *   val is a 3-digit string identifying a particular               *
  *     Fields-Ertel/Mason-Montgomery camera number, e.g. "159".     *
  *   suffix1 is ""                                                  *
  *   suffix2 is ""                                                  *
  *   The key portion of the URL will be                             *
  *     images/artimis/FEMM<val>.jpg                                 *
  *                                                                  *
  * KYTC :                                                           *
  *   val is a 4-digit string identifying a particular Kentucky      *
  *     camera number, e.g. "0180".                                  *
  *   suffix1 is assigned by KY, perhaps "06" or "09" or other       *
  *   suffix2 is a route identifier, say "71" or "US68"              *
  *   The key portion of the URL will be                             *
  *     images/milestone/CCTV_<suffix1>_<suffix2>_<val>.jpg          *
  *                                                                  *
  * **************************************************************** */
  function getCamBySel( event ) {
    var newIndex;

    timeLeft  = refreshInterval;

    newIndex  = iSEL.selectedIndex;
    const [ newOpt ]                                  = selOpts[ newIndex ].value.split( "|" );
    const [ newType, newCamNum, newCamSfx, newLgCam ] =                    newOpt.split( ";" );

    /* Special case, image is ODOT logo. */
    if ( ( newType === "none" ) || ( newType === "" ) ) {
      iIMG0.src            = iIMG1.src            = logosURL;
      iIMG0.alt            = iIMG1.alt            = "ODOT/KYTC png image not currently accessible.";
      iIMG0.style.width    = iIMG1.style.width    = "100%";
      iIMG0.style.maxwidth = iIMG1.style.maxwidth = "100%";
      iIMG0.style.opacity  = iIMG1.style.opacity  = 1;

      iINP_camNumber.value = "";
      newIndex             = 0;
      iSEL.selectedIndex   = newIndex;
      iFIGCAP1.innerHTML   = selOpts[ newIndex ].innerHTML;
      iFIGCAP2.innerHTML   = nbsp;

      populateCompass( 0 );
      return;
    }

    iIMG0.alt = iIMG1.alt = "Camera not currently available.";

    iINP_camNumber.value  = ( newCamNum === "" ) ? "" : Number( newCamNum );
    iFIGCAP1.innerHTML    = selOpts[ newIndex ].innerHTML;
    iFIGCAP2.innerHTML    = nbsp;

    populateCompass( newIndex );
    populateODOTIMGes( newType, newCamNum, newCamSfx, newLgCam );
  } // function getCamBySel

 /* **************************************************************** *
  * This function dispatches a change event in the direction         *
  * indicated by the last arrow key press (or mouse click).          *
  * **************************************************************** */
  function driveThisWay( event ) {
    switch ( event.srcElement ) {
      case iBTN_N:
        iSEL.selectedIndex = gIndexN;
        break;
      case iBTN_E:
        iSEL.selectedIndex = gIndexE;
        break;
      case iBTN_W:
        iSEL.selectedIndex = gIndexW;
        break;
      case iBTN_S:
        iSEL.selectedIndex = gIndexS;
        break;
      default:
        return;
    }
    iSEL.dispatchEvent( aChangeEvent );
  }

 /* **************************************************************** *
  * This function populates the NSEW compass on the screen with the  *
  * locations adjacent to passed selected target index.              *
  * **************************************************************** */
  function populateCompass( selIndex ) {
    var newData, newType, newLoc, newLab;
    var direction, gIndexRef, iBTNRef, iSPANRef;

    const compassData  = selOpts[ selIndex ].value.split( "|" );
    const compassDataL = compassData.length;

    iBTN_N.disabled         =
    iBTN_E.disabled         =
    iBTN_S.disabled         =
    iBTN_W.disabled         = true;
    iBTN_N.style.opacity    =
    iBTN_E.style.opacity    =
    iBTN_S.style.opacity    =
    iBTN_W.style.opacity    = 0.25;
    iSPANcompassN.innerText =
    iSPANcompassE.innerText =
    iSPANcompassS.innerText =
    iSPANcompassW.innerText = "";

    if ( compassDataL < 2 ) { return; }

    for ( var index = 1; index < compassDataL; index++ ) {
      direction = "-NESW"[ index ];
      gIndexRef = `gIndex${direction}`;
      iBTNRef   = `iBTN_${direction}`;
      iSPANRef  = `iSPANcompass${direction}`;

      newData   = compassData[ index ];
      if ( newData !== "" ) {
        [ newType, newLoc, newLab ] = newData.split( ";" );

        switch ( newType ) {
          case "INCR":
            eval( `${gIndexRef}             = Number( iSEL.selectedIndex ) + Number( newLoc );` );
            eval( `${iBTNRef}.disabled      = false  ;` );
            eval( `${iBTNRef}.style.opacity = 1      ;` );
            eval( `${iSPANRef}.innerText    = newLab ;` );
            break;
          case "CCTV":
          case "FEMM":
          case "KYTC":
            eval( `${gIndexRef}             = findSelVal( newType, newLoc );` );
            eval( `${iBTNRef}.disabled      = false  ;` );
            eval( `${iBTNRef}.style.opacity = 1      ;` );
            eval( `${iSPANRef}.innerText    = newLab ;` );
            break;
          case "ALPH":
            eval( `${gIndexRef}             = findAlph(  newLoc );` );
            eval( `${iBTNRef}.disabled      = false  ;` );
            eval( `${iBTNRef}.style.opacity = 1      ;` );
            eval( `${iSPANRef}.innerText    = newLab ;` );
            break;
          default:
            break;
        } // switch ( newType )
      } // if ( newData !== "" )
    } // for
  } // function populateCompass

 /* **************************************************************** *
  * This function searhes selOpts for the first one with type        *
  * ARTIMIS or CINCI having a string matching the locStr parameter.  *
  * **************************************************************** */
  function findAlph( locStr ) {
    var nextOpt, nextLoc;
    for ( var index = 0; index < selOpts.length; index++ ) {
      [ nextOpt ]     = selOpts[ index ].value.split( "|" );
      [ , , nextLoc ] =                nextOpt.split( ";" );
      if ( nextLoc === locStr ) {
        return index;
      }
    }
    return "";
  } // function findAlph

 /* **************************************************************** *
  * tester is a global array needed by functions                     *
  * populateODOTIMGes and testImageResponse.                         *
  * **************************************************************** */
  var tester = [ "", "" ];

 /* **************************************************************** *
  * function populateODOTIMGes( strType, strCamNum, camSfx, lgCam )  *
  *                                                                  *
  * This function initiates loading of camera images from site       *
  * number strCam.  The asynchronous event listener                  *
  * testImageResponse() completes the action, depending on whether   *
  * it detects a successful load or an error.                        *
  * **************************************************************** */
  function populateODOTIMGes( strType, strCamNum, camSfx, lgCam ) {
    var   URLhead, URLsm, URLlg;
    const URLtail = `.jpg?date=${Date.now()}`;
    switch ( strType ) {
      case "CCTV":
        URLhead = HeadCCTV;
        URLsm   = URLhead + strCamNum + camSfx         + URLtail;
        URLlg   = URLhead + strCamNum + camSfx + lgCam + URLtail;
        break;
      case "FEMM":
        URLhead = HeadFEMM;
        URLsm   = URLhead + strCamNum + URLtail;
        URLlg   = URLsm;
        break;
      case "KYTC":
        URLhead = HeadKYTC;
        URLsm   = `${URLhead}_${camSfx}_${lgCam}_${strCamNum}${URLtail}`;
        URLlg   = URLsm;
        break;
      case "ARTIMIS":
        URLhead = HeadARTIMIS;
        URLsm   = URLhead + camSfx + URLtail;
        URLlg   = URLsm;
        break;
      case "CINCI":
        URLhead = HeadCINCI;
        URLsm   = URLhead + camSfx + URLtail;
        URLlg   = URLsm;
        break;
      default:
        break;
    }

    tester[ 0 ]     = new Image();
    tester[ 0 ].src = URLsm;
    tester[ 0 ].alt = `Camera number ${strCamNum} not currently available.`;
    tester[ 0 ].addEventListener( "load",  ( e ) => { testImageResponse( e, iIMG0 ); } );
    tester[ 0 ].addEventListener( "error", ( e ) => { testImageResponse( e, iIMG0 ); } );

    tester[ 1 ]     = new Image();
    tester[ 1 ].src = URLlg;
    tester[ 1 ].alt = `Camera number ${strCamNum} not currently available.`;
    tester[ 1 ].addEventListener( "load",  ( e ) => { testImageResponse( e, iIMG1 ); } );
    tester[ 1 ].addEventListener( "error", ( e ) => { testImageResponse( e, iIMG1 ); } );
  } // function populateODOTIMGes

 /* **************************************************************** *
  * function testImageResponse( event )                              *
  *                                                                  *
  * This asynchronous event listener hopes to see a successful image *
  * load, and if so, updates the corresponding HTML <IMG> tag in the *
  * document.  The event parameter will be an onload or onerror      *
  * event object for a private HTML <IMG> tag (i.e. an IMG that is   *
  * in memory but not in the document).                              *
  * **************************************************************** */
  function testImageResponse( event, iIMGRef ) {
    // Deconstruct object "event" .type ==> type, .srcElement.src ==> imgURL
    const { type, srcElement: { src: imgURL } } = event;

    switch ( type ) {
      case "load":
        iIMGRef.src = imgURL;
        break;
      case "error":
        iIMGRef.src = VTransNotAvailURL;
        break;
      default:
        break;
    }

    iIMGRef.style.width    = "100%";
    iIMGRef.style.maxwidth = "100%";
    iIMGRef.style.opacity  =  1;

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
    getCamByNum( ( num < 0 ) ? "" : num );
  } // function nextNum

 /* **************************************************************** *
  *                                                                  *
  *                                                                  *
  *                                                                  *
  * **************************************************************** */
