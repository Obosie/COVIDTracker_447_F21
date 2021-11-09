const { query } = require('express');
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
var path = require("path");
const sql = require('mysql');
const { createServer } = require('http');
var bodyParser = require('body-parser');


const pkey = fs.readFileSync(__dirname + "\\certs\\server.key", {encoding:'utf-8'});
const crt = fs.readFileSync(__dirname + "\\certs\\server.cert", {encoding:'utf-8'});
var creds = {key: pkey, cert: crt};


function query_pull(date,callback){

    // -------- Retrieval Query --------
    console.log("Attempting retrieval query...");
    //let join = "LEFT JOIN historical_state_counts AS hsc ON(hfc.State = hsc.State AND hfc.Date = hsc.Date)";
    let retrieve = "SELECT * FROM us_counties AS usc WHERE(State = 'California' AND Date = '" + date + "')";
    database.query(retrieve, (err,result) => {
 
        if(err){
            console.log("Error retrieving object\nObject does not exist");
            throw err;
        }

        callback(JSON.stringify(result));
    });

    
}


const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);
const http_server = http.createServer(app)
// var https_server = https.createServer(creds, app);

http_server.listen('3000', () => {
    
    console.log("HTTP Server started on port 3000");
});

// https_server.listen('3080', () => {

//     console.log("HTTPS Server started on port 3080");
// });


app.get('/', (req, result) => {
	result.sendFile(path.join(__dirname,'map.html'));
});
app.get('/pull/:year-:month-:day', (req, result) => {

        let p = req.params;
        var req_out = '';
        if(isNaN(p.year) || isNaN(p.month) || isNaN(p.day)){
            result.send("Invalid Date Contents!", 404)
        }

        let date = p.year + "-" + p.month + "-" + p.day;
        
        query_pull(date, (obj) => {

             
            if(obj != undefined){
            
                json_out = JSON.parse(obj);
                result.status(200).json(json_out);   
                console.log("Data Sent to Client!");    
            }else{

                result.status(404).send("Lookup Failure!");
                console.log("Query Failed!");
            }
        });


});

app.post('/', function(req,result){
	var user_date = req.body.userdate;
	let retrieve = "SELECT * FROM historical_state_counts AS hfc WHERE(State = 'California' AND Date = '" + user_date + "')"
	database.query(retrieve, function(err,row){    
      if(err){
        result.send("Error encountered while displaying");
        return console.error(err.message);
      }
	  sql_result = JSON.stringify(row);
	  result.render(path.join(__dirname,'mapresults.html'), {results:sql_result});
	  console.log("Entry displayed successfully");
  });
});
  

const database = sql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'covid_19_prison_tracker'
});
database.connect((err) => {

    if(err) throw err;
    console.log("Connected to COVID19 mySQL...");
});


