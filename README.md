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
var sanitized = checkJSON(myObject, schema);
console.log(sanitized);
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
var sanitized = check(myObject, schema);
console.log(sanitized);
```

## The schema
### what is a schema?
A schema is a JSON object that recursively describes the class for the object that you have to check.

The object footprint is the follow (where `|` means alternative):

```javascript
{
   "type": "Object|Array|String|Number", // this is the data types
   ""
}
```

It's important for you undestanding that the schema is the input for the [validator](#The validator) and the [sanificator](#The sanificator).

### default schema
With the default schema you can check and sanitize the defaults javascript types

### more types
## The validator
## The sanificator
## Various
