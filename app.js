const { query } = require('express');
const express = require('express');
const http = require('https');
const fs = require('fs');
const sql = require('mysql');
const { createServer } = require('http');


const pkey = fs.readFileSync(__dirname + "\\certs\\server.key", {encoding:'utf-8'});
const crt = fs.readFileSync(__dirname + "\\certs\\server.cert", {encoding:'utf-8'});
var creds = {key: pkey, cert: crt};


var req_out; 

function query_pull(date){

    // -------- Retrieval Query --------
    console.log("Attempting retrieval query...");
    let retrieve = "SELECT * FROM historical_state_counts WHERE(State = 'California' AND Date = '" + date + "')";
    database.query(retrieve, (err,result) => {
 
        if(err){
            console.log("Error retrieving object\nObject does not exist");
            throw err;
        }

        var ret = JSON.stringify(result[0]);
    
        req_out = ret;
    })
}


const app = express();
var server = createServer(creds, app);

server.listen('3000', () => {
    
    console.log("Server started on port 3000");
});
app.get('/', (req, result) => {

    result.send("HTTPS Connection Established.  Waiting for query...");
});
app.get('/get/:year-:month-:day', (req, result) => {

        let p = req.params;
        let date = p.year + "-" + p.month + "-" + p.day;
        
        query_pull(date);
        let json_out; 
        if(req_out != undefined){
            
            json_out = JSON.parse(req_out);
            result.send("200 OK");
            let rate = (json_out["Residents.Confirmed"]/json_out["Residents.Tested"]) * 100;

            console.log("On " + date + ": Residents Positive = " + json_out["Residents.Confirmed"]);
            console.log("On " + date + ": Residents Tested = " + json_out["Residents.Tested"]);
            console.log("On " + date + ": Positivity Rate = ", rate);            
        }else{

            result.send("404 Entry Not Found")
        }
        
        
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


