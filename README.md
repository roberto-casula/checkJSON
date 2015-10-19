# checkJSON
A JSON validator with schema and sanification(optional). The validation is performed with a depth-first search on the schema object.

You can perform a check simply providing the object and the schema to CheckJS function:

```javascript
var checkJSON = require('check-js');
//
var schema = {
   "type": "Object",
   "schema": {
      "property1": {
         "type": "String"
      },
      "property2": {
         "type": "Number"
      }
   }
};
var myObject = {
   "property1": "hello world",
   "property2": "80085"
}
checkJSON(myObject, schema)
   .then(function(sanitized) {
      console.log(sanitized);
   })
   .catch(function(err){
      throw err;
   });
```

Or creating a checker instance then invoke it:

```javascript
var checkJSON = require('check-js');
//
var check = checkJSON.with({
   "type": "Object",
   "schema": {
      "property1": {
         "type": "String"
      },
      "property2": {
         "type": "Number"
      }
   }
});
var myObject = {
   "property1": "hello world",
   "property2": "80085"
}
checkJSON(myObject, schema)
   .then(function(sanitized) {
      console.log(sanitized);
   })
   .catch(function(err){
      throw err;
   });
```

## The schema
### what is a schema?
A schema is a JSON object that recursively describes the class for the object that you have to check.

The schema object footprint is the follow (where `|` means alternative):

```javascript
{
   // this is the data types
   "type": "Object|Array|String|Number",
   //is the field required to continue the validation?, default true
   "required": true|false,

   //only if the type is Object, this field will trim the subObject, default false
   "hidden": true|false,
    //only if Object or Array here you should specify the shubSchema
   "schema": {schemaObject},

   //the description of the field
   "description": "this is a string"
}
```
please note that the schemaObject of an Object or an Array is recursively defined
with the required `"schema"` property.

It's important for you undestanding that the schema is the input for the [validator](#The validator) and the [sanificator](#The sanificator).

### Schema Keys as Regular Expression
You can also describe an Object-Schema field with a regular expression (RegExp).
In this case checkJSON will perform a search in the entire (sub)Object for the specified object.

You can pass the regular expression with a string that starts with `^` and ends with `$`,
checkJSON will automatically recognize that is a regular expression than will perform the check.

*Make attention that all the regular-expression keys are **never required**
and if a required property is set it will be ignored.*

exempli grazia I can check for an object that has zero or more fields with the
keyword `id_` followed by a mongodb id.
```javascript
var checkJSON = require('checkJSON');

var check = checkJSON.with({
   "type": "Object",
   "schema": {
      "^id_[a-f0-9]{24}$": {
         "type": "Object"
         "schema": {
            "foo": {
               "type": "String"
            }
         }
      }
   }
})

var object = {
   "id_55f7ec6b584fc8632af44d5d": {
      "foo": "fooz"
   },
   "id_561655d60f5d4e9f6c254ab8": {
      "foo": "bar"
   }
};
console.log(check(object));
```

### Default
With the default configuration you can distinguish validate and sanitize:

#### single variables:

```javascript
var checkJSON = require('checkJSON');

var checkBool = checkJSON.with({
 "type": "Boolean"
});
var checkNumber = checkJSON.with({
 "type": "Number"
});
var checkString = checkJSON.with({
 "type": "String"
});

checkBool('true').then(function(sanified) {
   console.log(typeof sanified);
   console.log(sanified);
});
checkNumber('455.538').then(function(sanified) {
   console.log(typeof sanified);
   console.log(sanified);
});
checkString("Hello World!").then(function(sanified) {
   console.log(typeof sanified);
   console.log(sanified);
});
```

#### Objects
#### Arrays
### extends the schema footprint
## The validator
## The sanificator
## The sieve
The sieve() function is the provided interface to decide if a subfield should be
passed to the validator and then to the sanificator.
The default sieve is:
```javascript
/**
* Return true if the (sub)Value will be checked and put in the sanitized object
* The default sieve is used to check for hidden fields.
*/
sieve: function(value, subSchema, deep) {
   return subSchema.hidden !== true && deep <= this.maxDeep;
},
```
It means that the considered subfield should be validate and then put in the
sanitized result only if the hidden value of the schema is not equal to true and
if the current deep is not less than or equal to the maxDeep.

You can replace the sieve function with ```check.use('sieve', func(value, schema, deep, defaultSieve))```

## Various
