var _ = require('lodash');
var Promise = require("bluebird");

var validator = require('validator');

var prototype = {

	schema: null,
	maxDeep: 128,
	hideHidden: true,
	withRequired: true,

	validate: function(value, schema, deep) {
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
	sanitize: function(value, schema, deep) {
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

	/**
	 * Return true if the (sub)Value will be checked and put in the sanitized object
	 */
	parse: function(value, subSchema, deep) {
		return true;
	},
	testType: function testType(value, schema, deep) {
		var deferred = Promise.defer();

		if (this.validate(value, schema, deep)) {
			deferred.resolve(this.sanitize(value, schema, deep));
		} else {
			deferred.reject('should be a valid ' + schema.type);
		}

		return deferred.promise;
	},

	testObject: function testObject(argument, schema, deep) {
		var deferred = Promise.defer();
		var withRequired = this.withRequired;

		process.nextTick(function() {
			var promises = [],
				keys = [];
			_.forOwn(schema, function(subSchema, key) {

				var required, value;
				required = (subSchema.required !== false) && withRequired;
				value = argument[key];

				if (!(subSchema.hidden === true && this.hideHidden)
             && this.parse(value, subSchema, deep)) {
					if (deep > this.maxDeep) {
						return;
					} else
					if (!_.isUndefined(value)) {
						keys.push(key);
						promises.push(this.testWithSchema(value, subSchema, deep));
					} else
					if (required && _.isUndefined(value)) {
						keys.push(key);
						promises.push(
							Promise.reject('should exists and be a valid ' + subSchema.type)
						);
					}
				}
			}, this);

			if (promises.length > 0) {
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
			} else {
				deferred.resolve({});
			}

		}.bind(this));

		return deferred.promise;
	},

	testArray: function testObject(argument, schema, deep) {
		var deferred = Promise.defer();

		process.nextTick(function() {
			var promises, subSchema;
			promises = [];
			subSchema = schema.schema;

			_.forEach(argument, function(value) {
				promises.push(this.testWithSchema(value, subSchema, deep));
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

	testWithSchema: function testWithSchema(argument, schema, deep) {
		if (schema.type === 'Object') {
			return this.testObject(argument, schema.schema, deep + 1);
		} else
		if (schema.type === 'Array') {
			return this.testArray(argument, schema, deep)
		} else {
			return this.testType(argument, schema, deep);
		}
	},
	test: function test(argument) {
		var schema = this.schema;
		return this.testWithSchema(argument, schema, 0);
	}
};

var check = function(argument, schema) {
	return prototype.testWithSchema(argument, schema);
};
check.with = function(schema) {
	var result, checkObj;
	checkObj = Object.create(prototype);
	checkObj.schema = _.cloneDeep(schema);

	//this function is an object with chain language
	result = function(argument) {
		return result.instance.test(argument);
	};
	result.overrideRequired = function() {
		checkObj.withRequired = false;
		return result;
	};
	result.trimAtDeep = function(deep) {
		checkObj.maxDeep = deep;
		return result;
	};
	result.use = function(what, func) {
		if (what === 'validator') {
			checkObj.validate = function(value, schema, deep) {
				return func(value, schema, deep, prototype.validate);
			};
		} else
		if (what === 'sanitizer') {
			checkObj.sanitize = function(value, schema, deep) {
				return func(value, schema, deep, prototype.sanitize);
			};
		} else
		if (what === 'parse') {
			checkObj.parse = function(value, schema, deep) {
				return func(value, schema, deep, prototype.parse);
			};
		}
		return result;
	};
	result.instance = checkObj;
	return result;
};

module.exports = check;
