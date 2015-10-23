var chai = require( 'chai' );
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();

chai.use(chaiAsPromised);

var checkJSON = require( '../' );

describe( "useTypes.js", function() {
   var checkTest = checkJSON.with({
      "type": "TestType",
      "required": true
   });
   var checkTestWithSchema = checkJSON.with({
      "type": "TestTypeWithSchema",
      "property": "testProperty",
      "required": true
   });
   var object = 'hello';
   var sanitized = 'sanitized';

   checkJSON.useType('TestType', {
      validate: function(value, schema) {
         return schema.type === 'TestType';
      },
      sanitize: function(value, schema) {
         return 'sanitized';
      }
   });
   checkJSON.useType('TestTypeWithSchema', {
      validate: function(value, schema) {
         return schema.type === 'TestTypeWithSchema' && schema.property === 'testProperty';
      },
      sanitize: function(value, schema) {
         return 'sanitized';
      }
   });

   before( function( done ) {
      done();
   } );
   after( function( done ) {
      done();
   } );

   it('should validate a new plugged type', function(done) {
      checkTest(object)
         .should.be.fulfilled
         .notify(done);
   });
   it('should validate a new plugged type that refers to schema', function(done) {
      checkTestWithSchema(object)
         .should.be.fulfilled
         .notify(done);
   });

   it('should sanitize a new plugged type', function(done) {
      checkTest(object)
         .should.eventually.equal(sanitized)
         .notify(done);
   });
   it('should sanitize a new plugged type that refers to schema', function(done) {
      checkTestWithSchema(object)
         .should.eventually.equal(sanitized)
         .notify(done);
   });



} );
