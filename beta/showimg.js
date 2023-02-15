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

/*
https://iframe.ly/api/iframely?api_key=d160d7c38aa4a3a3371b0c&url=https%3A%2F%2Fwww.flickr.com%2Fphotos%2F9somboon%2F35071348993%2Fin%2Fexplore-2017-07-12%2F

https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.hawtcelebs.com%2Fwp-content%2Fuploads%2F2020%2F02%2Femma-roberts-at-2020-vanity-fair-oscar-party-in-beverly-hills-02-09-2020-4.jpg&f=1&nofb=1&ipt=2cb299ec8c2e5bf2f1c530546ffabe8ff0c28208b6f8ae0f51351de3c8d76ffc&ipo=images

const imageExtensions = 'a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".pnj"], ' + 
  'a[href*=".gif"], a[href*=".gifv"], a[href*=".svg"], a[href*=".svgz"], a[href*=".webm"], a[href*=".webp"]';

$('#myModal').append($('<img>',{id:'img01',class:'modal-content',src:'theImg.png'}))
$('<img>',{id:'img01',class:'modal-content',$img.attr('src')})

<div id="myModal" class="modal">
  <span class="imgClose">&times;</span>
  <img class="modal-content" id="img01">
</div>

<a href="https://download.samplelib.com/mp4/sample-5s.mp4" target="_blank" rel="noopener noreferrer">
  <video muted="" inline="" style="max-height: 72px; max-width: 160px;" title=" Click to Open in a Tab" src="https://download.samplelib.com/mp4/sample-5s.mp4" type="video/mp4"></video>
  </a>

<a href="http://docs.google.com/gview?url=https://sifr.in/img/292/1/courseAndroid.xlsx&embedded=true">Open your excel file</a>

  $zoomImgMsg.find(videoExtensions).each(function() {
    let thisParent = $(this).parent();
    errorData("showChatImg.this", this.toString());
    errorData("showChatImg.this", thisParent.html());
    
    var ext = 'mp4';
    if (this.toString().toLowerCase().includes(".webm")) { ext = 'webm'; }
    if (this.toString().toLowerCase().includes(".ogg"))  { ext = 'ogg'; }
    
    var video = `<a href="#" rel="noopener noreferrer" onClick='window.open("` + this.href + `");return false;'>` +
      '<video muted inline style="max-height: 72px; max-width: 160px;" src="' + this.href + '" type="video/' + ext + '"  title=" Click to Open in a Tab" /></a>';
    thisParent.html(video)
  });

*/
