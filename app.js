const express=require("express");
const request=require("request");
const bodyParser=require("body-parser");
const https=require("https");

const app=express();
// To get static files(css) and images we create folder public
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  const firstname=req.body.fname;
  const lastname=req.body.lname;
  const email=req.body.email;

  const data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          // docs:https://us7.admin.mailchimp.com/lists/settings/merge-tags?id=530946
          FNAME:firstname,
          LNAME:lastname
        }
      }
    ]
  };

const jsonData=JSON.stringify(data);
// Unlike previous project,we dont dont want our API to send data,we want our API to store the data we recieved
const url="https://us7.api.mailchimp.com/3.0/lists/d7f238f2ef";
// This is the our personalied list in their API https://usX.api.mailchimp.com/3.0/lists/{list_id}
const options={
  method:"POST",
  auth:"anjujoseph555:46c14a39faee05e6aefe3e6379fb3edb-us7"
}
const request=https.request(url,options,function(response){
  if(response.statusCode===200){
  res.sendFile(__dirname+"/success.html");
}
  else{
  res.sendFile(__dirname+"/failure.html");
  }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  })
});
request.write(jsonData);
request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});
app.listen(3000,function(){
  console.log("Server is set and running on port 3000");
});

// Key:46c14a39faee05e6aefe3e6379fb3edb-us7 where in url usX needs to be replaced with 7
// List ID:d7f238f2ef
