/*!
**|  CyTube Enhancements: Show Images in Chat
**|
**@preserve
*/
/*jshint esversion: 6*/
'use strict';

var $zoomImgMsg = $("#messagebuffer");

var zoomImgCSS = `
<style>
.zoomImg {
  cursor: zoom-in;
  transition: 0.3s;
  max-height: 72px;
  max-width: 160px;
}
.zoomImg:hover {opacity: 0.85;}

.zoomImgModal {
  display: none;
  cursor: zoom-out;
  position: fixed;
  z-index: 10000;
  padding-top: 10px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: black;
  background-color: rgba(0,0,0,0.6);
}
.zoomedImg {
  margin: auto;
  display: block;
  max-width: 100%;
  max-height: 100%;
  -webkit-animation-name: zoom;
  -webkit-animation-duration: 0.2s;
  animation-name: zoom;
  animation-duration: 0.2s;
}

@-webkit-keyframes zoom {
  from {-webkit-transform:scale(0)} 
  to {-webkit-transform:scale(1)}
}
@keyframes zoom {
  from {transform:scale(0)} 
  to {transform:scale(1)}
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px){
  .zoomedImg {
    width: 100%;
  }
}
</style>
`;

const imageExtensions = 'a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".pnj"], ' + 
  'a[href*=".gif"], a[href*=".gifv"], a[href*=".svg"], a[href*=".svgz"], a[href*=".webp"]';

$('head').append(zoomImgCSS);
$('footer').after('<div id="zoomImgModal" class="zoomImgModal"></div>');
var $zoomImgModal = $('#zoomImgModal');

const showChatImg = function() {
  if ($(window).width() <= 700) { return; }

  $zoomImgMsg.find(imageExtensions).each(function() {
    let skip = false;
    if ((this.href.indexOf("imgur.com") > -1) ||
        (this.href.indexOf("redgifs.com") > -1)) {
      skip = true;
    }

    if (!skip) {
      var img = $('<img>',{class:'zoomImg',rel:'noopener noreferrer',title:'Click to Zoom',alt:'Bad Image'})
        .attr('src', encodeURI(this.href))
        .on('click', function(){
          let popImg = $('<img>',{class:'zoomedImg',title:'Click to Close',src:encodeURI($(this).attr("src"))});
          $zoomImgModal.html('').append(popImg).on('click', function(){$zoomImgModal.css({"display":"none"}).html('');});
          $zoomImgModal.css({"display":"block"});
        })
        .load(()=>{ scrollChat(); });
        
      $(this).parent().html(img);
    }
  });
}

$(document).ready(function() {
  window.socket.on('chatMsg', (data)=>{
    if (typeof data === 'undefined') return;
    if (data === null) return;
    if (typeof data.msg === 'undefined') return;
    if (data.msg === null) return;
    if (data.msg.includes('https')) { showChatImg(); }
  });
  showChatImg();
});
