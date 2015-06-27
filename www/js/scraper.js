
//var allowedItems = ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'content', 'src', 'class']
var allowedItems = ['span', 'blockquote', 'content', 'h4', 'src', 'class', 'title'];
var type = null;
var writeOn = false;
var sectionExists = false;
var all = "";
querySelector = document.getElementById("results");
querySelector.innerHTML = "<div>";

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
  yql_query += " and xpath='//div[@class=\"widget Blog\"]'";

  Z.YQL(yql_query, function(response) {  
    if(response.query.results){

      var contents = response.query.results.div;

      //console.log(contents);
      var count = 0;
      traverse(contents,process, count);

    }else{
      console.log("No stories");
    }
  });
}


function process(key,value) {
  //console.log(key + " : "+value);
}


function traverse(o,func, count) {
  for (var i in o) {
    //func.apply(this,[i,o[i]]);  
    if (o[i] !== null){

      if(typeof(o[i])=="object") {
        //going on step down in the object tree!!
        traverse(o[i],func, count);
      }else{
        // Check the type to be able to wrap properly
        checkType(i, o[i]);
        if(writeOn){
          ++count;
          var t_c = wrap(i, o[i]);
          
          if(t_c != false){
            all += t_c;
          }

        }
      }
    }
  }
}

// Returns section content
function wrap (e, c) {

  if (allowedItems.indexOf(e) != -1) {

    var section_content = "";
    if (type != 'comments') {
      
      if (e == 'src') {
        // Images And Video
        // Image
        var ext = c.split('.');
        ext = ext[ext.length-1];
        if (ext == 'jpg' || ext == 'png') {
          section_content += wrapImage(c);
          type = null;
        }else{
          if (ext != 'gif') {
            section_content += wrapVideo(c);
            type = null;
          }
        }
      }

      else if (e == 'content') {
        // Text
        if (type == 'author') {
          section_content += wrapAuthor(c);
          type = null;
          return;
        }else{
          if (c.length > 5)
            section_content += wrapContent(c);
        }
      }

      else if (e == 'span') {
        // Probably date
        if (type == 'date') {
          section_content += wrapDate(c);
          type = null;
        }
      }
    }else{
      // Comments
      if (e == 'class' && c == 'comments') {
        type = 'comments';
      }

      if (e == 'h4') {
        //console.log(wrapNoOfComments(c))
      }
      
      if (e == 'content') {
        //console.log(c)
      }
    }
    return section_content;
  }else
    return false;
}

function checkType (e, c) {
  if (e == 'class' && c == 'post-title entry-title') {
    writeOn = true;
  }
  if (e == 'content' && c == 'Linda Ikeji') {
    writeOn = false;

    querySelector.innerHTML += "<div class='section'>" +all +"</div>";
    all = "";
  }

  if (e == 'class' && c == 'date-header') {
    type = 'date'
  }
  if (e == 'rel' && c == 'author') {
    type = 'author'
  }
}

function wrapVideo (video) {
  return "<div class='video'><iframe src='" + video+ "' allowfullscreen='true' frameborder='0' width='100%' style='min-height:300px;'></iframe></div>";
}
function wrapImage(obj) {
  var uniqid = randId ();
  //return "<img style='width:100%;margin-bottom:3px;' id='" +uniqid+ "' class='image_items' src='" + obj + "' />" ;
  return "<div class='image'><img id='" +uniqid+ "' class='image_items' src='" + obj + "' /></div>" ;
}
function wrapAuthor (author) {
  //return author;
  return "<div class='author'>" +author+ "</div>";
}
function wrapContent (text) {
  //return clean(text);
  return "<div class='story'><div class='story_content'>" +clean(text)+ "</div></div>";
}
function wrapDate (date) {
  return date;
  //return "<div class='date'>" +date+ "</div>";
}
function wrapNoOfComments (num) {
  return num;
  //return "<div class='no-of-comments'>" +num+ "</div>";
}

function randId () {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now() + Math.floor(Math.random() * 26);
  return uniqid;
}
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}
function clean(obj){
  obj = replaceAll('"', '\"', obj);
  obj = replaceAll('&#39;', '\'', obj);
  return replaceAll('\n', '', obj);
}



























