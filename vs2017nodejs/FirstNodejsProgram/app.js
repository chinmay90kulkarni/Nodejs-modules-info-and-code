var under = require("underscore");
var v = [1, 2, 3, 4, 5];

module.exports = function (firstName,lastName) {
    this.firstName = firstName;
    this.lastName = lastName;

    this.showdata = function () {
        console.log("FirstName is :" , firstName);
    }
}