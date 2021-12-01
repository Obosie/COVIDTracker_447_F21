# COVIDTracker_447_F21
Getting the sql instance running: 
  1. Install mysql on your local machine
  2. In the database tab on mysql click connect and then use default settings to create a local instance of the database
  3. open prison_tracker.sql in mysql and make sure pathing for the data is correct in lines that load in data from csvs
  4. run the query to populate data in tables
 
 
 
Running node.js instance:
  1. Install node.js if you haven't already
  2. type the following command in mysql: SET PASSWORD FOR 'root'@'localhost' = 'password'
  3. in the command prompt go to project home directory and type node app.js 

    
