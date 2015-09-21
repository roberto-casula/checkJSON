var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();

chai.use(chaiAsPromised);

var checkJS = require('../');

describe("simpleArray.js", function() {
   var check = checkJS.with({
      "type": "Array",
      "schema": {
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
      }
   });

   var mainObject = [
      {
         "string": "Gallina scripsit",
         "number": "768",
         "boolean": "true"
      },
      {
         "string": "Quis leget haec?",
         "number": "0.35535",
         "boolean": "false"
      },
      {
         "string": "Tiro est",
         "number": "19107",
         "boolean": "true"
      }
     ];
   var sanitizedObject = [
      {
         "string": String("Gallina scripsit"),
         "number": Number("768"),
         "boolean": Boolean("true")
      },
      {
         "string": String("Quis leget haec?"),
         "number": Number("0.35535"),
         "boolean": Boolean("false")
      },
      {
         "string": String("Tiro est"),
         "number": Number("19107"),
         "boolean": Boolean("true")
      }
     ];

   var tooManyKeys = [
      {
         "string": "Gallina scripsit",
         "number": "768",
         "boolean": "true",
         "otherKey": "otherWalue"
      },
      {
         "string": "Quis leget haec?",
         "number": "0.35535",
         "boolean": "false",
         "otherKey": "otherWalue"
      },
      {
         "string": "Tiro est",
         "number": "19107",
         "boolean": "true",
         "otherKey": "otherWalue"
      }
     ];
   var missingKey = [
      {
         "string": "Gallina scripsit",
         "number": "768",
         "boolean": "false",
         "otherKey": "otherWalue"
      },
      {
         "string": "Quis leget haec?",
         "boolean": "false",
         "otherKey": "otherWalue"
      },
      {
         "number": "1D107",
         "boolean": "true",
         "otherKey": "otherWalue"
      }
     ];
   var missingError = [
      /*no error for first element*/,
      {
         number: 'should exists and be a valid Number'
      },
      {
         string: 'should exists and be a valid String',
         number: 'should be a valid Number'
      }
   ];
   var invalidObject = [
      {
         "string": "Gallina scripsit",
         "number": "768,1321",
         "boolean": "ture"
      },
      {
         "string": "Quis leget haec?",
         "number": "a1341",
         "boolean": "sefal"
      },
      {
         "string": "Tiro est",
         "number": "1d107",
         "boolean": "true"
      }
     ];

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
