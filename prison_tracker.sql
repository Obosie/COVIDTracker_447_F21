CREATE DATABASE IF NOT EXISTS covid_19_prison_tracker;

USE covid_19_prison_tracker;

DROP TABLE IF EXISTS historical_national_counts;

CREATE TABLE historical_national_counts(
`Date` DATE,
Measure TEXT,
Count INT,
Reporting INT,
Missing TEXT
);

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/historical-data/historical_national_counts.csv' #Change Absolute directory to fit local machine
INTO TABLE historical_national_counts 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(`Date`, @measure, @count, @reporting, @missing)
SET
Measure = NULLIF(@measure, ''),
Count = NULLIF(@count, ''),
Reporting = NULLIF(@reporting, ''),
Missing = NULLIF(@missing, '')
;

DROP TABLE IF EXISTS historical_state_counts;


CREATE TABLE historical_state_counts(
`Date` DATE,
State TEXT,
`Residents.Confirmed` INT,
`Staff.Confirmed` INT,
`Residents.Deaths` INT,
`Staff.Deaths` INT,
`Residents.Tadmin` INT,
`Residents.Tested` INT,
`Residents.Active` INT,
`Staff.Active` INT,
`Staff.Initiated` INT,
`Residents.Initiated` INT,
`Residents.Completed` INT,
`Staff.Completed` INT,
`Residents.Vadmin` INT,
`Staff.Vadmin` INT
);

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/historical-data/historical_state_counts.csv' 
INTO TABLE historical_state_counts 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(`Date`, @state, @RConf, @SConf, @RDeaths, @SDeaths, @RTadmin, @RTest, @RActive, @SActive, @RInit, @SInit, @RComp, @SComp, @RVadmin, @SVadmin)
SET
State = NULLIF(@state, ''),
`Residents.Confirmed` = NULLIF(@RConf, ''),
`Staff.Confirmed` = NULLIF(@SConf, ''),
`Residents.Deaths` = NULLIF(@RDeaths, ''),
`Staff.Deaths` = NULLIF(@SDeaths, ''),
`Residents.Tadmin` = NULLIF(@RTadmin, ''),
`Residents.Tested` = NULLIF(@RTest, ''),
`Residents.Active` = NULLIF(@RActive, ''),
`Staff.Active` = NULLIF(@SActive, ''),
`Residents.Initiated` = NULLIF(@RTadmin, ''),
`Residents.Completed` = NULLIF(@RTadmin, ''),
`Staff.Initiated` = NULLIF(@RTadmin, ''),
`Staff.Completed` = NULLIF(@RTadmin, ''),
`Residents.Vadmin` = NULLIF(@RVadmin, ''),
`Staff.Vadmin` = NULLIF(@SVadmin, '')
;


DROP TABLE IF EXISTS historical_state_jurisdiction_counts;

CREATE TABLE historical_state_jurisdiction_counts (
State TEXT,
`Web.Group` TEXT,
Measure TEXT,
Val INT,
Rate DOUBLE,
`Date` DATE
);

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/historical-data/historical_state_jurisdiction_counts.csv' #Change Absolute directory to fit local machine
INTO TABLE historical_state_jurisdiction_counts 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@state, @web, @measure, @val, @rate, @dt)
SET
State = NULLIF(@state, ''),
`Web.Group` = NULLIF(@web, ''),
Measure = NULLIF(@measure, ''),
Val = NULLIF(@val, ''),
Rate = NULLIF(@rate, '')
;

DROP TABLE IF EXISTS historical_facility_counts;

CREATE TABLE historical_facility_counts(
`Facility.ID` INT ,
Jurisdiction TEXT,
State TEXT,
Name TEXT,
Date DATE,
source TEXT,
`Residents.Confirmed` INT,
`Staff.Confirmed` INT,
`Residents.Deaths` INT,
`Staff.Deaths` INT,
`Residents.Tadmin` INT,
`Residents.Tested` INT,
`Residents.Active` INT,
`Staff.Active` INT,
`Population.Feb20` INT,
`Residents.Population` INT,
`Residents.Initiated` INT,
`Staff.Initiated` INT,
`Residents.Completed` INT,
`Staff.Completed` INT,
`Residents.Vadmin` INT,
`Staff.Vadmin` INT,
`Web.Group` TEXT,
Address TEXT,
Zipcode INT,
City TEXT,
County TEXT,
Latitude DOUBLE,
Longitude DOUBLE,
`County.FIPS` INT,
`ICE.Field.Office` TEXT
);

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/historical-data/historical_facility_counts.csv' #Change Absolute directory to fit local machine
INTO TABLE historical_facility_counts 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(`Facility.ID`, Jurisdiction, State, Name, Date, source, @RConf, @SConf, @RDeaths, @SDeaths, @RTadmin, @RTest, @RActive, @SActive, @PopFeb20, @RPop, @RInit, @SInit, @RComp, @SComp, @RVadmin, @SVadmin, @WG, Address, @Zip, @City, @County, @Lat, @Lon, @CountyFIPS, @ICE)
SET
`Residents.Confirmed` = NULLIF(@RConf, ''),
`Staff.Confirmed` = NULLIF(@SConf, ''),
`Residents.Deaths` = NULLIF(@RDeaths, ''),
`Staff.Deaths` = NULLIF(@SDeaths, ''),
`Residents.Tadmin` = NULLIF(@RTadmin, ''),
`Residents.Tested` = NULLIF(@RTest, ''),
`Residents.Population` = NULLIF(@RPop, ''),
`Residents.Active` = NULLIF(@RActive, ''),
`Staff.Active` = NULLIF(@SActive, ''),
`Population.Feb20` = NULLIF(@PopFeb20, ''),
`Residents.Initiated` = NULLIF(@RTadmin, ''),
`Residents.Completed` = NULLIF(@RTadmin, ''),
`Staff.Initiated` = NULLIF(@RTadmin, ''),
`Staff.Completed` = NULLIF(@RTadmin, ''),
`Residents.Vadmin` = NULLIF(@RVadmin, ''),
`Staff.Vadmin` = NULLIF(@SVadmin, ''),
`Web.Group` = NULLIF(@WG, ''),
ZipCode = NULLIF(@Zip, ''),
City = NULLIF(@City, ''),
County = NULLIF(@County, ''),
Latitude = NULLIF(@Lat, ''),
Longitude = NULLIF(@Lon, ''),
`County.FIPS` = NULLIF(@CountyFIPS, ''),
`ICE.Field.Office` = NULLIF(@ICE, '')
;