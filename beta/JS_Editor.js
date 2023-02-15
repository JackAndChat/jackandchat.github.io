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
var BETA_USERS = ['jackandchatbot','lisaqtee'];
var TRIVIA = false;

var HIGHLIGHT = ['HIGHLIGHTS'];

var ADVERTISEMENT = '<a href="http://www.swinglifestyle.com/?signup=FunWorksCouple" target="_blank">' + 
  '<img src="//www.swinglifestyle.com/login/sls_bannera_3a.jpg" alt="SwingLifeStyle" border="0"></a>' +
  '<br /><a href="http://www.swinglifestyle.com/?signup=FunWorksCouple" target="_blank">Sponsor</a>';

// ##################################################################################################################################
if (!window[CHANNEL.name]) { window[CHANNEL.name] = {}; }

$.getScript("https://jackandchat.github.io/beta/loader.js");
