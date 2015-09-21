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
   testType: function testType(value, schema) {
      var deferred = Promise.defer();

      if (this.validate(value, schema)) {
         deferred.resolve(this.sanitize(value, schema));
      } else {
         deferred.reject('should be a valid ' + schema.type);
      }

      return deferred.promise;
   },

   testObject: function testObject(argument, schema) {
      var deferred = Promise.defer();

      process.nextTick(function() {
         var promises = [],
            keys = [];
         _.forOwn(schema, function(subSchema, key) {
            var required, value;
            required = subSchema.required !== false;
            value = argument[key];
            keys.push(key);

            if (!_.isUndefined(value)) {
               promises.push(this.testWithSchema(value, subSchema));
            } else
            if (required && _.isUndefined(value)) {
               promises.push(
                  Promise.reject('should exists and be a valid ' + subSchema.type)
               );
            }
         }, this);

         Promise.settle(promises).then(function(results) {
            var reject = false,
               object = {},
               errors = {};

            _.forEach(results, function(result, i) {
               var key = keys[i];

               if (!reject && result.isFulfilled()) {
                  object[key] = result.value();
               } else
               if (result.isRejected()) {
                  reject = true;
                  errors[key] = result.reason();
               }
            });
            if (reject) {
               return deferred.reject(errors)
            } else {
               return deferred.resolve(object);
            }
         });

      }.bind(this));

      return deferred.promise;
   },

   testArray: function testObject(argument, schema) {
      var deferred = Promise.defer();

      process.nextTick(function() {
         var promises, subSchema;
         promises = [];
         subSchema = schema.schema;

         _.forEach(argument, function(value) {
            promises.push(this.testWithSchema(value, subSchema));
         }, this);

         Promise.settle(promises).then(function(results) {
            var reject = false,
               vector = [],
               errors = [];

            _.forEach(results, function(result, i) {
               if (!reject && result.isFulfilled()) {
                  vector[i] = result.value();
               } else
               if (result.isRejected()) {
                  reject = true;
                  errors[i] = result.reason();
               }
            });
            if (reject) {
               return deferred.reject(errors)
            } else {
               return deferred.resolve(vector);
            }
         });

      }.bind(this));

      return deferred.promise;
   },

   testWithSchema: function testWithSchema(argument, schema) {
      if (schema.type === 'Object') {
         return this.testObject(argument, schema.schema);
      } else
      if (schema.type === 'Array') {
         return this.testArray(argument, schema)
      } else {
         return this.testType(argument, schema);
      }
   },
   test: function test(argument) {
      var schema = this.schema;
      return this.testWithSchema(argument, schema);
   }
};

var check = function(argument, schema) {
   return prototype.testWithSchema(argument, schema);
};
check.with = function(schema) {
   var result = function(argument) {
      return result.instance.test(argument);
   };
   result.instance = Object.create(prototype);
   result.instance.schema = schema;
   return result;
};

module.exports = check;
