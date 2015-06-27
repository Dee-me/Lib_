var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("deviceready", function () {
            document.addEventListener("menubutton", menuKeyDown, true);
        }, false);
        function menuKeyDown() {
          alert('Menu button pressed.');
        }
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


app.initialize();

var navOn = 0;
var animate = true;
var resultWidth = 0;
var resultHeight = 0;
var contentWidth = 0;
var contentHeight = 0;
var h = 0;
var w = 0;

$(document).ready(function(){
    h = $(window).height() - 50;
    contentHeight = h - 30;
    w = $(window).width() - 20;
    contentWidth = w - 10;
    $("#results").css("height", h+'px');
    $("#results").css("width", w+'px');
    $("#content").css("height", contentHeight+'px');
    $("#content").css("width", contentWidth+'px');
    $(".main").css("display", "block");
    //$("#content").css("marginLeft", (contentWidth+40)+'px');
    loadStories();
});

$(window).resize(function() {
    var h = $(window).height() - 50;
    contentHeight = h - 30;
    var w = $(window).width() - 20;
    contentWidth = w - 10;
    $("#results").css("height", h+'px');
    $("#results").css("width", w+'px');
    $("#content").css("height", contentHeight+'px');
    $("#content").css("width", contentWidth+'px');
});

function animateMove () {
  if (animate == true) {
    $("#results").animate({"marginLeft" : "-"+(w+20)}, 300);
    $("#content").animate({"marginLeft" : "10px"}, 300);
  }
  else{
    $("#results").css("marginLeft", "-"+(w+20));
    $("#content").css("marginLeft", "10px");
  }
}

function animateReverse () {
  if (animate == true) {
    $("#content").animate({"marginLeft" : (contentWidth+40)+'px' }, 300);
    $("#results").animate({"marginLeft" : "0px"}, 300);
  }
  else{
    $("#content").css("marginLeft", (contentWidth+40)+'px');
    $("#results").css("marginLeft", "0px");
  }
}

function toggleNav(){
  if (navOn == 0)
    showNav();
  else
    hideNav();
  closeSettings();
}

function disableAnimations () {
  animate = false;
  closeSettings();
  document.getElementById("dis_anim").style.display = "none";
  document.getElementById("e_anim").style.display = "block";
}
function enableAnimations () {
  animate = true;
  closeSettings();
  document.getElementById("e_anim").style.display = "none";
  document.getElementById("dis_anim").style.display = "block";
}

function launchSettings () {
  if (navOn == 1)
    hideNav();
  document.getElementById("settings").className = "settings-open";
}

function closeSettings () {
  document.getElementById("settings").className = "settings-close";
}

function showNav () {
  if (animate) {
    document.getElementById("overlay").className = "show-nav-op";
    document.getElementById("nav").className = "show-nav";
  }else{
    document.getElementById("overlay").className = "na-show-nav-op";
    document.getElementById("nav").className = "na-show-nav";
  }
  navOn = 1;
}
function hideNav () {
  if (animate) {
    document.getElementById("nav").className = "hide-nav";
    document.getElementById("overlay").className = "hide-nav-op";
  }else{
    document.getElementById("nav").className = "na-hide-nav";
    document.getElementById("overlay").className = "na-hide-nav-op";
  }
  navOn = 0;
}
