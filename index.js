/**
 * Name: Maxwell Grimm
 * Date:11/17/2022
 * Description:
 * Bugs: Hopefully None
 * Reflection: This will provide all website movement
 * and database requests
 */


 const db = require("./db.js");
 const bcrypt = require('bcrypt');
 const express = require("express");
 const bodyParser = require('body-parser');
 const multer = require('multer');
 const cookieParser = require('cookie-parser');
 var session = require('express-session');
 const paypal = require('paypal-rest-sdk');
 const path = require('path');
 const app = express();

 paypal.configure({
   'mode': 'sandbox', //sandbox or live
   'client_id': 'AR4FyafT7i4sC9J8gXUSxZcOzZQCX8EraYdJ5YKDZkxyyHS-yv81PQM3Noo1u9LYl0_n76jPqj_rWCcA',
   'client_secret': 'EGaPcw40pBojaJE6zoSchPSY5OSxDTtykU7jl7bdPn2_dYLIpESIxW0F40L9OSMyuKfxVMpfHQXShESx'
 });
 
 app.use(cookieParser());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(express.urlencoded({extended: false}));

 const logRequest = function (req, res, next) {
    console.log(`Request: ${req.method} for ${req.path}`);
    next();
 };
 
 app.use(logRequest);
 app.use(express.urlencoded({extended: false})); // so that req.body will be populated
 app.use(express.static("./public"));              // static pages will be served from the public folder
 app.set("view engine", "ejs");

 app.set('trust proxy', 1);
 app.use(session({
   secret: 'session',
   resave: false,
   saveUninitialized: true,
   //cookie: {secure: true},
 }));

 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, path.join(__dirname, './public/images/properties/'))
   },
   filename: function (req, file, cb) {
         fileNames.push(file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0]);
         cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
   }
});

let fileNames = [];

const multi_upload = multer({
   storage,
   limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
   fileFilter: (req, file, cb) => {
       if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
           cb(null, true);
       } else {
           cb(null, false);
           const err = new Error('Only .png, .jpg and .jpeg format allowed!')
           err.name = 'ExtensionError'
           return cb(err);
       }
   },
}).array('uploadedImages', 3)
 

 let currentUser = '';
 let paymentAmount = 0;
 
 app.get('/', (req, res) =>{
   res.render('pages/index');
 });

 //change to db query to get all houses
 app.get('/listings', (req, res) =>{
    db.getAllProperties(req, res);
 });

 app.post('/property', (req, res) =>{
   db.constructPropertyPage(req, res);
 });

 app.post('/listingsSearch', (req, res) =>{
   console.log(req.body.propertyType);
   console.log(req.body.numBeds);
   console.log(req.body.numBaths);
   if(req.body.propertyType != undefined){
      if(req.body.numBeds != undefined){
         if(req.body.numBaths != undefined){
            //all 3 filled
            db.listingsWithAll(req, res);
         }
         else{
            //type and beds filled
            db.listingsWithTypeAndBeds(req, res);
         }
      }
      else if(req.body.numBaths != undefined){
         //type and baths
         db.listingsWithTypeAndBaths(req, res);
      }
      else{
         //jsut type
        db.listingsWithType(req, res); 
      }
   }
   else if(req.body.numBeds != undefined){
      if(req.body.numBaths != undefined) {
         //beds and baths
         db.listingsWithBedsAndBaths(req, res);
      }
      else{
         //just beds
         db.listingsWithBeds(req, res);
      } 
   }
   else if(req.body.numBaths != undefined){
      //just baths
      db.listingsWithBaths(req, res);
   }
   else{
      //none
      db.getAllProperties(req, res);
   }
 });

 app.get('/utility', (req, res) =>{
    res.render('pages/utility.ejs');
 });

 app.get('/signIn', (req, res) =>{
   console.log(req.session.userid);
   console.log(currentUser);
   if(req.session.userid == currentUser){
      db.getAccountPage(req, res, req.session.userid);
   }
   else{
      res.render('pages/signIn', {wrongPassword: ""});
   }
 });

 //change to db query
 app.get('/account', (req, res) =>{
   console.log(req.session.userid);
   console.log(currentUser);
   if(req.session.userid == currentUser){
      db.getAccountPage(req, res, req.session.userid);
    }
    else{
      res.render('pages/signIn', {wrongPassword: "Must Sign In To View Your Account"});
    }
 });

 //need to find a way to only make this viewable if signed in
 app.get('/payrent', (req, res) =>{
   console.log(req.session.userid);
   console.log(currentUser);
   if(req.session.userid == currentUser){
      db.getPaymentPage(req, res, req.session.userid);
   }
   else{
      res.render('pages/signIn', {wrongPassword: "Must Sign In To Procede With Payment"});
   }
 });

 app.get('/contact', (req, res) =>{
    res.render('pages/contact');
 });

 app.post('/upload', (req, res) => {
   multi_upload(req, res, function (err) {
       if (err instanceof multer.MulterError) {
           // A Multer error occurred when uploading.
           res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
           return;
       } else if (err) {
           // An unknown error occurred when uploading.
           if (err.name == 'ExtensionError') {
               res.status(413).send({ error: { message: err.message } }).end();
           } else {
               res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
           }
           return;
       }

       // Everything went fine.
       // show file `req.files`
       // show body `req.body`
      console.log(fileNames);
      db.addListing(req, res, fileNames[0], fileNames[1], fileNames[2]);
      for(let i = 0; i < fileNames.length; i++){
         fileNames.pop();
      }
   })
});

