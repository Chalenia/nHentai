// ==UserScript==
// @name         nHentai++
// @namespace    https://github.com/Knuspie/nHentai
// @description  A nHentai Userscript which aims to improve the overall userexperience.
// @author       Knuspie
// @version      2.0
// @match        https://nhentai.to/*
// @icon         https://www.google.com/s2/favicons?domain=nhentai.to
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/2.6.1/jszip.js
// ==/UserScript==
function main() {
    //injections
    document.head.insertAdjacentHTML('afterbegin', '<style>@font-face{font-family:"Oswald";font-style:normal;src:url(https://dl.dropboxusercontent.com/s/b5snuqzzg5rw5pv/Oswald-Regular.ttf?dl=0);}@keyframes open{from{transform:translateY(-100px);} to{transform:translateY(0px);}}.mainContainer{background-color:#323232;user-select:none;font-family:"Oswald";letter-spacing:1px;box-shadow:0 2px 2px -2px rgba(0,0,0,0.5);animation:open 1s;width:100%;}.header{display:flex;justify-content:center;align-content:center;}.button{font-size:15px;display:grid;justify-content:center;align-content:center;color:white;height:50px;margin:0 15px;text-transform:uppercase;}.button:hover{transform:scale(0.8);-webkit-transition:0.2s;transition:0.2s;cursor:pointer;}.button:active{opacity:0.4;-webkit-transition:0.2s;transition:0.2s;}#input{height:20px;position:relative;left:10px;top:15px;text-transform:uppercase;}</style>')
    document.body.insertAdjacentHTML('afterbegin', '<div class="mainContainer"> <div class="header"> <div class="button" id="buttonStart">start</div> <div class="button" id="buttonRandom">random</div> <div class="button" id="buttonClean">home</div> <div class="button" id="buttonCopy">copy url</div> <div class="button" id="buttonOpenSettings">settings</div> <input placeholder="insert Code" id="input" type="text"> </div> </div>')
    document.getElementsByTagName("html")[0].insertAdjacentHTML('afterbegin', '<div id="popup"> <div class="window"> <div class="item"> block ads <label class="switch"> <input id="blockAds" type="checkbox"> <span class="slider"></span> </label> </div> <div class="item"> hide page title <label class="switch"> <input id="hidePageTitle" type="checkbox"> <span class="slider"></span> </label> </div> <div class="item"> better favorite system <label class="switch"> <input id="customFav" type="checkbox"> <span class="slider"></span> </label> </div> <div class="item"> better download system <label class="switch"> <input id="customDow" type="checkbox"> <span class="slider"></span> </label> </div> <div class="item" id="buttonCloseSettings"></div> </div> </div>')
    document.head.insertAdjacentHTML('afterbegin', '<style>#popup{position:fixed;width:100%;height:100%;z-index:99999999999999999999;background-color:rgba(0,0,0,0.3);user-select:none;letter-spacing:1px;}.window{position:fixed;top:50%;left:50%;width:500px;transform:translate(-50%,-50%);padding:20px;background-color:#323232;}.item{color:white;margin-top:10px;font-size:25px;text-align:left;font-family:"Oswald";text-transform:uppercase;}#buttonCloseSettings{color:white;background-color:rgba(0, 0, 0, 0.75);display:flex;justify-content:center;}#buttonCloseSettings::after{content:"close";}#buttonCloseSettings:hover::after{content:"close";transform:scale(0.8);-webkit-transition:0.2s;transition:0.2s;}#buttonCloseSettings:hover{cursor:pointer;}#buttonCloseSettings:active{opacity:0.4;-webkit-transition:0.2s;transition:0.2s;}.switch{position:relative;float:right;width:60px;height:30px;bottom:-3px;}.switch input{opacity:0;width:0;height:0;}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;border-radius:14px;border:2px solid rgba(0, 0, 0, 0.75);-webkit-transition:0.2s;transition:0.2s;}.slider:hover::before{transform:scale(0.8);}.slider:before{position:absolute;content:"";height:19px;width:19px;left:4px;bottom:4px;border-radius:50%;background-color:white;-webkit-transition:0.4s;transition:0.4s;}input:checked + .slider:before{-webkit-transform:translateX(30px);-ms-transform:translateX(30px);transform:translateX(30px);}</style>')

    //onload
    if(GM_getValue("page")) {
        var page = JSON.parse(GM_getValue("page"));
    }else {
        var page = {
            pageTitleEn: [],
            pageTitleJp: [],
            pagePrev: [],
            pageUrl: []
        }
    }
    if(document.title == "Not Found") {
        window.open("https://nhentai.to/","_self");
    }
    const code = window.location.href.replace( /^\D+/g, '')
    document.getElementById("input").value = code
    document.getElementById("popup").style.display = "none"
    document.getElementById("hidePageTitle").checked = GM_getValue("hidePageTitle")
    document.getElementById("blockAds").checked = GM_getValue("blockAds")
    document.getElementById("customFav").checked = GM_getValue("Fav")
    document.getElementById("customDow").checked = GM_getValue("Dow")
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
            GM_setValue("Dow",true);
        }else {
            DowButton(false);
            GM_setValue("Dow",false);
        }
    }
    function DowButton(visible){
        if(visible == true) {
            if(window.location.href == "https://nhentai.to/g/"+code) {
                createDowButton();

                if (typeof(document.getElementById("dowButton")) != "undefined" && document.getElementById("dowButton") != null) {
                    document.getElementById("dowButton").onclick = function(){

                        let pages = []
                        document.querySelectorAll(".thumb-container").forEach(e => {
                            pages.push(e.querySelector("img").getAttribute("data-src"))
                        })

                        var zip = new JSZip();
                        var count = 0;
                        var zipFilename = document.querySelector("#info h1").innerHTML+".zip";

                        pages.forEach(p => {
                            ImagetoDataURL('https://cors-anywhere.herokuapp.com/'+pages[p]).then(dataUrl => {
                                console.log('DataURL:', dataUrl)
                                zip.file(count+"t.jpeg", dataUrl.replace('data:', '').replace(/^.+,/, ''), {base64: true}); //+1
                                count++
                                if (count == pages.length) {
                                    console.log("Done getting Base64 data!")
                                    var content = zip.generate();
                                    location.href="data:application/zip;base64,"+content;
                                }
                            })
                        })

                        
                    }
                }
            }}
        if(visible == false) {
            removeDowButton();
        }
    }
    const ImagetoDataURL = url => fetch(url)
                          .then(response => response.blob())
                          .then(blob => new Promise((resolve, reject) => {
                              const reader = new FileReader()
                              reader.onloadend = () => resolve(reader.result)
                              reader.onerror = reject
                              reader.readAsDataURL(blob)
                          }))
    function createDowButton(){
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
            GM_setValue("Fav",true);
        }else {
            FavButtonMain(false);
            FavButtonSecond(false);
            GM_setValue("Fav",false);
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
    function FavButtonSecond(visible){
        if(visible == true) {
            if(window.location.href == "https://nhentai.to/g/"+code) {
                createFavButton();

                for(var j = 0; j < page.pageUrl.length; j++) {
                    if(window.location.href == page.pageUrl[j]) {
                        document.getElementById("heart").classList.toggle("fa-heart");
                    }
                }

                if (typeof(document.getElementById("favButton")) != "undefined" && document.getElementById("favButton") != null) {
                    document.getElementById("favButton").onclick = function(){
                        document.getElementById("heart").classList.toggle("fa-heart");
                        if(document.getElementById("heart").classList.contains("fa-heart")) {
                            page.pageUrl.push(window.location.href);
                            page.pagePrev.push(document.querySelector('[width="350"]').src);
                            page.pageTitleEn.push(document.querySelector("#info h1").innerHTML);
                            page.pageTitleJp.push(document.querySelector("#info h2").innerHTML);
                            GM_setValue("page", JSON.stringify(page));
                            console.log("saving Page ...");
                        }else {
                            page.pageUrl.splice(page.pageUrl.indexOf(window.location.href), 1);
                            page.pagePrev.splice(page.pagePrev.indexOf(document.querySelector('[width="350"]').src), 1);
                            page.pageTitleEn.splice(page.pageTitleEn.indexOf(document.querySelector("#info h1").innerHTML), 1);
                            page.pageTitleJp.splice(page.pageTitleJp.indexOf(document.querySelector("#info h2").innerHTML), 1);
                            GM_setValue("page", JSON.stringify(page));
                            console.log("removing Page ...");
                        }
                    }
                }
            }}
        if(visible == false) {
            removeFavButton();
        }
    }
    function removeFavButton(){
        var favButton = document.getElementById("favButton");
        if (typeof(favButton) != "undefined" && favButton != null) {
            if(window.location.href == "https://nhentai.to/g/"+code) {
                document.querySelector(".btn-primary.btn-disabled.tooltip").style.display = "inline-block";
                document.querySelector(".buttons").removeChild(favButton);
            }
        }
    }
    function createFavButton(){
        document.querySelector(".btn-primary.btn-disabled.tooltip").style.display = "none";
        const favButton = document.createElement("a");
        favButton.setAttribute("class", "btn-primary");
        favButton.setAttribute("id", "favButton");
        favButton.classList.add("btn");
        document.querySelector(".buttons").prepend(favButton);
        const favIcon = document.createElement("i");
        favIcon.setAttribute("class", "fa");
        favIcon.setAttribute("id", "heart");
        favIcon.setAttribute("style", "margin-right: 5px");
        document.getElementById("favButton").appendChild(favIcon);
        const favName = document.createElement("span");
        favName.innerHTML = "Favorite ";
        document.getElementById("favButton").appendChild(favName);
    }
    function FavButtonMain(visible){
        if(visible == true) {
            if(window.location.href == "https://nhentai.to/") {
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
            }
        }
        if(visible == false) {
            var gallery = document.getElementById("removeGallery");
            var item = document.querySelector(".display");
            if (typeof(gallery) != "undefined" && gallery != null) {
                    document.body.removeChild(gallery);
                    if (typeof(item) != "undefined" && item != null) {
                        document.querySelector(".container.index-container").removeChild(item);
                    }
                    document.querySelector("section.pagination").style.display = "block";
            }
        }
    }
    function hidePageTitle(){
        if (document.getElementById("hidePageTitle").checked) {
            changeFavicon("https://www.google.com/s2/favicons?domain=youtube.com");
            document.title = "YouTube";
            GM_setValue("hidePageTitle",true);
        } else {
            changeFavicon("/favicon.ico");
            document.title = "nhentai : Free Hentai Manga, Doujinshi and Comics Online";
            GM_setValue("hidePageTitle",false);
        }
    }
    function changeFavicon(src) {
        var fav = document.querySelector('[rel="icon"]');
        fav.href = src;
    }
    function blockAds(){
        if (document.getElementById("blockAds").checked) {
            //document.getElementById("nath").style.display = "none";
            if(window.location.href == "https://nhentai.to/g/"+code) {
                document.querySelector("center").style.display = "none";
            }
            GM_setValue("blockAds",true);
        } else {
            //document.getElementById("nath").style.display = "block";
            if(window.location.href == "https://nhentai.to/g/"+code) {
                document.querySelector("center").style.display = "block";
            }
            GM_setValue("blockAds",false);
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
    document.getElementById("blockAds").onclick = function(){blockAds();}
    document.getElementById("customFav").onclick = function(){startFav();}
    document.getElementById("customDow").onclick = function(){startDow();}
}
main();