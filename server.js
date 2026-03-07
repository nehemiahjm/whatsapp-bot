require("dotenv").config();

const express = require("express");
const fs = require("fs");
const { sendMessage } = require("./whatsapp");
const messages = require("./messages");

const app = express();
app.use(express.json());

const USERS_FILE = "./users.json";

function loadUsers(){
if(!fs.existsSync(USERS_FILE)) return {};
return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(data){
fs.writeFileSync(USERS_FILE,JSON.stringify(data,null,2));
}

let users = loadUsers();

/* ACCESS CHECK */

function checkAccess(user){

const now = new Date();

if(user.plan==="trial"){
return now <= new Date(user.trialEnd);
}

if(user.plan==="personal" || user.plan==="business"){
return now <= new Date(user.subscriptionEnd);
}

return false;

}

app.get("/",(req,res)=>{
res.send("Hisabi Cash Bot Running");
});

app.post("/webhook", async(req,res)=>{

try{

const value=req.body.entry?.[0]?.changes?.[0]?.value;

if(!value.messages) return res.sendStatus(200);

const message=value.messages[0];
const from=message.from;
const text=message.text?.body || "";
const userText=text.toLowerCase();

/* NEW USER */

if(!users[from]){

users[from]={
state:"language",
language:"english",
plan:"trial"
};

saveUsers(users);

await sendMessage(from,messages.english.greeting);

return res.sendStatus(200);
}

const user=users[from];
const m=messages[user.language];

/* GREETING */

if(
userText.includes("hi")||
userText.includes("hello")||
userText.includes("salam")||
userText.includes("assalam")||
userText.includes("start")
){
await sendMessage(from,m.greeting);
return res.sendStatus(200);
}

/* LANGUAGE COMMAND */

if(userText==="language"){

user.state="language";
saveUsers(users);

await sendMessage(from,m.languageMenu);
return res.sendStatus(200);
}

/* LANGUAGE SELECT */

if(user.state==="language"){

if(userText==="1") user.language="english";
else if(userText==="2") user.language="roman";
else if(userText==="3") user.language="urdu";
else{
await sendMessage(from,m.languageMenu);
return res.sendStatus(200);
}

user.state="purpose";
saveUsers(users);

await sendMessage(from,m.languageConfirm);
await sendMessage(from,m.intro);
await sendMessage(from,m.purpose);

return res.sendStatus(200);
}

/* PURPOSE */

if(user.state==="purpose"){

if(userText!=="personal" && userText!=="business"){
await sendMessage(from,m.invalidPurpose);
return res.sendStatus(200);
}

user.type=userText;
user.state="name";
saveUsers(users);

await sendMessage(from,m.askName);
return res.sendStatus(200);
}

/* NAME */

if(user.state==="name"){

user.name=text;
user.state="occupation";
saveUsers(users);

await sendMessage(from,m.askOccupation);
return res.sendStatus(200);
}

/* OCCUPATION */

if(user.state==="occupation"){

user.occupation=text;
user.state="email";
saveUsers(users);

await sendMessage(from,m.askEmail);
return res.sendStatus(200);
}

/* EMAIL */

if(user.state==="email"){

user.email=text;

const start=new Date();
const end=new Date();
end.setDate(start.getDate()+7);

user.plan="trial";
user.trialStart=start;
user.trialEnd=end;
user.state="active";

saveUsers(users);

await sendMessage(from,m.trialSuccess(user.name,start,end));

return res.sendStatus(200);
}

/* TRIAL BARRIER */

if(!checkAccess(user)){
await sendMessage(from,m.expired);
return res.sendStatus(200);
}

/* DASHBOARD */

if(userText==="menu"){
await sendMessage(from,m.dashboard(user.name));
return res.sendStatus(200);
}

/* SALE */

if(userText==="sale"){
await sendMessage(from,m.saleGuide);
return res.sendStatus(200);
}

/* EXPENSE */

if(userText==="expense"){
await sendMessage(from,m.expenseGuide);
return res.sendStatus(200);
}

/* UDHAR */

if(userText==="udhar"){
await sendMessage(from,m.udharGuide);
return res.sendStatus(200);
}

/* REPORT */

if(userText==="report"){
await sendMessage(from,m.report);
return res.sendStatus(200);
}

/* INSIGHT */

if(userText==="insight"){
await sendMessage(from,m.insight);
return res.sendStatus(200);
}

/* PLANS */

if(userText==="plans"){
await sendMessage(from,m.plans);
return res.sendStatus(200);
}

/* PERSONAL PLAN */

if(userText==="personal plan"){
await sendMessage(from,m.payment("Personal Plan","Rs 399 / month"));
return res.sendStatus(200);
}

/* BUSINESS PLAN */

if(userText==="business plan"){
await sendMessage(from,m.payment("Business Plan","Rs 999 / month"));
return res.sendStatus(200);
}

return res.sendStatus(200);

}catch(error){

console.error(error);
res.sendStatus(500);

}

});

const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
console.log("Server running on port",PORT);
});