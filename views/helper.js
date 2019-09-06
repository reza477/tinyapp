
const bcrypt = require('bcrypt');

function doesemailexist (inputemail,users) {
  for (let key in users) {
    if (inputemail === users[key].email) {
      return true
    }
  }
}

function doesemailpassexist (inputemail,inputpass,users) {
  for (let key in users) {
    if (inputemail === users[key].email && bcrypt.compareSync(inputpass, users[key].password)) {
      return true
    }
  }
}

function getUserByEmailPassword(inputemail,inputpass,users) {
  for (let key in users) {
    if (inputemail === users[key].email && bcrypt.compareSync(inputpass, users[key].password)) {
      return users[key]
    }
  }
}

module.exports = {
  doesemailexist,
  doesemailpassexist,
  getUserByEmailPassword
};