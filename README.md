# checkJS
A JSON validator with schema and sanification(optional).
_______________________________________________________________________________


The validation is performed with a depth-first search on the schema object.

**TODO:**
 - deep test for complexObjects (mixed type).
 - deep test for require flag.
 - a good method to change validate and sanitize functions.
 - a decent README.

**DONE:**
 - explore simple type.
 - explore simple Object.
 - explore Objects within an Object.
 - explore simple array (one level).
 - explore complex array (with object).

**Promise for the next versions:**
 - array with in array, aka matrix, should be described in the schema and
   explored.
 - provide a way to describe a multi typed array (needed?)
 - recursive object definition, aka trees, should be described and explored.
