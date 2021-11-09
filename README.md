# COVIDTracker_447_F21
Getting the sql instance running: 
  1. Install mysql on your local machine
  2. In the database tab on mysql click connect and then use default settings to create a local instance of the database
  3. open prison_tracker.sql in mysql and make sure pathing for the data is correct in lines that load in data from csvs
  4. run the query to populate data in tables
 
 Generating key files for node instance (this assumes you are on windows):
  1. download the 64bit version of openssl: https://slproweb.com/products/Win32OpenSSL.html
  2. Install the downloaded application 
  3. type openssl into the task bar and open win64 openssl command prompt
  4. enter the following two commands: 
        * openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem 
        * openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
  5. moves these files (key.pem, csr.pem, server.crt) to the home project directory in a "certs" folder you create
  6. rename key.pem to server.key and server.crt to server.cert
 
Running node.js instance:
  1. Install node.js if you haven't already
  2. type the following command in mysql: SET PASSWORD FOR 'root'@'localhost' = 'password'
  3. in the command prompt go to project home directory and type node app.js 

    
