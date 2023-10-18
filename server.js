var express = require('express')  
var app = express()
const parser = require('body-parser');
const axios = require('axios');
const ejs = require('ejs');
const path = require('path');

app.use(parser.urlencoded({ extended: true }));
app.set(parser.json());
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Filter } = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
initializeApp({
  credential: cert(serviceAccount)
});


const sportsData = [];
const nssData = [];
const musicData = [];
const internshipData = [];
const offcampusData = [];
const deptData = [];
const clubData = [];
const announce = [];

app.set("view engine","ejs");
app.use(express.static(__dirname + '/sports'));
const db = getFirestore();


app.get('/', function (req, res) {  
    res.render("homepage.ejs");
});

app.get('/faculty', (req, res) => {
   res.render("faculty.ejs");
});

app.get('/student', (req, res) => {
    res.render('student.ejs');
  });
  
  app.get('/announce', (req, res) => {
    res.render('announce.ejs',{title:'',content:''});
  });
app.get('/complaint', (req, res) => {
    res.render('complaint.ejs');
  });
  app.get('/sports', (req, res) => {
    res.render("sports.ejs");
  });
  app.post('/sports', (req, res) => {
    // Extract sports data from the form
    const date = req.body.d;
    const time = req.body.t;
    const name1 = req.body.n;
    const venue = req.body.v;
    const description = req.body.des;

    // Store the sports data in the array
    sportsData.push({ date, time, name1, venue, description });

    // Redirect to the faculty login page
});

  app.get('/nss', (req, res) => {
    res.render("nss.ejs");
  });

  app.post('/nss', (req, res) => {
    const date = req.body.d;
    const time = req.body.t;
    const name1 = req.body.n;
    const venue = req.body.v;
    const description = req.body.des;
    nssData.push({ date, time, name1, venue, description });

});
  app.get('/status', (req, res) => {
    res.render("request.ejs");
  });
  app.get('/music', (req, res) => {
    res.render("music.ejs");
  });
  app.post('/music', (req, res) => {
    const date = req.body.d;
    const time = req.body.t;
    const name1 = req.body.n;
    const venue = req.body.v;
    const description = req.body.des;
   musicData.push({ date, time, name1, venue, description });
});
  app.get('/club', (req, res) => {
    res.render("club.ejs");
  });
  app.post('/club', (req, res) => {
    const date = req.body.d;
    const time = req.body.t;
    const name1 = req.body.n;
    const venue = req.body.v;
    const description = req.body.des;
   clubData.push({ date, time, name1, venue, description });
});
  app.get('/internship', (req, res) => {
    res.render("internship.ejs");
  });
  app.post('/internship', (req, res) => {
    const date = req.body.d;
    const time = req.body.t;
    const name1 = req.body.n;
    const venue = req.body.v;
    const description = req.body.des;
   internshipData.push({ date, time, name1, venue, description });
});
  app.get('/off_campus', (req, res) => {
    res.render("off_campus.ejs");
  });
  app.post('/off_campus', (req, res) => {
    const date = req.body.d;
    const time = req.body.t;
    const name1 = req.body.n;
    const venue = req.body.v;
    const description = req.body.des;
   offcampusData.push({ date, time, name1, venue, description });
});
  app.get('/dept_events', (req, res) => {
    res.render("dept_events.ejs");
  });
  app.post('/dept_events', (req, res) => {
    const date = req.body.d;
    const time = req.body.t;
    const name1 = req.body.n;
    const venue = req.body.v;
    const description = req.body.des;
   deptData.push({ date, time, name1, venue, description });
});
  app.get('/request', (req, res) => {
    res.render('request.ejs', { sportsData, nssData, deptData, offcampusData, clubData, musicData, internshipData });

});
app.get('/hod', (req, res) => {

  res.render('hod.ejs');
});
app.post("/stu_login", function (req, res) {
    console.log("abcd");
    db.collection("students")
    .where("usr_name", "==", req.body.mail)
    .where("password", "==", req.body.pass)
    .get()
    .then((docs) => {
        console.log(docs.size);
        if(docs.size>0){
           res.render("dashboard.ejs");                                                                                                                                                                      
        } 
        else{
         res.send("login failed");
        }
    });
});
app.post("/logging", function (req, res) {
    db.collection("faculty")
    .where("usr_name", "==", req.body.email)
    .where("password", "==", req.body.password)
    .get()
    .then((docs) => {
        console.log(docs.size);
        if(docs.size>0){
          res.redirect('/request');
        } 
        else{
            res.send("login failed");
        }
    })
    .catch((error) => {
        console.error("Firestore query error:", error);
        res.status(500).send("Server error");
    });
});

app.post("/hod_login", function (req, res) {
  let email = req.body.hmail;
  let pass = req.body.hpass;
  console.log('hemail:', email);
console.log('hpass:', pass);
  db.collection("hod")
  .where("usr_name", "==", email)
  .where("password", "==", pass)
  .get()
  .then((docs) => {
      console.log(docs.size);
      if(docs.size>0){
       res.render("announce.ejs",{title:'',content:''});
        app.post('/announce', (req, res) => {
          const announcementTitle = req.body.announcementTitle;
          const announcementContent = req.body.announcementContent;
          announce.push({ announcementTitle, announcementContent });
          //res.render('announcement.ejs', { announce });
          res.render('announce.ejs', { title: announcementTitle, content: announcementContent, announce });
        });
      } 
      else{
          res.send("login failed");
      }
  })
  .catch((error) => {
      console.error("Firestore query error:", error);
      res.status(500).send("Server error");
  });
});
app.get('/announcement', (req, res) => {
  res.render('announcement.ejs', { announce });
});

app.listen(3000,() => {
    console.log("On port 3000!!!");
})
