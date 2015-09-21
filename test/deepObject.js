var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();

chai.use(chaiAsPromised);

var checkJS = require('../');

describe("deepObject.js", function() {
   var check = checkJS.with({
      "type": "Object",
      "schema": {
         "string": {
            type: "String"
         },
         "level1": {
            "type": "Object",
            "schema": {
               "level2": {
                  "type": "Object",
                  "schema": {
                     "number": {
                        "type": "Number"
                     }
                  }
               },
               "boolean": {
                  "type": "Boolean"
               }
            }
         }
      }
   });

   var mainObject = {
      "string": "hello world",
      "level1": {
         "level2": {
            "number": "123.456"
         },
         "boolean": "false"
      }
   };
   var sanitizedObject = {
      "string": String("hello world"),
      "level1": {
         "level2": {
            "number": Number("123.456")
         },
         "boolean": Boolean("false")
      }
   };

   var tooManyKeys = {
      "string": "hello world",
      "level1": {
         "level2": {
            "number": "123.456",
            "otherKey": "otherWalue"
         },
         "boolean": "false",
         "otherKey": "otherWalue"
      },
      "otherKey": "otherWalue"
   };
   var missingKey = {
      "level1": {
         "boolean": "false"
      }
   };
   var missingError = {
      string: 'should exists and be a valid String',
      level1: {
         // TODO Edit the library to make an error like:
         // "level2": {
         //    "number": "should exists and be a valid Number"
         // }
         level2: 'should exists and be a valid Object'
      }
   };
   var invalidObject = {
      "level1": {
         "string": "hello world",
         "level2": {
            "level3": {
               "number": "123.456"
            }
         },
         "boolean": "false"
      }
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
            .finally(done);
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
