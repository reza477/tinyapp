const express = require("express");
const app = express();
const PORT = 8080; 
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const helper = require('./views/helper')


var cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ['hmjg'],

  maxAge: 24 * 60 * 60 * 1000 
}))

app.set('view engine', 'ejs');

function generateRandomString() {
  var randAlphNum = ''
  var char = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
  for (let i = 0; i < 6; i++) {
    var randomNumber = Math.floor(Math.random() * Math.floor(char.length))
    randAlphNum += char[randomNumber]
  }
  return randAlphNum
}

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("12", 10)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
const getUserByEmail = function(email, database) {
  user = {}
  for (let key in database) {
    if (email === database[key].email) {
      user[key] = database[key]
      return user;
    }
  }
};

const urlDatabase = {
  b6UTxQ: 
    { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr:
    { longURL: "https://www.google.ca", userID: "userRandomID" }
};
app.post("/urls/:shortURL/delete", (req, res) =>{
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect(`/urls/${shortURL}`);

});

app.post("/logout", (req, res) => {
  req.session = null
  // res.clearCookie('user_id')
  res.redirect("/urls")
})

app.get("/register", (req, res) => {
  res.render("register")
});

app.post("/register", (req, res) => {

  
  let randomId = generateRandomString()
  const username = req.body.username
  const password = req.body.password
  if (username === "" || username === undefined || password === "" || password === undefined) {
    res.status(400);
    res.send("You shall not pass, (Missing username or Password)")
    return
  } 
  if (helper.doesemailexist(username,users)) {
    res.status(400);
    res.send("You shall not pass, Missing username or Password")
    return
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  users[randomId] = {
    id: randomId,
    email: username,
    password: hashedPassword,
  };
  

  
  req.session.user_id = randomId;
  req.session.email = username
  res.redirect("/urls")
})

app.get("/login", (req, res) => {
  res.render("login")
});


app.post("/login", (req, res) => {
  const email = req.body.username
  const password = req.body.password
  if ( !helper.doesemailexist(email, users)) {
    res.status(403)
    res.send('Can i interest you in registering?')
    return
  } 
    const user = helper.getUserByEmailPassword(email, password, users)
    const userId = user.id
  req.session.user_id = userId
  

  res.redirect("/urls")
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  
  let userId = req.session.user_id
  urlDatabase[shortURL] = {longURL:longURL , userID:userId}
  res.redirect("/urls/" + shortURL)
});

app.get("/urls/new", (req,res) => {
    let userId = req.session.user_id
    let user = users[userId]
    
    let templateVars = { user }
    res.render("urls_new", templateVars);
  });

app.get("/", (req, res) => {
  res.redirect("/urls")
  // res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/u/:shortURL", (req, res) => { 
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL].longURL
  
  res.redirect("https://" + longURL);
});

app.get("/urls/:shortURL",(req, res) => {
  let userId = req.session.user_id
  let user = users[userId]
  if (urlDatabase[req.params.shortURL].userID !== userId) {
      res.redirect("/login")
  }

  let templateVars = { user, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL}
  res.render("url_shows", templateVars);
 
});
app.get("/urls", (req, res) => {
  let userId = req.session.user_id
  let user = users[userId]
  userURLs = {}
  for (let key in urlDatabase) {
    
    if (urlDatabase[key].userID === userId) {

      userURLs[key] = urlDatabase[key]
    }
  }
  let templateVars = { user, urls: userURLs, test :"test" };
  res.render("urls_index", templateVars);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});