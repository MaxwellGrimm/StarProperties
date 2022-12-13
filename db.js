/**
 * Name: Maxwell Grimm
 * Date: 11/21/2022
 * Description: db.js contains all of our SQL statements
 * Bugs: Too many to list
 * Reflection: This was fun to make!
 */

const bcrypt = require('bcrypt');
const index = require('./index.js');

// Create the pool of connections to be used throughout the life of the app
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'Grriped',                           // ignored
    host: 'db.bit.io',
    database: 'Grriped/StarProperties',// public database, replace this with your values
    password: 'v2_3vemW_74djdAUUd2ETu3BrqUeq3bR', // key from bit.io database page connect menu
    port: 5432,
    ssl: true,
});
pool.connect();

const getAllProperties = (req, res) => {
    pool.query('Select * from "Properties"',
    (error, results) => {
        if(error){
            console.log('Error: ${error}');
        }
        else{
            res.render('pages/listings', {allProperties: results.rows});
        }
    });
}

const listingsWithType = (req, res) => {
    pool.query('Select * from "Properties" Where type=$1',[req.body.propertyType],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error)
        }
        else{
            res.render('pages/listings', {allProperties: results.rows});
        }
    });
}

const listingsWithBeds = (req, res) => {
    pool.query('Select * from "Properties" Where beds=$1',[req.body.numBeds],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error)
        }
        else{
            res.render('pages/listings', {allProperties: results.rows});
        }
    });
}

const listingsWithBaths = (req, res) => {
    pool.query('Select * from "Properties" Where baths=$1',[req.body.numBaths],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error)
        }
        else{
            res.render('pages/listings', {allProperties: results.rows});
        }
    });
}

const listingsWithTypeAndBeds = (req, res) => {
    pool.query('Select * from "Properties" Where type=$1 and beds=$2',
    [req.body.propertyType, req.body.numBeds],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error)
        }
        else{
            res.render('pages/listings', {allProperties: results.rows});
        }
    });
}

const listingsWithTypeAndBaths = (req, res) => {
    pool.query('Select * from "Properties" Where type=$1 and baths=$2',
    [req.body.propertyType, req.body.numBaths],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error)
        }
        else{
            res.render('pages/listings', {allProperties: results.rows});
        }
    });
}

const listingsWithBedsAndBaths = (req, res) => {
    pool.query('Select * from "Properties" Where beds=$1 and baths=$2',
    [req.body.numBeds, req.body.numBaths],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error)
        }
        else{
            res.render('pages/listings', {allProperties: results.rows});
        }
    });
}

const listingsWithAll = (req, res) => {
    pool.query('Select * from "Properties" Where baths=$1 and beds=$2 and type=$3',
    [req.body.numBaths, req.body.numBeds, req.body.propertyType],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error)
        }
        else{
            res.render('pages/listings', {allProperties: results.rows});
        }
    });
}

const constructPropertyPage = (req, res) => {
    pool.query('Select * from "Properties" Where street=$1',
    [req.body.street],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error)
        }
        else{
            console.log(req.body.street);
            console.log(JSON.stringify(results.rows));
            res.render('pages/property', {allProperties: results.rows});
        }
    });
}

async function signIn(req, res, password){
    pool.query('Select * from "Users" Where useremail=$1',
    [req.body.userName],
    async(error, results) => {
        if(error){
            return false;
        }
        else{
            let hashedPassword = results.rows[0].password;
            console.log(hashedPassword);
            let areTheyTheSame = await index.ComparePasswords(password, hashedPassword);
            if(areTheyTheSame){
                console.log('the passwords should be the same');
                return true;
            }
            else{
                return false;
            }
        }
    });
}

const userExists = function(req, res){
    return new Promise(function(resolve, reject){
        pool.query('Select * from "Users" Where useremail=$1',[req.body.userName],
            (error, results) => {
                if(error)
                    return reject(error);
                resolve(results.rows[0].password);
        });
    });
}



//make a getAccountPage

const getAccountPage = (req, res, userName) =>{
    pool.query('Select * from "Users" Where useremail=$1',[userName],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error);
        }
        else{
            res.render('pages/account', {accountInfo : results.rows});
        }
    });
}

//this will update the users outstanding balance once the user pays on paypal
const updateUserBalance = (req, res, amount, userName) =>{
    let currentAmount = 0;
    pool.query('Select * from "Users" Where useremail=$1',[userName],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error);
        }
        else{
            accountInfo = results.rows;
            currentAmount = accountInfo[0].userbalance;
            let updatedbalance = currentAmount - amount;
        }
    });
    pool.query('Update "Users" Set userbalance=$1 where useremail=$2',[updatedbalance, userName],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error);
        }
        else{
            res.render('/');
        }
    });
}

//this will get the payment page with the correct user info
const getPaymentPage = (req, res, userName) =>{
    console.log(userName);
    pool.query('Select * from "Users" Where useremail=$1',[userName],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error);
        }
        else{
            res.render('pages/payrent', {accountInfo: results.rows});
        }
    });
}

const getAdminPage = (req, res) =>{
    pool.query('Select * from "Properties"',
    (error, results) => {
        if(error){
            console.log('Error: ${error}');
        }
        else{
            res.render('pages/adminPage', {allProperties: results.rows});
        }
    });
}

const addListing = (req, res, name, name1, name2) =>{
    pool.query('Insert Into "Properties" (street, city, state, zip, avaliable, beds, baths, rent, type, lat, long, picturelink1, picturelink2, picturelink3, information) Values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        [req.body.street, req.body.city, req.body.state, req.body.zip, req.body.avaliable, req.body.beds, req.body.baths, req.body.rent, req.body.type, req.body.lat, req.body.lng, name, name1, name2, req.body.info],
        (error, results) => {
            if(error){
                console.log('Error: ${error}', error);
            }
            else{
                getAdminPage(req, res);
            }
    });  
}

const removeProperty = (req, res) =>{
    pool.query('Delete from "Properties" Where street=$1',
    [req.body.street],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error);
        }
        else{
            getAdminPage(req, res);
        }
    });
}

const createUser = (req, res, hashed) => {
    pool.query('Insert Into "Users" (useremail, userbalance, userstreet, userstate, usercity, userzip, password) Values ($1, $2, $3, $4, $5, $6, $7)',
    [req.body.useremail, req.body.balance, req.body.street, req.body.state, req.body.city, req.body.zip, hashed],
    (error, results) => {
        if(error){
            console.log('Error: ${error}', error);
        }
        else{
            getAdminPage(req, res);
        }
    });
}

exports.createUser = createUser;
exports.removeProperty = removeProperty;
exports.getAdminPage = getAdminPage;
exports.addListing = addListing;
exports.getPaymentPage = getPaymentPage;
exports.updateUserBalance = updateUserBalance;
exports.userExists = userExists;
exports.getAccountPage = getAccountPage;
exports.signIn = signIn;
exports.getAllProperties = getAllProperties;
exports.listingsWithType = listingsWithType;
exports.listingsWithBaths = listingsWithBaths;
exports.listingsWithBeds = listingsWithBeds;
exports.listingsWithAll = listingsWithAll;
exports.listingsWithBedsAndBaths = listingsWithBedsAndBaths;
exports.listingsWithTypeAndBaths = listingsWithTypeAndBaths;
exports.listingsWithTypeAndBeds = listingsWithTypeAndBeds;
exports.constructPropertyPage = constructPropertyPage;