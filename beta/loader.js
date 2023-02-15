/*!
**|  JS Library Loader
**|
**@preserve
*/
/*jshint esversion: 6*/
'use strict';

if (!window[CHANNEL.name]) { window[CHANNEL.name] = {}; }

//  Channel Settings->Edit->JavaScript: $.getScript("{root}/www/{jac.}loader.js");

// Defaults
var START = Date.now();
if (typeof CUSTOM_LOADED === "undefined") { var CUSTOM_LOADED = false; }
if (typeof ChannelName_Caption === "undefined") { var ChannelName_Caption = CHANNELNAME; }
if (typeof Room_ID === "undefined") { var Room_ID = "jac"; }
if (typeof ALLOW_GUESTS === "undefined") { var ALLOW_GUESTS = true; }
if (typeof MUTE_GUESTS === "undefined") { var MUTE_GUESTS = false; }
if (typeof LOAD_BOT === "undefined") { var LOAD_BOT = false; }
if (typeof BOT_NICK === "undefined") { var BOT_NICK = "JackAndChatBot"; }
if (typeof ROOM_ANNOUNCEMENT === "undefined") { var ROOM_ANNOUNCEMENT = ""; }
if (typeof MOD_ANNOUNCEMENT === "undefined") { var MOD_ANNOUNCEMENT = ""; }
if (typeof CLEAR_MSG === "undefined") { var CLEAR_MSG = ""; }
if (typeof CHANNEL_DEBUG === "undefined") { var CHANNEL_DEBUG = false; }
if (typeof BETA_USER === "undefined") { var BETA_USER = false; }
if (typeof BETA_USERS === "undefined") { var BETA_USERS = []; }

var IMABOT = (CLIENT.name.toLowerCase() == BOT_NICK.toLowerCase());

if (!IMABOT) { 
  if ((CLIENT.rank >= Rank.Moderator) || (BETA_USERS.includes(CLIENT.name.toLowerCase()))) { 
    BETA_USER = true; 
  }
}

let Base_URL = "https://cdn.jsdelivr.net/gh/jackandchat/cytube@latest/www/";
let Room_URL = Base_URL + Room_ID + "/";
let MOTD_URL = Base_URL; // CORS Workaround
let Logo_URL =  Room_URL + "logo.png";
let Favicon_URL = Room_URL + "favicon.png";

// ##################################################################################################################################

if (Room_ID.toLowerCase() === 'jac') { // Alpha Debug Room
  CHANNEL_DEBUG = true;

  Base_URL = "https://raw.githubusercontent.com/jackandchat/cytube/main/beta/";
  Room_URL = Base_URL;
  
  if (IMABOT) {
    window.localStorage.clear();
  }
}

// ##################################################################################################################################

window[CHANNEL.name].jsScriptsIdx = 0;
window[CHANNEL.name].jsScripts = [
  Base_URL + "common.js",
  Base_URL + "showimg.js"
];

// ----------------------------------------------------------------------------------------------------------------------------------
const jsScriptsLoad = function(){ // Load Javascripts in order
  if (window[CHANNEL.name].jsScriptsIdx < window[CHANNEL.name].jsScripts.length) {
    let filename = window[CHANNEL.name].jsScripts[window[CHANNEL.name].jsScriptsIdx];

    $.getScript(filename)
      .done(function(script, textStatus) {
        window.console.log("loader.getScript " + filename + ": " + textStatus );
        window[CHANNEL.name].jsScriptsIdx++;
        jsScriptsLoad();  // Recurse
      })
      .fail(function(jqxhr, settings, exception) {
        if(arguments[0].readyState==0){
          window.console.error(filename + " FAILED to load!");
        } else {
          window.console.error(filename + " loaded but FAILED to parse! " + arguments[2].toString());
        }
      });
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------
const loadCSS = function(filename){
  try {
    $("head").append('<link rel="stylesheet" type="text/css" href="' + filename + '?ac=' + START + '" />');
  } catch (e) {
    window.console.error("loader.loadCSS error: " + filename + " - " + JSON.stringify(e));
  }
};

// ##################################################################################################################################

if (!CUSTOM_LOADED) { // Load Once 
  CUSTOM_LOADED = true;
  
  if (!ALLOW_GUESTS && (CLIENT.rank > 0)) {
    window[CHANNEL.name].jsScripts.push(Base_URL + "noguests.js");
  }

  if (IMABOT) {
    if (CHANNEL_DEBUG) {
      window[CHANNEL.name].jsScripts.push(Base_URL + "dbLocal.js");
    }
    window[CHANNEL.name].jsScripts.push(Base_URL + "roombot.js");
  }

  if (BETA_USER) { 
    window[CHANNEL.name].jsScripts.push(Base_URL + "betterpm.js");
  }

  jsScriptsLoad();

  // ----------------------------------------------------------------------------------------------------------------------------------
  $(document).ready(()=>{
    $(".navbar-brand").replaceWith('<span class="navbar-brand">' + ChannelName_Caption + "</span>");
    $("ul.navbar-nav li:contains('Home')").remove();
    $("ul.navbar-nav li:contains('Discord')").remove();
    
    loadCSS(Base_URL + "base.css");
  });
}

// ##################################################################################################################################
/* End of Script */
