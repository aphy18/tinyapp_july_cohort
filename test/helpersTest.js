const { assert } = require('chai');

const { checkIfEmailsExist } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', () => {
    const result = checkIfEmailsExist("user@example.com", testUsers);
    console.log("result", result);
    const expectedOutput = true;
    assert.strictEqual(result, expectedOutput);
    
   
  });
  it('should return undefined with a non-valid email', () => {
    const result = checkIfEmailsExist(testUsers, "blah@example.com");
    const expectedOutput = false;
    assert.strictEqual(result, expectedOutput);
  });
});
