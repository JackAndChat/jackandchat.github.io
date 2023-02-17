/*!
**|  CyTube Enhancements: Common
**|
**@preserve
*/
/*jshint esversion: 6*/
'use strict';

if (!window[CHANNEL.name]) { window[CHANNEL.name] = {}; }

// Global Variables
let $chatline = $("#chatline");
let $currenttitle = $("#currenttitle");
let $messagebuffer = $("#messagebuffer");
let $userlist = $("#userlist");
let $voteskip = $("#voteskip");
let $ytapiplayer = $("#ytapiplayer");
let _vPlayer = videojs("ytapiplayer");
let messageExpireTime = 1000 * 60 * 2;
let chatExpireTime = 1000 * 60 * 60 * 2;

// ##################################################################################################################################

const formatConsoleMsg = function(desc, data){
  return "[" + new Date().toTimeString().split(" ")[0] + "] " + 
    desc + ": " + JSON.stringify(data);
};

// Send debug msg to console
const debugData = function(desc, data){
  if (!CHANNEL_DEBUG) return;
  window.console.debug(formatConsoleMsg(desc, data));
};

// Send error msg to console
const errorData = function(desc, data){
  window.console.error(formatConsoleMsg(desc, data));
};

// Send log msg to console
const logData = function(desc, data){
  window.console.log(formatConsoleMsg(desc, data));
};

// Admin Debugger
const debugListener = function(eventName, data){ 
  if (eventName.toLowerCase() == "mediaupdate") return;
  window.console.info(formatConsoleMsg(eventName, data));
};

// ##################################################################################################################################

const hmsToSeconds = function(hms) {
  var part = hms.split(':'), secs = 0, mins = 1;
  while (part.length > 0) {
    secs += (mins * parseInt(part.pop(), 10));
    mins *= 60;
  }
  return secs;
};

const secondsToHMS = function(secs){
  let start = 15;
       if (secs >= 36000) { start = 11; }
  else if (secs >= 3600)  { start = 12; }
  else if (secs >= 600)   { start = 14; }
  return new Date(secs * 1000).toISOString().substring(start, 19);
};

// ##################################################################################################################################

// JQuery Wait for an HTML element to exist
const waitForElement = function(selector, callback, checkFreqMs, timeoutMs){
  let startTimeMs = Date.now();
  (function loopSearch(){
    if ($(selector).length) {
      callback();
      return;
    }
    else {
      setTimeout(()=>{
        if (timeoutMs && ((Date.now() - startTimeMs) > timeoutMs)) return;
        loopSearch();
      }, checkFreqMs);
    }
  })();
};

// ##################################################################################################################################

// Get User from UserList
const getUser = function(name){
  let user = null;
  $("#userlist .userlist_item").each(function(index, item) {
    let data = $(item).data();
    if (data.name.toLowerCase() == name.toLowerCase()) { user = data; }
  });
  return user;
};

// Is User Idle?
const isUserAFK = function(name){
  let afk = false;
  let user = getUser(name);
  if (!user) { afk = false; } else { afk = user.meta.afk; }
  return afk;
};

// ##################################################################################################################################

// Remove Video on KICK
window.socket.on("disconnect", function(msg){
  if (!window.KICKED) return;
  removeVideo(event);  
});

// ##################################################################################################################################

//  Room Announcements
const roomAnnounce = function(msg){ 
  if (msg.length < 1) return;
  if (window.CLIENT.rank < 1) return;
  if (BOT_NICK.toLowerCase() == CLIENT.name.toLowerCase()) return;

  $(function() { // Why???
    makeAlert("Message from Admin", msg).attr("id","roomAnnounce").appendTo("#announcements");
  });
};

//  Moderator Announcements
const modAnnounce = function(msg){ 
  if (msg.length < 1) return;
  if (window.CLIENT.rank < 2) return;
  if (BOT_NICK.toLowerCase() == CLIENT.name.toLowerCase()) return;
    
  $(function() { // Why???
    makeAlert("Moderators", msg).attr("id","modAnnounce").appendTo("#announcements");
  });
};

// ##################################################################################################################################

// Remove Video URLs
const hideVideoURLs = function(){
  setTimeout(()=>{
    $(".qe_title").each(function(idx,data){data.replaceWith(data.text);});
    if (window.CLIENT.rank > 1) {
      $("#queue li.queue_entry div.btn-group").hide();
      $("div.btn-group > .qbtn-play").each(function(){ $(this).parent().parent().prepend(this);});
    }
  }, 2000);  
};

