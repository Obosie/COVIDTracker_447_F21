const { query } = require('express');
const express = require('express');
const http = require('http');
const path = require('path');
const sql = require('mysql');
const { createServer } = require('http');






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
app.use(express.static(__dirname))
var http_server = http.createServer(app);

http_server.listen('3000', () => {
    
    console.log("HTTP Server started on port 3000");
});


app.get('/', (req, result) => {

    result.sendFile(path.join(__dirname + "/map.html"), (err) => {

        if(err) throw err;
        console.log("Connection Established. Map Displayed. Waiting for query...");
    });
    
});
app.get('/pull/:year-:month-:day', (req, result) => {

        let p = req.params;
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


