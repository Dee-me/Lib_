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

/*
rossgerbasi.glass.getLaunchParams(
    function(results) {
        console.log(results);
    },
    function () {
        console.log("Error getting launch Params");
    }
);
*/



var links = [];
var xml_content = "";
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

function setXmlContent (content) {
  xml_content = content+"<br />";
}

function loadStories(){
  YUI().use('node', 'event', 'yql', function(Y) {

    var news_url = "http://lindaikeji.blogspot.com/";  
    var yql_query = "select * from html where url='" + news_url+ "'";
    yql_query += " and xpath='//h3[@itemprop=\"name\"]'";
    querySelector = document.getElementById("results");
    querySelector.innerHTML = "";

    Y.YQL(yql_query, function(response) {  
      if(response.query.results){

        var count = 0;
        var wrap_count = 0;
        var content_links = response.query.results.h3;
        for (var i = 0; i < content_links.length; i++){

          var story;
          YUI().use('node', 'event', 'yql', function(Z) {
            var link = content_links[i].a.href;
            getIndividualStory(link, Z, i); 
          });
        }
      }else{
        console.log("No stories");
      }
    });
  });
}

function getIndividualStory (link, Z, all_count) {
  var yql_query = "select * from html where url='" + link + "'";
  yql_query += " and xpath='//h2[@class=\"date-header\"] | //h3[@class=\"post-title entry-title\"] | //div[@itemprop=\"description articleBody\"]'";

  Z.YQL(yql_query, function(response) {  
    if(response.query.results){

      var contents = response.query.results.div;
      var dates = response.query.results.h2;
      var titles = response.query.results.h3;

      
    }else{
      console.log("No stories");
    }
  });
}
var icount = 0;
function wrapSection (stories, count) {
  
  if (count%5 == 0){
    ++icount;
    if (icount > 1)
      return "<div class='wrap-sections' id='wrap_section_"+count+"'>" + stories + "</di>";
    else
      return stories;
  }else{
    if (icount > 1)
      return "<div class='wrap-sections' id='wrap_section_"+count+"'>" + stories + "</di>";
    else
      return stories;
  }
}

function showFullStory (date, title, images, video, this_story) {
  var story = "<div class='date'>" + date +"</div>";
  story += "<div class='title'>" + title + "</div>";

  images = images.split(',');
  var temp = "";
  for (var i = 0; i < images.length; i++) {
    if (images[i] != undefined)
      temp += "<img style='width:100%;margin-bottom:3px;' src='" + images[i] + "' />";
  };
  story += "<div class='images'>" + temp + "</div>";
  if (video != "")
    story += "<div class='video'><iframe src='" + video + "' allowfullscreen='true' frameborder='0' width='100%' style='min-height:300px;'></iframe></div>";
  story += "<div class='story-content'>" + this_story + "</div>";
  document.getElementById("content").innerHTML = story;
  showC();
}

function showC () {
  if (animate) {
    document.getElementById('results').className='show_content_r';
    document.getElementById('content').className='show_content_c';
  }else{
    document.getElementById('results').className='na-hide_result';
    document.getElementById('content').className='na-show_content';
  }
}

function hideC () {
  if (animate) {
    document.getElementById('results').className='hide_content_r';
    document.getElementById('content').className='hide_content_c';
  }else{
    document.getElementById('content').className='na-hide_content';
    document.getElementById('results').className='na-show_result';
  }
  closeSettings();
}

function wrapCleanse(obj) {
  obj = replaceAll('&#39;', '\'', obj);
  obj = replaceAll('See more photos after the cut...', '', obj);
  obj = replaceAll('See the photos after the cut...', '', obj);
  return replaceAll('\n', '', obj);
}

function wrapReplace(obj){
  obj = replaceAll('&#39;', '\'', obj);
  return replaceAll('\n', '', obj);
}

function wrap (obj) {
  return obj ;
}
function wrapImages(obj) {
  var uniqid = randId ();
  return "<img class='image_items' src='" + obj + "' />" ;
}

function randId () {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now() + Math.floor(Math.random() * 26);
  return uniqid;
}

function toggleFullImage (elem) {
  var e = document.getElementById(elem);
  if (e.style.maxHeight == "50px")
    if (animate)
      $("#"+elem).animate({'maxHeight': '700px'}, 400);
    else
      $("#"+elem).css('maxHeight', '700px');
  else
    if (animate)
      $("#"+elem).animate({'maxHeight': '50px'}, 400);
    else
      $("#"+elem).css('maxHeight', '50px');
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function has (object, res) {
  return (object.hasOwnProperty(res)) ? true : false;
}