if (!IMABOT) {
  window.socket.on("changeMedia", hideVideoURLs);
  window.socket.on("playlist", hideVideoURLs); //
  window.socket.on("setPlaylistMeta", hideVideoURLs);
  window.socket.on("shufflePlaylist", hideVideoURLs);
}

// ##################################################################################################################################

// Change the Video Title

window[CHANNEL.name].VideoInfo = {title: "None", current: 0, duration: 0};

var VIDEO_TITLE = {title: "None", current: 0, duration: 0};

const setVideoTitle = function(){
  if (VIDEO_TITLE.duration < 1) { VIDEO_TITLE.duration = VIDEO_TITLE.current; }
  let remaining = Math.round(VIDEO_TITLE.duration - VIDEO_TITLE.current);
  $currenttitle.html("Playing: <strong>" + VIDEO_TITLE.title + "</strong> &nbsp; (" + secondsToHMS(remaining) + ")");  
};

window.socket.on("mediaUpdate", (data)=>{
  // debugData(formatConsoleMsg("common.mediaUpdate", data));
  VIDEO_TITLE.current = data.currentTime;
  setVideoTitle();
});

const refreshVideo = function(){
  debugData(formatConsoleMsg("common.refreshVideo", window.CurrentMedia));
  
  if (typeof window.CurrentMedia === "undefined") { return; }
  
  try {
    if (window.PLAYER) {
      window.PLAYER.destroy();
    }
  } catch { }

  window.loadMediaPlayer(window.CurrentMedia);

  socket.emit("playerReady");
};

// Player Error Reload
const videoFix = function(){
  debugData("common.videoFix");
  
  var vplayer = videojs("ytapiplayer");
  vplayer.on("error", function(e) {
    errorData("common.Reloading Player", e);
    vplayer.createModal('ERROR: Reloading player!');
    
    window.setTimeout(function(){ refreshVideo(); }, 2000);
  });
};

window.socket.on("changeMedia", (data)=>{
  debugData(formatConsoleMsg("common.changeMedia", data));
  window.CurrentMedia = data;
  VIDEO_TITLE.title = data.title;
  VIDEO_TITLE.current = data.currentTime;
  VIDEO_TITLE.duration = data.seconds;
  setVideoTitle();

  waitForElement("#ytapiplayer", ()=>{
    var newVideo = document.getElementById("ytapiplayer");
    if (newVideo && newVideo.addEventListener) { videoFix(); }
  }, 100, 10000);
});

// ##################################################################################################################################

// Turn AFK off if PMing
const pmAfkOff = function(data){
  if (isUserAFK(CLIENT.name)) {window.socket.emit("chatMsg", { msg: "/afk" });}
};
if (window.CLIENT.rank < 3) { window.socket.on("pm", pmAfkOff); } // Below Admin

// ##################################################################################################################################

// Auto Expire Messages
const autoMsgExpire = function() {
  // Mark Server Messages
  $messagebuffer.find("[class^=chat-msg-\\\\\\$]:not([data-expire])").each(function(){ $(this).attr("data-expire", Date.now() + messageExpireTime);});
  $messagebuffer.find("[class^=server-msg]:not([data-expire])").each(function(){ $(this).attr("data-expire", Date.now() + messageExpireTime);});
  $messagebuffer.find("div.poll-notify:not([data-expire])").attr("data-expire", Date.now() + (messageExpireTime * 2));

  if (window.CLIENT.rank < 2) { // Mark Chat Messages
    $messagebuffer.find("[class*=chat-shadow]:not([data-expire])").each(function(){ $(this).attr("data-expire", Date.now() + messageExpireTime);});
    $messagebuffer.find("[class*=chat-msg-]:not([data-expire])").each(function(){ $(this).attr("data-expire", Date.now() + chatExpireTime);});
  }
  
  // Remove Expired Messages
  $messagebuffer.find("div[data-expire]").each(()=>{
      if (Date.now() > parseInt($(this).attr("data-expire"))) { 
        $(this).remove();
      }});

  if (document.hidden) { // delay if hidden
    $messagebuffer.find("div[data-expire]").each(function(){
      $(this).attr("data-expire", parseInt($(this).attr("data-expire")) + 400);
    });
  }
};

// ##################################################################################################################################

