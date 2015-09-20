var chai = require( 'chai' );
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();

chai.use(chaiAsPromised);

var check = require( '../' );

describe( "simpleType.js", function() {
   var stringSchema = {
      "type": "String",
      "required": true
   };
   var numberSchema = {
      type: "Number",
      "required": true
   };
   var booleanSchema = {
      "type": "Boolean",
      "required": true
   };

   var str = "hello";
   var num = "123.12";
   var bool = "true";

   before( function( done ) {
      done();
   } );
   after( function( done ) {
      done();
   } );

   describe( 'validation', function() {
      it( 'should validate a string', function( done ) {
         check( str, stringSchema )
            .should.be.fulfilled
            .notify(done);
      } )
      it( 'should validate a number', function( done ) {
         check( num, numberSchema )
            .should.be.fulfilled
            .notify(done);
      } )
      it( 'should validate a boolean', function( done ) {
         check( bool, booleanSchema )
            .should.be.fulfilled
            .notify(done);
      } )
   } );

   describe( 'rejection', function() {
      it( 'should reject a string with booleanSchema', function( done ) {
         check( str, booleanSchema )
            .should.be.rejected
            .notify(done);
      } )
      it( 'should reject a number with StringSchema', function( done ) {
         check( Number(num), stringSchema )
            .should.be.rejected
            .notify(done);
      } )
      it( 'should reject a boolean with numberSchema', function( done ) {
         check( Boolean(bool), numberSchema )
            .should.be.rejected
            .notify(done);
      } )
   } );

   describe( 'sanitization', function() {
      it( 'should sanitize a string', function( done ) {
         check( str, stringSchema )
            .should.eventually.be.a('string')
            .notify(done);
      } )
      it( 'should sanitize a number', function( done ) {
         check( num, numberSchema )
            .should.eventually.be.a('number')
            .notify(done);
      } )
      it( 'should sanitize a boolean', function( done ) {
         check( bool, booleanSchema )
            .should.eventually.be.a('boolean')
            .notify(done);
      } )
   } );

} );
