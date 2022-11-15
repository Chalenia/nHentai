const {ipcRenderer} = require("electron")

window.addEventListener('DOMContentLoaded',async () => {
    //code variable
    let code = window.location.href.replace( /^\D+/g, '')
  if (code.includes("/")) code = window.location.href.replace( /^\D+/g, '').substring(0,window.location.href.replace( /^\D+/g, '').indexOf("/"));

  //aspect-ratio
  //if(window.location.href.includes('https://nhentai.to/g/'+code+"/")) ipcRenderer.send("size",660,970);
  //else ipcRenderer.send("size",1200,780);

  if(window.location.href.includes('https://nhentai.to/g/'+code+"/")) ipcRenderer.send("size",2.9,1.05);
  else ipcRenderer.send("size",1.6,1.3);

  //injections
  document.head.insertAdjacentHTML('afterbegin', '<style>@font-face{font-family:"Oswald";font-style:normal;src:url(https://dl.dropboxusercontent.com/s/b5snuqzzg5rw5pv/Oswald-Regular.ttf?dl=0);}@keyframes open{from{transform:translateY(-100px);} to{transform:translateY(0px);}}.mainContainer{background-color:#323232;user-select:none;font-family:"Oswald";letter-spacing:1px;box-shadow:0 2px 2px -2px rgba(0,0,0,0.5);animation:open 1s;width:100%;}.header{display:flex;justify-content:center;align-content:center;}.button{font-size:15px;display:grid;justify-content:center;align-content:center;color:white;height:50px;margin:0 15px;text-transform:uppercase;}.button:hover{transform:scale(0.8);-webkit-transition:0.2s;transition:0.2s;cursor:pointer;}.button:active{opacity:0.4;-webkit-transition:0.2s;transition:0.2s;}#input{height:20px;position:relative;left:10px;top:15px;text-transform:uppercase;}</style>')
  document.body.insertAdjacentHTML('afterbegin', '<div class="mainContainer"> <div class="header"> <div class="button" id="buttonClean">home</div> <div class="button" id="buttonCopy">copy url</div> <div class="button" id="buttonOpenSettings">settings</div> <div class="button" id="buttonRandom">random</div> <div class="button" id="buttonStart">start</div> <input placeholder="insert Code" id="input" type="text"> </div> </div>')
  document.getElementsByTagName("html")[0].insertAdjacentHTML('afterbegin', '<div id="popup"> <div class="window"> <div class="item"> hide page <label class="switch"> <input id="hidePageTitle" type="checkbox"> <span class="slider"></span> </label> </div> <div class="item"> free favorites <label class="switch"> <input id="customFav" type="checkbox"> <span class="slider"></span> </label> </div> <div class="item"> free downloads <label class="switch"> <input id="customDow" type="checkbox"> <span class="slider"></span> </label> </div> <div class="item"> block ads/tracker <label class="switch"> <input id="blockAds" type="checkbox"> <span class="slider"></span> </label> </div> <div class="item" id="buttonCloseSettings"></div> </div> </div>')
  document.head.insertAdjacentHTML('afterbegin', '<style>#popup{position:fixed;width:100%;height:100%;z-index:99999999999999999999;background-color:rgba(0,0,0,0.3);user-select:none;letter-spacing:1px;}.window{position:fixed;top:50%;left:50%;width:500px;transform:translate(-50%,-50%);padding:20px;background-color:#323232;}.item{color:white;margin-top:10px;font-size:25px;text-align:left;font-family:"Oswald";text-transform:uppercase;}#buttonCloseSettings{color:white;background-color:rgba(0, 0, 0, 0.75);display:flex;justify-content:center;}#buttonCloseSettings::after{content:"close";}#buttonCloseSettings:hover::after{content:"close";transform:scale(0.8);-webkit-transition:0.2s;transition:0.2s;}#buttonCloseSettings:hover{cursor:pointer;}#buttonCloseSettings:active{opacity:0.4;-webkit-transition:0.2s;transition:0.2s;}.switch{position:relative;float:right;width:60px;height:30px;bottom:-3px;}.switch input{opacity:0;width:0;height:0;}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;border-radius:14px;border:2px solid rgba(0, 0, 0, 0.75);-webkit-transition:0.2s;transition:0.2s;}.slider:hover::before{transform:scale(0.8);}.slider:before{position:absolute;content:"";height:19px;width:19px;left:4px;bottom:4px;border-radius:50%;background-color:white;-webkit-transition:0.4s;transition:0.4s;}input:checked + .slider:before{-webkit-transform:translateX(30px);-ms-transform:translateX(30px);transform:translateX(30px);}i#download,i#heart {transform: translate(-50%, 0%);}.hop {animation: hop 1.2s infinite;}@keyframes hop {0% { transform: translate(-50%, -0%) scale(1.25, 0.75); }50% { transform: translate(-50%, -100%) scale(1, 1); }55% { transform: translate(-50%, -100%) rotate(15deg); }60% { transform: translate(-50%, -100%) rotate(-15deg); }65% { transform: translate(-50%, -100%) rotate(15deg); }70% { transform: translate(-50%, -100%) rotate(-15deg); }100% { transform: translate(-50%, -0%) scale(1.25, 0.75); }}#dowButton {background-color: #475d73!important;}.btn {user-select: none;}</style>')

  //custom icon
  let chance = Math.floor(Math.random() * 20);
  if (chance <= 1) {
    document.querySelector('img[src="/img/logo.650c98bbb08e.svg"]').removeAttribute("width")
    document.querySelector('img[src="/img/logo.650c98bbb08e.svg"]').removeAttribute("height")
    document.querySelector('img[src="/img/logo.650c98bbb08e.svg"]').src = "https://media.tenor.com/P-8ZvqnS4AwAAAAM/dancing-cat-dancing-kitten.gif";
    const fix = document.createElement("style");
    document.head.appendChild(fix);
    fix.innerHTML = 'nav .logo {padding:0!important} img[src="https://media.tenor.com/P-8ZvqnS4AwAAAAM/dancing-cat-dancing-kitten.gif"] {height: 100%}';
  }
  //onload
  if(await ipcRenderer.invoke("getSetting","page") == undefined) {
    var page = {
      pageTitleEn: [],
      pageTitleJp: [],
      pagePrev: [],
      pageUrl: []
    }
  }else {
    var page = JSON.parse(await ipcRenderer.invoke("getSetting","page"));
  }
  if(document.title == "Not Found") {
      window.open("https://nhentai.to/","_self");
  }
  if(window.location.href.includes("/g/")) document.getElementById("input").value = code;
  document.getElementById("popup").style.display = "none"
  document.getElementById("hidePageTitle").checked = await ipcRenderer.invoke("getSetting","hidePageTitle")
  document.getElementById("blockAds").checked = await ipcRenderer.invoke("getSetting","blockAds")
  document.getElementById("customFav").checked = await ipcRenderer.invoke("getSetting","Fav")
  document.getElementById("customDow").checked = await ipcRenderer.invoke("getSetting","Dow")
  startFav()
  startDow()
  hidePageTitle()
  blockAds()

  //functions
  function getNewFileHandle(){
    const opts = {
    types: [{
        description: 'Text file',
        accept: {'text/plain': ['.txt']},
        }],
   };
   return window.showSaveFilePicker(opts);
}
function startDow(){
    if (document.getElementById("customDow").checked) {
        DowButton(true);
        ipcRenderer.send("setSetting","Dow",true)
    }else {
        DowButton(false);
        ipcRenderer.send("setSetting","Dow",false)
    }
}
function DowButton(visible){
    if(visible == true) {
        if(window.location.href == "https://nhentai.to/g/"+code) {
            createDowButton();

            if (typeof(document.getElementById("dowButton")) != "undefined" && document.getElementById("dowButton") != null) {
                document.getElementById("dowButton").onclick = function(){
                    document.querySelector("i#download").classList.add("hop");
                    let pages = []
                    document.querySelectorAll(".thumb-container").forEach(e => {
                        let el = e.querySelector("img").getAttribute("data-src")
                        pages.push(el.substring(0,el.length-5)+".jpg")
                    })
                    ipcRenderer.send("zip",pages)
                }
            }
        }}
    if(visible == false) {
        removeDowButton();
    }
}
ipcRenderer.on("zipLink",(event,url) => {
    var link = document.createElement('a');
    link.href = url;
    link.download = code+".zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    document.querySelector("i#download").classList.remove("hop");
})
const ImagetoDataURL = url => fetch(url)
                      .then(response => response.blob())
                      .then(blob => new Promise((resolve, reject) => {
                          const reader = new FileReader()
                          reader.onloadend = () => resolve(reader.result)
                          reader.onerror = reject
                          reader.readAsDataURL(blob)
                      }))
function createDowButton(){
    if(window.location.href == "https://nhentai.to/g/"+code) {
        document.querySelector(".btn.btn-secondary.btn-disabled.tooltip").style.display = "none";
        const dowButton = document.createElement("a");
        dowButton.setAttribute("class", "btn-secondary");
        dowButton.setAttribute("id", "dowButton");
        dowButton.classList.add("btn");
        document.querySelector(".buttons").append(dowButton);
        const dowIcon = document.createElement("i");
        dowIcon.setAttribute("class", "fa");
        dowIcon.setAttribute("id", "download");
        dowIcon.classList.add("fa-download");
        document.getElementById("dowButton").appendChild(dowIcon);
        const dowName = document.createElement("span");
        dowName.innerHTML = " Download";
        document.getElementById("dowButton").appendChild(dowName);
    }
}
function removeDowButton(){
    var dowButton = document.getElementById("dowButton");
    if (typeof(dowButton) != "undefined" && dowButton != null) {
        if(window.location.href == "https://nhentai.to/g/"+code) {
            document.querySelector(".btn.btn-secondary.btn-disabled.tooltip").style.display = "inline-block";
            document.querySelector(".buttons").removeChild(dowButton);
        }
    }
}
function startFav(){
    if (document.getElementById("customFav").checked) {
        FavButtonMain(true);
        FavButtonSecond(true);
        ipcRenderer.send("setSetting","Fav",true)
    }else {
        FavButtonMain(false);
        FavButtonSecond(false);
        ipcRenderer.send("setSetting","Fav",false)
    }
}
function addComic(pageUrl,pagePrev,pageTitleEn){
    if(window.location.href == "https://nhentai.to/") {
        const comicContainer = document.createElement("div");
        comicContainer.setAttribute("class", "gallery");
        comicContainer.classList.add("display");
        comicContainer.setAttribute("id", "container_"+pageUrl.replace( /^\D+/g, ''));
        document.querySelector(".container.index-container").appendChild(comicContainer);
        const comicCover = document.createElement("a");
        comicCover.setAttribute("class", "cover");
        comicCover.setAttribute("id", "cover_"+pageUrl.replace( /^\D+/g, ''));
        comicCover.setAttribute("href", pageUrl);
        comicCover.style.padding = "0 0 142.79999999999998% 0";
        document.querySelector("#container_"+pageUrl.replace( /^\D+/g, '')).appendChild(comicCover);
        const comicImg = document.createElement("img");
        comicImg.setAttribute("class", "lazyload");
        comicImg.setAttribute("is", "lazyload-image");
        comicImg.setAttribute("width", "250");
        comicImg.setAttribute("height", "357");
        comicImg.src = pagePrev;
        document.getElementById("cover_"+pageUrl.replace( /^\D+/g, '')).appendChild(comicImg);
        const comicCaption = document.createElement("div");
        comicCaption.setAttribute("class", "caption");
        comicCaption.innerHTML = pageTitleEn;
        document.getElementById("cover_"+pageUrl.replace( /^\D+/g, '')).appendChild(comicCaption);
    }
}
function toggleHeart() {
    const heart = document.getElementById("heart").classList
    if (heart.contains("fas")) {
        heart.remove("fas")
        heart.add("far")
    }
    else {
        heart.remove("far")
        heart.add("fas")
    }
}
function FavButtonSecond(visible){
    if(visible == true && window.location.href == "https://nhentai.to/g/"+code) {
        
            createFavButton();

            for(var j = 0; j < page.pageUrl.length; j++) {
                if(window.location.href == page.pageUrl[j]) toggleHeart()
                    
                
            }

            if (typeof(document.getElementById("favButton")) != "undefined" && document.getElementById("favButton") != null) {
                document.getElementById("favButton").onclick = function(){
                    toggleHeart();
                    if(document.getElementById("heart").classList.contains("fas")) {
                        page.pageUrl.push(window.location.href);
                        page.pagePrev.push(document.querySelector('[width="350"]').src);
                        page.pageTitleEn.push(document.querySelector("#info h1").innerHTML);
                        page.pageTitleJp.push(document.querySelector("#info h2").innerHTML);
                        ipcRenderer.send("setSetting","page", JSON.stringify(page));
                        document.getElementById("heart").classList.add("hop")
                        console.log("saving Page ...");
                        setTimeout(() => {
                            document.getElementById("heart").classList.remove("hop")
                        }, 1000);
                    }else {
                        page.pageUrl.splice(page.pageUrl.indexOf(window.location.href), 1);
                        page.pagePrev.splice(page.pagePrev.indexOf(document.querySelector('[width="350"]').src), 1);
                        page.pageTitleEn.splice(page.pageTitleEn.indexOf(document.querySelector("#info h1").innerHTML), 1);
                        page.pageTitleJp.splice(page.pageTitleJp.indexOf(document.querySelector("#info h2").innerHTML), 1);
                        ipcRenderer.send("setSetting","page", JSON.stringify(page));
                        console.log("removing Page ...");
                    }
                }
            }
    }   
    if(visible == false && window.location.href == "https://nhentai.to/g/"+code) {
        removeFavButton();
    }
}
function removeFavButton(){
    var favButton = document.getElementById("favButton");
    if (typeof(favButton) != "undefined" && favButton != null && window.location.href == "https://nhentai.to/g/"+code) {
        
            document.querySelector(".btn-primary.btn-disabled.tooltip").style.display = "inline-block";
            document.querySelector(".buttons").removeChild(favButton);
        
    }
}
function createFavButton(){
    if(window.location.href == "https://nhentai.to/g/"+code) {
        document.querySelector(".btn-primary.btn-disabled.tooltip").style.display = "none";
    const favButton = document.createElement("a");
    favButton.setAttribute("class", "btn-primary");
    favButton.setAttribute("id", "favButton");
    favButton.classList.add("btn");
    document.querySelector(".buttons").prepend(favButton);
    const favIcon = document.createElement("i");
    favIcon.setAttribute("class", "far fa-heart");
    favIcon.setAttribute("id", "heart");
    favIcon.setAttribute("style", "margin-right: 5px");
    document.getElementById("favButton").appendChild(favIcon);
    const favName = document.createElement("span");
    favName.innerHTML = "Favorite ";
    document.getElementById("favButton").appendChild(favName);
    }
}
function FavButtonMain(visible){
    if(visible == true && window.location.href == "https://nhentai.to/") {
        
            const removeGallery = document.createElement("style");
            document.body.appendChild(removeGallery);
            removeGallery.setAttribute("id", "removeGallery");
            removeGallery.innerHTML = ".gallery {display:none}.display {display:inline-block!important}";
            document.querySelector("section.pagination").style.display = "none";

            for(var i = 0; i < page.pageTitleEn.length; i++){
                var pageTitleEn = page.pageTitleEn[i];
                var pageTitleJp = page.pageTitleJp[i];
                var pagePrev = page.pagePrev[i];
                var pageUrl = page.pageUrl[i];
                addComic(pageUrl,pagePrev,pageTitleEn);
            }

            if (document.querySelector(".display") == null) {
                const txtContainer = document.createElement("div");
                txtContainer.setAttribute("class", "gallery");
                txtContainer.classList.add("display");
                txtContainer.setAttribute("style", "margin-bottom: 0em!important");
                txtContainer.innerHTML = "No hentais on your favorite list";
                document.querySelector(".container.index-container").appendChild(txtContainer);
            }

            setTimeout(() => {
                if (document.querySelector(".display") && document.querySelector(".display").querySelector("img").src == 'https://nhentai.to/null') {
                    for (let i = 0; i < document.querySelectorAll(".display").length; i++) {
                        const el = document.querySelectorAll(".display")[i];
                        el.querySelector("img").src = page.pagePrev[i]
                    }
                }
            }, 900);
        
    }
    if(visible == false && window.location.href == "https://nhentai.to/") {
        let gallery = document.getElementById("removeGallery");
        if (gallery) document.body.removeChild(gallery);
        let item = document.querySelectorAll(".display");
        if (typeof(item) != "undefined" && item != null) {
            item.forEach(el => {
                el.remove();
            })
        }
        document.querySelector("section.pagination").style.display = "block";
    }
}
function hidePageTitle(){
    if (document.getElementById("hidePageTitle").checked) {
        ipcRenderer.send("changeIcon","yt")
        document.title = "YouTube";
        ipcRenderer.send("setSetting","hidePageTitle",true);
    } else {
        ipcRenderer.send("changeIcon","nH")
        document.title = "nhentai : Free Hentai Manga, Doujinshi and Comics Online";
        ipcRenderer.send("setSetting","hidePageTitle",false);
    }
}
function blockAds(){
    let ads = ["#nath",'#content','#message','center','div[style*="z-index:9999999"]','div[style*="display:none"]']
    if (document.getElementById("blockAds").checked) {
        ads.forEach(el => {
            if (document.querySelector(el) == undefined || document.querySelector(el) == null) return
            document.querySelector(el).remove()
        })
        ipcRenderer.send("setSetting","blockAds",true);
    } else {
        ipcRenderer.send("setSetting","blockAds",false);
    }
}
function searchPage(){
    var value = document.getElementById("input").value;
    window.open("https://nhentai.to/g/"+value,"_self");
}
function randomPage(){
    var value = Math.floor(Math.random() * 999999);
    window.open("https://nhentai.to/g/"+value,"_self");
}
function cleanPage(){
    document.getElementById("input").value = "";
    window.open("https://nhentai.to/","_self");
}
function copyUrl(){
    const textarea = document.createElement("textarea");
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.value = window.location.href;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}
function openSettings(){
    document.getElementById("popup").style.display = "block";
    document.querySelector("body").style.filter = "blur(3px)";
}
function closeSettings(){
    document.getElementById("popup").style.display = "none";
    document.querySelector("body").style.filter = "none";
}

//onclick functions
document.getElementById("buttonStart").onclick = function(){searchPage();};
document.getElementById("input").addEventListener("keypress", function(e) {if (e.keyCode == 13) searchPage();});
document.getElementById("buttonRandom").onclick = function(){randomPage();};
document.getElementById("buttonClean").onclick = function(){cleanPage();};
document.getElementById("buttonCopy").onclick = function(){copyUrl();};
document.getElementById("buttonOpenSettings").onclick = function(){openSettings();};
document.getElementById("buttonCloseSettings").onclick = function(){closeSettings();};
document.getElementById("hidePageTitle").onclick = function(){hidePageTitle();}
document.getElementById("blockAds").onclick = function(){blockAds(); ipcRenderer.send("relaunch")}
document.getElementById("customFav").onclick = function(){startFav();}
document.getElementById("customDow").onclick = function(){startDow();}
})