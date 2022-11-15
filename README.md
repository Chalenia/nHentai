# <img src="./build/icon.ico" style="height:1em"> nHentai++
A nHentai Client which aims to improve the overall userexperience.

## Featurelist
- Built-in ad/tracker blocker (Client only)
- Automatic aspect-ratio changer for reading (Client only)
- Hide page to make sure no one knows what you are doing 😏
- Free favourite feature
- Free download feature (Client only)
- Easy copie url button
- Easy code viewer/changer
- Autoupdater (Soon)

##  How to install
1. Decide whether you want a desktopclient or the browserversion

|   Type  |            Requirement            |            Link            |
| :-----: | :-----------------------------: | :-----------------------------: |
| Client | --- |    [latest release](https://github.com/Knuspie/nHentai/releases/latest)    |
|  Userscript  | [Tampermonkey](https://www.tampermonkey.net/) |     [install](https://github.com/Knuspie/nHentai/raw/main/userscript/nHentai%2B%2B.user.js)     |

2. - Click the link to install the userscript
   - Download and run the setup.exe
   - Download and run the already installed exe from the portable version

## Develop locally
### Dev Dependencies
```
npm i electron --save-dev
npm i electron-builder
```
### Dependencies
```
npm i @cliqz/adblocker-electron
npm i jszip@2.6.1
npm i request
npm i cross-fetch
npm i electron-store
```
### Start
```
npm start
```
