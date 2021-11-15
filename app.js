const { query, json } = require('express');
const express = require('express');
const http = require('http');
var path = require("path");
const sql = require('mysql');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const ejs = require('ejs');





function query_pull(date,callback){

    // -------- Retrieval Query --------
    console.log("Attempting retrieval query...");
    let retrieve = "SELECT DISTINCT * FROM us_counties AS ucs JOIN historical_facility_counts as hfc ON(ucs.fips = hfc.`County.FIPS` AND ucs.`Date` = hfc.`Date` AND ucs.`State` = hfc.`State`) WHERE(ucs.State = 'California' AND ucs.Date = " + date + ")";
    database.query(retrieve, (err,result) => {
 
        if(err){
            console.log("Error retrieving object\nObject does not exist");
            throw err;
        }

        callback(JSON.stringify(result));
    });

    
}


const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

const http_server = http.createServer(app);
http_server.listen('3000', () => {
    
    console.log("HTTP Server started on port 3000");
});



app.get('/', (req, result) => {
	result.sendFile(path.join(__dirname,'map.html'));
});


app.post('/', function(req,result){
	var user_date = req.body.userdate;
	// let retrieve = "SELECT * FROM historical_state_counts AS hfc WHERE(State = 'California' AND Date = '" + user_date + "')";
    var json_out = "";
    query_pull(user_date, (ret) => {

        if(ret != undefined){
            json_out = JSON.parse(ret);
            //result.status(200).send(json_out);
            // result.status(200).render(path.join(__dirname,'mapresults.html'), {results:json_out});
            console.log("Data Sent to Client!"); 
        }else{
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

