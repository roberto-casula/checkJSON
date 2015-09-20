var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();

chai.use(chaiAsPromised);

var checkJS = require('../');

describe("simpleObject.js", function() {
   var check = checkJS.with({
      "type": "Object",
      "schema": {
         "string": {
            type: "String"
         },
         "number": {
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
   var sanitizedObject = {
      "string": String("hello world"),
      "number": Number("123.456"),
      "boolean": Boolean("false")
   };

   var tooManyKeys = {
      "string": "hello world",
      "number": "123.456",
      "boolean": "false",
      "otherKey": "otherWalue"
   };
   var missingKey = {
      "string": "hello world",
      "boolean": "false"
   };
   var missingError = {
      "number": "should exists and be a valid Number"
   };
   var invalidObject = {
      "string": "hello world",
      "number": "hello world",
      "boolean": "hello world"
   };

   before(function(done) {
      done();
   });
   after(function(done) {
      done();
   });

   describe('validation', function() {
      it('should validate a well formed object', function(done) {
         check(mainObject)
            .should.be.fulfilled
            .notify(done);
      });
      it('should validate an object with too many keys', function(done) {
         check(tooManyKeys)
            .should.be.fulfilled
            .notify(done);
      });
      it('should reject an object with missingKey', function(done) {
         check(missingKey)
            .should.be.rejected
            .notify(done);
      });
      it('should reject an object that is not well formed', function(done) {
         check(invalidObject)
            .should.be.rejected
            .notify(done);
      });
      it('should return the expected error', function(done) {
         check(missingKey)
            .then(function(result) {
               should.not.exists(result);
            })
            .catch(function(error) {
               error.should.be.deep.equal(missingError);
            })
            .finally( done );
      });
   });

   describe('sanitization', function() {
      it('should sanitize a well formed object', function(done) {
         check(mainObject)
            .should.become(sanitizedObject)
            .notify(done);
      });
      it('should sanitize an object with too many keys', function(done) {
         check(tooManyKeys)
            .should.become(sanitizedObject)
            .notify(done);
      });
   });

});
