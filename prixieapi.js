var express =require("express");
var mysql=require("mysql");
var request=require("request");
var MongoClient = require("mongodb").MongoClient;
var app = express();
var mongourl = "mongodb://localhost:27017/walkins";
var mongosandboxurl = "mongodb://prixieapi:prixie1234@ds145359.mlab.com:45359/prixie";
var connection = mysql.createConnection({
    host     : 'lg7j30weuqckmw07.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user     : 'jvipnbry05r7jsdd',
    password : 'g25rk5i0wb7ktspb',
    database : 'oxrygs2koq5krweg'
  });

app.set('port',process.env.PORT||3000)

app.get('/',function(req,res){
  res.send('prixieapi is working');
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


/*app.get('/interview_schedules',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("interview_schedule");
          collection.find({},{"Company_name":1,"Domain":1,"Technology":1,"Experience":1,"interview_date":1,"location":1,"_id":0}).toArray(function(err,data){
              if(err) throw err;
              console.log(data);
              db.close();
              res.send(data);
          });
    });
});
*/

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

/*app.get('/get_walkins_by_jobrole/:jobrole',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("walkins");
          collection.find({Job_Role:req.params.jobrole},{"_id":0}).toArray(function(err,data){
              if(err) throw err;
              console.log(parseInt(req.params.index)+1);
              db.close();
              res.send(data[parseInt(req.params.index)+1]);
          });
    });
});
*/

app.get('/get_walkins_by_jobrole/:jobrole/',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("walkins");
          collection.find({Job_Role:req.params.jobrole},{"_id":0}).toArray(function(err,data){
              if(err) throw err;
              db.close();
              res.send(data);
          });
    });
});


app.get('/get_walkins_by_Walk_In_date/:Walk_In_date/',function(req, res){
    MongoClient.connect(mongosandboxurl,function(err,db){
          var collection = db.collection("walkins");
          collection.find({Walk_In_date:req.params.Walk_In_date},{"_id":0}).toArray(function(err,data){
              if(err) throw err;
              db.close();
              res.send(data);
          });
    });
});



  app.get('/get_walkins_by_Experience/:minExperience/:maxExperience',function(req, res){
      MongoClient.connect(mongosandboxurl,function(err,db){
            var collection = db.collection("walkins");
            collection.find({Experience:{$elemMatch:{"Experience.min":{$gte:minExperience},{"Experience.max":{$lte:maxExperience}}}},{"_id":0}).toArray(function(err,data){
                if(err) throw err;
                db.close();
                res.send(data);
            });
      });
  });

  app.get('/get_walkins_by_Eligibility/:Eligibility/',function(req, res){
      MongoClient.connect(mongosandboxurl,function(err,db){
            var collection = db.collection("walkins");
            collection.find({Eligibility:req.params.jobrole},{"_id":0}).toArray(function(err,data){
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
