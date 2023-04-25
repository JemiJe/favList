Simple react app for making favorite items list (library)

Features:
- adding item (name, tag, folder, image...)
- tagging items (with autocompleting) and rating
- grouping items with folders
- editing items and adding images with autosearch
- quick search and sorting items (by date adding, rating, etc.)
- responsive design that fits wide and mobile screens
- syncing and updating item in server (need further configuration) among all devices
- exporting items to json

demo is available https://cool-starburst-a5c397.netlify.app/
demo video https://www.youtube.com/playlist?list=PLAYtmBXs-WeZho1qmv6bOozRYS5mAWM8h

for first connection to server, set `"isAlredyExists":false,`<br>

example of backup server url:<br>
```
  "synchServers": [
    {
      "isAlredyExists": true,
      "isPost": false,
      "isWithoutImgs": true,
      "getUrl": "https://(apiKey).mockapi.io/api/v1/(customName)",
      "putUrl": "https://(apiKey).mockapi.io/api/v1/(customName)/1",
      "postUrl": "https://(apiKey).mockapi.io/api/v1/(customName)",
      "deleteUrl": ""
    }
  ]
```
example of custom search options:<br>
```
  "googleCustomSearch": [
    {
      "apiKey": "...",
      "cx": "...",
      "name": "one"
    },
    {
      "apiKey": "...",
      "cx": "...",
      "name": "another"
    }
  ],
```
