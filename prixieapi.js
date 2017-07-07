var express =require("express");
var ejs = require("ejs");
var dateMath = require('date-arithmetic');
var mysql=require("mysql");
var request=require("request");
var MongoClient = require("mongodb").MongoClient;
var app = express();
app.locals.dateMath=require("date-arithmetic");
app.use(express.static('public'))

var mongourl = "mongodb://localhost:27017/walkins";
var mongosandboxurl = "mongodb://prixieapi:prixie1234@ds145359.mlab.com:45359/prixie";
var connection = mysql.createConnection({
    host     : 'lg7j30weuqckmw07.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user     : 'jvipnbry05r7jsdd',
    password : 'g25rk5i0wb7ktspb',
    database : 'oxrygs2koq5krweg'
  });

app.set('view engine', 'ejs');
app.set('port',process.env.PORT||4000)
//for testing purpose
app.get('/',function(req,res){
res.send('prixieapi is working');
});

//for getting all documents from walkins collection
app.get('/get_walkins_All/:index',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("walkins");
          collection.find({}).toArray(function(err,data){
              if(err) throw err;
              db.close();
              res.send(data[parseInt(req.params.index)]);
          });
    });
});

// view all walkins collection documents rendering to ejs
app.get('/view_All_Interview_Schedules',function(req, res){
  MongoClient.connect(mongosandboxurl,function(err,db){
    var collection = db.collection("walkins");
    collection.find({}).toArray(function(err,data){
      if(err) throw err;
      console.log(data);
      db.close();
      var dateMath = require('date-arithmetic');
      res.render("interviewSchedule",{data:data, dateMath:dateMath});
    });
  });
});

//get walkins filtered by jobrole
app.get('/get_walkins_by_jobrole/:jobrole/:index',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("walkins");
          collection.find({ Job_Role: {'$regex': req.params.jobrole ,$options: 'i'}},{"_id":0}).toArray(function(err,data){ //{ $text: { $search: req.params.jobrole }}
              if(err) throw err;
              db.close();
              res.send(data[parseInt(req.params.index)]);
          });
    });
});

//view all walkins collection documents filtered by Job Role rendering to ejs
app.get('/view_All_Interview_Schedules_By_Job_Role/:jobrole',function(req, res){
  MongoClient.connect(mongosandboxurl,function(err,db){
    var collection = db.collection("walkins");
    collection.find({ Job_Role: {'$regex': req.params.jobrole ,$options: 'i'}},{"_id":0}).toArray(function(err,data){
      if(err) throw err;
      //console.log(data);
      db.close();
      res.render("interviewSchedule",{data:data});
    });
  });
});

app.get('/interview_schedules/:from/:to',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("today_walkins");
          collection.find({},{"company":1,"website":1}).toArray(function(err,data){
              if(err) throw err;
              console.log(data);
              db.close();
              res.send(data.slice(req.params.from,req.params.to));
          });
    });
});

app.get('/tutorials_list',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("tutorials");
          collection.find({},{"title":1,"urls":1,"_id":0}).toArray(function(err,data){
              if(err) throw err;
              console.log(data);
              db.close();
              res.send(data);
          });
    });
});


app.get('/interview_schedule/:index',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("interview_schedule");
          collection.find({},{"Company_name":1,"Domain":1,"Technology":1,"Experience":1,"interview_date":1,"location":1,"_id":0}).toArray(function(err,data){
              if(err) throw err;
              console.log(parseInt(req.params.index)+1);
              db.close();
              res.send(data[parseInt(req.params.index)+1]);
          });
    });
});


app.get('/get_walkins_by_Walk_In_date/:Walk_In_date/',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var walkin_date = new Date(req.params.Walk_In_date);
          console.log(walkin_date);
          var collection = db.collection("walkins");
          collection.find({$and: [{"Walk_In_date.From":{"$gt" : { "$date" :req.params.Walk_In_date }}},
                                  {"Walk_In_date.To":{"$lt" : { "$date" :req.params.Walk_In_date }}}]},
                              {"_id":0}).toArray(function(err,data){
              if(err) throw err;
              db.close();
              res.send(data);
          });
    });
});


