## Set Up

1. ##### Install **yarn**: (skip this step if you are using **npm**)
   ```
   npm install -g yarn
   ```
2. ##### Install dependencies:

   - yarn:
     ```
     yarn
     ```
   - npm:
     ```
     npm install
     ```
     (The Server is using npm by default. If you want to use yarn, delete **package-lock.json** under Server root folder.)

3. ##### Constants configuration:
    - Set server address:
    Go to **./Server/lib/config

     ```js
     const port = "8080";
     const serverUrl = `http://192.168.100.108:${port}`;

     module.exports = serverUrl;
     ```

   - Replace **192.168.100.108** with the address where your server is running

## Develop
(Note: It is recommended to configure and start the server before this.)
- yarn:
  ```
  yarn start
  ```
- npm:
  ```
  npm start
  ```