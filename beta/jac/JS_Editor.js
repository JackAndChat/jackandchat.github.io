/*!
**|  CyTube Customizations
**|   
**@preserve
*/

var ChannelName_Caption = 'Jack & Chat';
var Room_ID = 'jac';

var ALLOW_GUESTS = true;
var LOAD_BOT = true;

var CHANNEL_DEBUG = true;
var AGE_RESTRICT = true;

var BETA_USERS = ['jackandchatbot','lisaqtee'];
var TRIVIA = false;

var HIGHLIGHT = ['HIGHLIGHTS'];

var ADVERTISEMENT = `<a href="http://www.swinglifestyle.com/?signup=FunWorksCouple" target="_blank">` + 
  `<img src="//www.swinglifestyle.com/login/sls_bannera_3a.jpg" alt="SwingLifeStyle" border="0"></a>` +
  `<br /><a href="http://www.swinglifestyle.com/?signup=FunWorksCouple" target="_blank">Sponsor</a>`;

var ROOM_ANNOUNCEMENT = `<br /><span style="color:blue;font-weight:bold;">Welcome back!</span> ` +
  `Cytu.be is closing down rooms again, so we moved to Cytube.XYZ<br /><br />` +
  `Please don't post the link to this room on Cytu.be... It will get you <strong>kicked off!</strong><br /><br />` +
  `Instead post this friendly shortened link: `+
  `<a target="_blank" style="font-weight:bold" href="https://s.lain.la/SDYgW">https://s.lain.la/SDYgW</a> <br /><br />` +
  `<p><strong>Spread the word</strong> like these girls spread their legs and <strong>Happy Jacking!</strong></p>`;

var MOD_ANNOUNCEMENT = `Lisa is on vacation until March 13th. If there are any problems send an email to <strong>admin@jackandchat.net</strong><br />Thanks!`;

var CLEAR_MSG = `Here is a list of other rooms https://s.lain.la/pQ2Z0 `;

var MOTD_MSG = `<br /><span style="color:orange">Here is a list of other rooms <a style="color:orange;font-weight:600" target=_blank" href="https://s.lain.la/pQ2Z0">https://s.lain.la/pQ2Z0</a></span>`;

// ##################################################################################################################################
if (!window[CHANNEL.name]) { window[CHANNEL.name] = {}; }

$.getScript("https://jackandchat.github.io/beta/loader.js");
