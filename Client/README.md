## Set Up

1. ###### Install **yarn**: (skip this step if you are using **npm**)
   ```
   npm install -g yarn
   ```
2. ###### Install dependencies:

   - yarn:
     ```
     yarn
     ```
   - npm:
     ```
     npm install
     ```
     (This project is using yarn by default. If you want to use npm, delete **yarn.lock** under Client root folder.)

3. ###### API call constants configuration:

   - Create a **lib** folder under **./Client/src/**:
   - Create a **serverConfig.js** file under **./Client/src/lib/**
   - Copy and paste following code into **serverInfo.js**:

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

## Build

- yarn:
  ```
  yarn build
  ```
- npm:
  ```
  npm build
  ```

  Static files will be generated under **./Client/build/** folder.