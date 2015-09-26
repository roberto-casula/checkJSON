var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();

chai.use(chaiAsPromised);

var checkJS = require('../');

describe("maxDeep.js", function() {
	var schema = {
		"type": "Object",
		"required": true,
		"schema": {
			"level1": {
				"type": "Object",
				"required": true,
				"schema": {
					"level2": {
						"type": "Object",
						"required": true,
						"schema": {
							"level3": {
								"type": "Object",
								"required": true,
								"schema": {
									"string": {
										"type": "String",
										"required": true
									}
								}
							},
							"string": {
								"type": "String",
								"required": true
							}
						}
					},
					"string": {
						"type": "String",
						"required": true
					}
				}
			},
			"string": {
				"type": "String",
				"required": true
			}
		}
	};

	var mainObject = {
		"level1": {
			"level2": {
				"level3": {
					"string": "I'm at level4"
				},
				"string": "I'm at level3"
			},
			"string": "I'm at level2"
		},
		"string": "I'm at level1"
	};

	var sanitized1 = {
		"level1": {},
		"string": "I'm at level1"
	}
	var sanitized2 = {
		"level1": {
			"level2": {},
			"string": "I'm at level2"
		},
		"string": "I'm at level1"
	}

	before(function(done) {
		done();
	});
	after(function(done) {
		done();
	});

	// describe('validation', function() {});

	describe('sanitization', function() {
		it('should not trim (only if deep < maxDeep) level by default', function(done) {
         var check = checkJS.with(schema);
         check(mainObject)
            .should.become(mainObject)
            .notify(done);
		});
      it('should trim at level2 by default', function(done) {
         var check = checkJS.with(schema).trimAtDeep(2);
         check(mainObject)
            .should.become(sanitized2)
            .notify(done);
		});
      it('should trim at level1 by default', function(done) {
         var check = checkJS.with(schema).trimAtDeep(1);
         check(mainObject)
            .should.become(sanitized1)
            .notify(done);
		});
	});

});
