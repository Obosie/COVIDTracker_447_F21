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
    let retrieve = "SELECT DISTINCT * FROM us_counties AS ucs JOIN historical_facility_counts as hfc ON(ucs.fips = hfc.`County.FIPS` AND ucs.`Date` = hfc.`Date` AND ucs.`State` = hfc.`State`) WHERE(ucs.State = 'California' AND ucs.Date = '" + date + "')";
    var rtest = "SELECT * FROM us_counties WHERE(State = 'Maryland' AND Date = " + date + ")";
    var htest = "SELECT * FROM historical_facility_counts AS hfc WHERE(hfc.State = 'California' AND hfc.Date = '" + date + "')";
    
    
    database.query(rtest, (err,result) => {
 
        if(err){
            console.log("Error retrieving object\nObject does not exist");
            throw err;
        }
        console.log(result);
        callback(JSON.stringify(result));
    });

    
}


const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

const http_server = http.createServer(app);
http_server.listen('3000', () => {
    
    console.log("HTTP Server started on port 3000");
});



app.get('/', (req, result) => {
    console.log("Map rendered");
	result.sendFile(path.join(__dirname,'map.html'));
});


app.post('/get-data', (req,res) => {

	var user_date = req.body.udate;
    console.log(user_date);
	// let retrieve = "SELECT * FROM historical_state_counts AS hfc WHERE(State = 'California' AND Date = '" + user_date + "')";
    query_pull(user_date, (ret) => {

        if(ret != undefined){

            res.status(200).json(JSON.parse(ret));
            console.log("Data Sent to Client!"); 
        }else{
            console.log("Query Failed!");
        }
    });

});
module.exports = app;

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
