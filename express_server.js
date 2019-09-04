const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser')

app.use(cookieParser())


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
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
  // DELETE
app.post("/urls/:shortURL/delete", (req, res) =>{
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

  // EDIT
app.post("/urls/:shortURL/edit", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);

});

  // Username
app.post("/login", (req, res) => {
  res.cookie('username',req.body.username)
  res.redirect("/url")
})

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect("/url")
})


app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL
  res.redirect("/urls/" + shortURL)
});

app.get("/urls",(req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.post("/urls/new", (req, res) => {
  res.render("");
});

// app.get('*', (request, response) => {
//   response.redirect('/cookies');
// });

app.get("/urls/:shortURL",(req, res) => {
  let templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}
  res.render("url_shows", templateVars);
});

app.get("/url", (req, res) => {
  let templateVars = { username: req.cookies["username"], urls: urlDatabase, test :"test" };
  res.render("urls_index", templateVars);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});