app.get('/get_walkins_by_Experience/:minExperience/:maxExperience',function(req, res){
      MongoClient.connect(mongosandboxurl,function(err,db){
            var collection = db.collection("walkins");
            //console.log(parseInt(req.params.minExperience));
            collection.find({ $and: [{"Experience.min":{$gte:req.params.minExperience}},{"Experience.max":{$lte:req.params.maxExperience}}]},{"_id":0}).toArray(function(err,data){
                if(err) throw err;
                db.close();
                res.send(data);
            });
       });
  });

  app.get('/get_walkins_by_Experience/:minExperience',function(req, res){
        MongoClient.connect(mongosandboxurl,function(err,db){
              var collection = db.collection("walkins");
              //console.log(parseInt(req.params.minExperience));
              collection.find({"Experience.min":{$gte:req.params.minExperience}},{"_id":0}).toArray(function(err,data){
                  if(err) throw err;
                  db.close();
                  res.send(data);
              });
         });
    });


 app.get('/get_walkins_by_Eligibility/:Eligibility/',function(req, res){
      MongoClient.connect(mongosandboxurl,function(err,db){
            var collection = db.collection("walkins");
            collection.find({ $text: { $search: req.params.Eligibility +" any" } },{"_id":0}).toArray(function(err,data){
                if(err) throw err;
                db.close();
                res.send(data);
            });
      });
  });



app.get('/tutorial_urls/:title',function(req, res){
    console.log(req.params.title);
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("tutorials");
          collection.findOne({"title":req.params.title},{"urls":1,"_id":0},function(err,data){
              if(err) throw err;
              console.log(data);
              db.close();
              res.send(data);
          });
    });
});

app.get('/consultancy',function(req, res){
connection.connect();
connection.query('select * from consultancy', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("consultancies List"+result);
});
});

app.get('/written_test',function(req, res){
  connection.connect();
  connection.query("select round_discription from rounds where round_name='WRITTEN TEST'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/technical_test',function(req, res){
  connection.connect();
  connection.query("select round_discription from rounds where round_name='TECHNICAL'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
  });
});

app.get('/group_discussion',function(req, res){
  connection.connect();
  connection.query("select round_discription from rounds where round_name='GD'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/vercent_round',function(req, res){
  connection.connect();
  connection.query("select round_discription from rounds where round_name='VERCENT ROUND'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});


app.get('/jam',function(req, res){
  connection.connect();
  connection.query("select round_discription from rounds where round_name='JAM'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/system_programming',function(req, res){
  connection.connect();
  connection.query("select round_discription from rounds where round_name='SYSTEM PROGRAMMING'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/typing_test',function(req, res){
  connection.connect();
  connection.query("select round_discription from rounds where round_name='TYPING TEST'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/hr',function(req, res){
  connection.connect();
  connection.query("select round_discription from rounds where round_name='HR(OPERATION)'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/telephonic',function(req, res){
  connection.connect();
  connection.query("select round_discription from rounds where round_name='TELEPHONIC ROUND'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("rounds List"+result);
});
});

app.get('/company_info',function(req, res){
  connection.connect();
  connection.query("select company_name,address,contact_number,website,domain,percentage,year_of_passing,round_discription,r.round_name,cr.process_ from company c join company_rounds cr on c.company_id=cr.company_id  join mapping_rounds mr ON mr.company_round_id= cr.company_round_id join rounds r ON r.round_id=mr.round_id", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send(result);
});
});


app.get('/it_selection_process',function(req, res){
  res.send("selection procedure for IT recruitment");
});

app.get('/non_it_selection_process',function(req, res){
  res.send("selection procedure for Non-IT recruitment");
});
app.get('/eligibility',function(req, res){
  res.send("Eligibility");
});
app.get('/required_documents',function(req, res){
  res.send("Documents required for interview");

});

app.get('/salary',function(req, res){
  res.send("here we provides salary details...");
});





app.get('/payroll_consultencies',function(req, res){
  connection.connect();
  connection.query("select address from consultancy where consultency_type='Payroll'", function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  var result = JSON.stringify(results);
  connection.end();
    res.send("payroll List"+result);
});
});




app.get('/tutorials',function(req, res){
  res.send("Tutorials for IT and Non-IT subjects");
});

app.get('/previous_question_papers',function(req, res){
  res.send("past 10 years question papers");
});

app.get('/resume_tips',function(req, res){
  res.send("here we provides resume tips");
});



app.listen(app.get('port'),function(){
  console.log("prixie is running on port "+app.get('port'));
});
