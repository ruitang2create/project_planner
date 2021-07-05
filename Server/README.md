## Set Up

1.  #### Install **yarn**: (skip this step if you are using **npm**)
    ```
    npm install -g yarn
    ```
2.  #### Install dependencies:

    - yarn:
      ```
      yarn
      ```
    - npm:
      ```
      npm install
      ```
      (The Server is using npm by default. If you want to use yarn, delete **package-lock.json** under Server root folder.)

3.  #### Constants configuration:

- **Server Address Configuration**:

  - Create a **lib** folder under **./Server/**:
  - Create a **config.js** file under **./Server/lib/**
  - Copy and paste following code into **config.js**:

    ```js
    const serverAddress = "http://192.168.100.108";
    const serverPort = "8080";
    const serverURL = {
      address: serverAddress,
      port: serverPort,
    };

    module.exports = serverURL;
    ```

  - Set the value of **`serverAddress`** with the address where your server is running.
  - Set the value of **`serverPort`** with the port you want. If you set it to any value other than `8080`, you should also update the port value in Client side config file which is at **./Client/src/lib/serverInfo.js**.

- **Database Configuration**:
  - Create a **dbpool.js** file under **./Server/lib/**
  - Copy and paste following code into **dbpool.js**:

    ```js
    const mysql = require('mysql');
    const myDB = {
        host: 'The address of your database',
        port: 'The port of your DB(3306 is default port of MySQL DB)',
        user: 'The username of your database',
        password: 'The password of your database',
        database: 'The schema name of your database',
        multipleStatements: true,
    };
    const pool = mysql.createPool(myDB);
    module.exports = pool;
    ```

## Develop

- yarn:
  ```
  yarn start
  ```
- npm:
  ```
  npm start
  ```

## Serve it using PM2

1. Install PM2 on your server:
    ```
    npm install -g pm2
    ```
2. Start:
    ```
    pm2 serve ./Server/server.js
    ```
3. Stop:
    ```
    pm2 stop server
    ```

4. Restart:
    ```
    pm2 restart server
    ```

5. Check logs:
    ```
    pm2 logs
    ```