const cacheEmotes = function() {
  for (let loop in CHANNEL.emotes) {
    var _img = document.createElement('img');
    _img.src = CHANNEL.emotes[loop].image;
    _img.onerror = function() {
      window.console.error("Error loading '" + this.src + "'");
    }
  }
}

// ##################################################################################################################################

window[CHANNEL.name].commonMotd = "";

const setCustomMOTD = function() {
  CHANNEL.motd += window[CHANNEL.name].commonMotd;
  $("#motd").html(CHANNEL.motd);
}

const getCustomMOTD = function() {
  $.ajax({
    url: Buttons_URL,
    type: 'GET',
    datatype: 'text',
    cache: false,
    error: function(data){
      errorData('common.getCustomMOTD Error', data.status + ": " + data.statusText);
    },
    success: function(data){
      debugData("common.getCustomMOTD", data);
      window[CHANNEL.name].commonMotd = data;
      setCustomMOTD();
    }
  });
}

window.socket.on("setMotd", (data)=>{
  debugData(formatConsoleMsg("common.socket.on(setMotd)", data));
  setCustomMOTD();
});

// ##################################################################################################################################

//  DOCUMENT READY
$(document).ready(function() {
  hideVideoURLs();
  
  getCustomMOTD();

  // Move Title to full width
  $('<div id="titlerow" class="row" />').insertBefore("#main").html($("#videowrap-header").detach());
  VIDEO_TITLE.title = $currenttitle.text().replace("Currently Playing: ", "");
  setVideoTitle();
  
  $('#plmeta').insertBefore("#queue");
  
  $("p.credit").html("&nbsp;");

  $('<link id="roomfavicon" href="' + Favicon_URL + '?ac=' + START + '" type="image/x-icon" rel="shortcut icon" />').appendTo("head");

  if (ROOM_ANNOUNCEMENT !== null) roomAnnounce(ROOM_ANNOUNCEMENT);
  if (MOD_ANNOUNCEMENT !== null) modAnnounce(MOD_ANNOUNCEMENT);
  setTimeout(()=>{$("#announcements").fadeOut(800, ()=>{$(this).remove();});}, 90000);

  if (typeof ADVERTISEMENT !== "undefined") {
    $("#pollwrap").after('<div id="adwrap" class="col-lg-12 col-md-12">' + ADVERTISEMENT + '</div>');
  }

  window.socket.on("addUser", (data)=>{
    $("#pm-" + data.name + " .panel-heading").removeClass("pm-gone");
    if (BOT_NICK.toLowerCase() != CLIENT.name.toLowerCase()) {
      setTimeout(()=>{ $(".userlist_owner:contains('"+ BOT_NICK + "')").parent().css("display","none"); }, 6000);
    }
  });

  window.socket.on("userLeave", (data)=>{ 
    $("#pm-" + data.name + " .panel-heading").addClass("pm-gone"); 
  });
  
  $(window).on("focus", ()=>{
    $("#chatline").focus();    
  });

  window.setInterval(()=>{  // Check every second
    autoMsgExpire();

    // Remove LastPass Icon. TODO There MUST be a better way!
    $("#chatline").css({"background-image":"none"});
    $(".pm-input").css({"background-image":"none"});
  }, 1000);
  
  if (window.CLIENT.rank > 0) { 
    let modflair = $("#modflair");
    if (modflair.hasClass("label-default")) { modflair.trigger("click"); }

    let chatline = $("#chatline");
    chatline.attr("placeholder", "Type here to Chat");
    chatline.focus();
  }
 
  if (window.CLIENT.rank > 2) { 
    $('<button class="btn btn-sm btn-default" id="clear" title="Clear Chat">Clear</button>')
      .appendTo("#leftcontrols")
      .on("click", function(){
        window.socket.emit("chatMsg", { msg: "/clear", meta: {} });
        refreshVideo();
      });

    $('<button class="btn btn-sm btn-default" id="clean" title="Clean Server Messages">Clean</button>')
      .appendTo("#leftcontrols")
      .on("click", function(){
        $messagebuffer.find("[class^=chat-msg-\\\\\\$server]").each(function(){ $(this).remove(); });
        $messagebuffer.find("[class^=chat-msg-\\\\\\$voteskip]").each(function(){ $(this).remove(); });
        $messagebuffer.find("[class^=server-msg]").each(function(){ $(this).remove(); });
      });
  }
  
  cacheEmotes();
});

/********************  END OF SCRIPT  ********************/
