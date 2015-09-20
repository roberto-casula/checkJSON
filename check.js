var _ = require('lodash');
var Promise = require("bluebird");

var validator = require('validator');

var prototype = {

   schema: null,

   validate: function(value, schema) {
      var type = _.capitalize(schema.type);
      if (type === "String") {
         return _.isString(value);
      } else
      if (type === "Number") {
         return validator.isDecimal(value);
      } else
      if (type === "Boolean") {
         return validator.isBoolean(value);
      } else {
         throw new Error('"' + type + '" is not recognized by the validate function"');
      }
   },
   sanitize: function(value, schema) {
      var type = _.capitalize(schema.type);
      if (type === "String") {
         return String(value);
      } else
      if (type === "Number") {
         return Number(value);
      } else
      if (type === "Boolean") {
         return Boolean(value);
      } else {
         throw new Error('"' + type + '" is not recognized by the sanitize function"');
      }
   },
   testType: function testType(value, schema, prefix) {
      var deferred = Promise.defer();

      if (this.validate(value, schema)) {
         deferred.resolve(this.sanitize(value, schema));
      } else {
         deferred.reject('should be a valid ' + schema.type);
      }

      return deferred.promise;
   },

   testObject: function testObject(argument, schema, prefix) {
      var deferred = Promise.defer(),
         promises = [],
             keys = [];

      _.forOwn(schema, function(subSchema, key) {
         var dotKey = prefix + '.' + key;
         var value = argument[key];         
         keys.push( key );
         promises.push(this.testWithSchema(value, subSchema, dotKey));
      }, this);

      Promise.settle(promises).then(function(results) {
         var reject = false,
             object = {},
             errors = {};

         _.forEach( results, function( result, i ) {
            var key = keys[i];

            if( !reject && result.isFulfilled() ) {
               object[ key ] = result.value();
            } else
            if( result.isRejected() ) {
               reject = true;
               errors[ key ] = result.reason();
            }
         } );
         if( reject ) {
            return deferred.reject( errors )
         } else {
            return deferred.resolve( object );
         }

      });

      return deferred.promise;
   },

   testWithSchema: function testWithSchema(argument, schema, prefix) {
      prefix = prefix || '';
      if (schema.type === 'Object') {
         return this.testObject(argument, schema.schema, prefix);
      } else
      if (schema.type === 'Array') {
         return this.filterArray(argument, schema, prefix)
      } else {
         return this.testType(argument, schema, prefix);
      }
   },
   test: function test(argument, prefix) {
      var schema = this.schema;
      return this.testWithSchema(argument, schema, prefix);
   }
};

var check = function(argument, schema, prefix) {
   return prototype.testWithSchema(argument, schema, prefix);
};
check.with = function(schema) {
   var result = function(argument, prefix) {
      return result.instance.test(argument, prefix);
   };
   result.instance = Object.create(prototype);
   result.instance.schema = schema;
   return result;
};

module.exports = check;