app.post('/removeProperty', (req, res) => {
   db.removeProperty(req, res);
});

app.post('/createUser', (req, res) => {
   bcrypt.hash(req.body.password, 6, function(err, hash) {
      console.log(hash);
      db.createUser(req, res, hash);
   });
});

 //for the sign-in form request I will use bcrypt
app.post('/auth', (req, res) => {
   //checks if the userName exists in the database and if it does it gets the hashed password of that account
   db.userExists(req, res).then(function(result){  
      bcrypt.compare(req.body.password, result, function (err, passwordResult) {
         if (passwordResult == true) {
            if(req.body.userName == 'admin'){
               req.session.userid = req.body.userName;
               db.getAdminPage(req, res);
            }
            else{
               req.session.userid = req.body.userName;
               currentUser = req.body.userName;
               db.getAccountPage(req, res, req.body.userName);
            }
         } else {
            currentUser = '';
            res.render('pages/signIn', {wrongPassword: "Incorrect Password"});
         }
         });
  }).catch(function(err){
      console.log(err);   
      currentUser = '';
      res.render('pages/signIn', {wrongPassword: "There was a problem on our end please try again"});
  });
});



app.get('/logout',(req, res) =>{
   req.session.destroy();
   res.redirect('/');
});

app.post('/pay', (req, res) => {
   const amount = req.body.amount;
   paymentAmount = amount;
   console.log(amount);
   const foo = "" + amount;
   const create_payment_json = {
     "intent": "sale",
     "payer": {
         "payment_method": "paypal"
     },
     "redirect_urls": {
      //will need to change later
         "return_url": "http://localhost:3000/sucess",
         "cancel_url": "http://localhost:3000/cancel"
     },
     "transactions": [{
         "item_list": {
             "items": [{
                 "name": "Star Properties Rent",
                 "sku": "001",
                 "price": amount,
                 "currency": "USD",
                 "quantity": 1
             }]
         },
         "amount": {
             "currency": "USD",
             "total": amount
         },
         "description": "Rent"
     }]
 };
 
 paypal.payment.create(create_payment_json, function (error, payment) {
   if (error) {
       throw error;
   } else {
       for(let i = 0;i < payment.links.length;i++){
         if(payment.links[i].rel === 'approval_url'){
           res.redirect(payment.links[i].href);
         }
       }
   }
 });
 
 });

 app.get('/success', (req, res) => {
   const payerId = req.query.PayerID;
   const paymentId = req.query.paymentId;
 
   const execute_payment_json = {
     "payer_id": payerId,
     "transactions": [{
         "amount": {
             "currency": "USD",
             "total": paymentAmount
         }
     }]
   };
 
 // Obtains the transaction details from paypal
   paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
       //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
     if (error) {
         console.log(error.response);
         throw error;
     } else {
         console.log(JSON.stringify(payment));
         db.updateUserBalance(req, res, paymentAmount, req.session.userid);
     }
   });

   paymentAmount = 0;
 });

 app.get('/cancel', (req, res) =>{
   paymentAmount = 0;
   db.getPaymentPage(req, res);});

 app.listen(3000, function () {
    console.log("Listening on port 3000...");
 });

async function ComparePasswords(plainTextPassword, hash){
   const result = await bcrypt.compare(plainTextPassword, hash);
   return result;
}

async function hashPassword(plaintextPassword) {
   const hash = await bcrypt.hash(plaintextPassword, 6);
   console.log(hash);
}

exports.ComparePasswords = ComparePasswords;