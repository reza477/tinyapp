
function doesemailexist (inputemail) {
  for (let key in users) {
    if (inputemail === users[key].email) {
      return true
    }
  }
}

function doesemailpassexist (inputemail,inputpass) {
  for (let key in users) {
    if (inputemail === users[key].email && bcrypt.compareSync(inputpass, users[key].password)) {
      return true
    }
  }
}

function getUserByEmailPassword(inputemail,inputpass) {
  for (let key in users) {
    if (inputemail === users[key].email && bcrypt.compareSync(inputpass, users[key].password)) {
      return users[key]
    }
  }
}

module.exports = helper;