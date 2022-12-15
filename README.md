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