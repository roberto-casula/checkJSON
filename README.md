# checkJS
A JSON validator with schema and sanification(optional).
_______________________________________________________________________________


The validation is performed with a depth-first search on the schema object.

**TODO:**
 - deep test for complexObjects (mixed type).
 - deep test for require flag.
 - a good method to change/extends validate and sanitize functions.
 - an adapter to use (validatorJS)[https://github.com/chriso/validator.js] as validate function and provide the respective sanitize function
   (with same types).
 - remove lodash and validatorJS as mandadory dependencies.
 - a decent README.

**DONE:**
 - trim the object at a deep `checkJS.with(schema).trimAtDeep(deep);`
 - override required with .overrideRequired();
 - default all fielda are required.
 - explore simple type.
 - explore simple Object.
 - explore Objects within an Object.
 - explore simple array (one level).
 - explore complex array (with object).

**Promise for the next major versions:**
 - fixed length, minimal length and maximal legth for the Array type.
 - array with in array, aka matrix, should be described in the schema and
   explored.
 - provide a way to describe a multi typed array (needed?)
 - recursive object definition, aka trees, should be described and explored.
