var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();

chai.use(chaiAsPromised);

var checkJS = require('../');

describe("hiddenFields.js", function() {
   var check = checkJS.with({
      "type": "Object",
      "schema": {
         "string": {
            "hidden": true,
            type: "String"
         },
         "number": {
            "hidden": false,
            "type": "Number"
         },
         "boolean": {
            "type": "Boolean"
         }
      }
   });

   var mainObject = {
      "string": "hello world",
      "number": "123.456",
      "boolean": "false"
   };


   before(function(done) {
      done();
   });
   after(function(done) {
      done();
   });

   describe('validation', function() {
      it('should validate a well formed object', function(done) {
         check(mainObject).should.be.fulfilled.notify(done);
      });
   });

   describe('sanitization', function() {
      it('should not show fields with hidden = true', function(done) {
         check(mainObject).should.eventually.not.have.property('string').notify(done);
      });
      it('should show fields with hidden = false', function(done) {
         check(mainObject).should.eventually.have.property('number').notify(done);
      });
      it('should show fields with hidden not setted', function(done) {
         check(mainObject).should.eventually.have.property('boolean').notify(done);
      });
   });

});
