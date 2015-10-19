var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();

chai.use(chaiAsPromised);

var checkJSON = require('../');

describe("keysAsRegExp.js", function() {
   var check = checkJSON.with({
      "type": "Object",
      "schema": {
         "^id_[a-f0-9]{24}$": {
            "type": "Object",
            "schema": {
               "foo": {
                  "type": "Number"
               }
            }
         }
      }
   });
   var checkMixed = checkJSON.with({
      "type": "Object",
      "schema": {
         "^id_[a-f0-9]{24}$": {
            "type": "Object",
            "schema": {
               "foo": {
                  "type": "Number"
               }
            }
         },
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
      "id_55f7ec6b584fc8632af44d5d": {
         "foo": "1093175"
      },
      "id_561655d60f5d4e9f6c254ab8": {
         "foo": "4090985"
      }
   };
   var tooManyKeys = {
      "id_55f7ec6b584fc8632af44d5d": {
         "foo": "1093175"
      },
      "id_561655d60f5d4e9f6c254ab8": {
         "foo": "4090985"
      },
      "otherKey": "otherWalue"
   };

   var sanitizedObject = {
      "id_55f7ec6b584fc8632af44d5d": {
         "foo": Number("1093175")
      },
      "id_561655d60f5d4e9f6c254ab8": {
         "foo": Number("4090985")
      }
   };

   var mixed = {
      "id_55f7ec6b584fc8632af44d5d": {
         "foo": Number("1093175")
      },
      "id_561655d60f5d4e9f6c254ab8": {
         "foo": Number("4090985")
      },
      "string": "hello world",
      "number": "123.456",
      "boolean": "false",
      "otherKey": "otherWalue"
   };
   var sanitizedMixed = {
      "id_55f7ec6b584fc8632af44d5d": {
         "foo": Number("1093175")
      },
      "id_561655d60f5d4e9f6c254ab8": {
         "foo": Number("4090985")
      },
      "string": String("hello world"),
      "number": Number("123.456"),
      "boolean": Boolean("false"),
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
      it('should validate a mixed object (keys as String and keys ad RegExp)', function(done) {
         checkMixed(mixed)
            .should.be.fulfilled
            .notify(done);
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
      it('should sanitize a mixed object (keys as String and keys ad RegExp)', function(done) {
         checkMixed(mixed)
            .should.become(sanitizedMixed)
            .notify(done);
      });
   });

});
