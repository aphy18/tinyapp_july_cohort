const generateRandomString = length => {
  let r = Math.random().toString(36).substring(length);
  return r;
};
  
const isEmailBeingUsed =  (users, email) => {
  for (let id in users) {
    if (email === users[id].email) {
      return users[id];
    }
  }
  return false;
};
  
const urlsForUser = (id,db) => {
  const userURLs = {};
  for (let url in db) {
    if (db[url].userID === id) {
      userURLs[url] = db[url];
    }
  }
  return userURLs;
};

const checkIfEmailsExist = (email, db) => {
  for (let id in db) {
    console.log(id);
    if (email === db[id].email) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  isEmailBeingUsed,
  urlsForUser,
  checkIfEmailsExist
};