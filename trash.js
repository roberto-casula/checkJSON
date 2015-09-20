var filter = {
   errorCollector = Collector(),

   filterArray: function( array, schema, prefix ) {
      var deferred = Q.defer();

      var result = {};
      var errors = [];

      _.forEach( array, function( value, key ) {
         var pre = prefix + '[' + key + ']';
         this.filter( value, schema, pre );
      } );

      return deferred.promise;
   },

   filterObject: function( object, schema, prefix ) {
      var deferred = Q.defer();
      var collect  = this.errorCollector.collect;
      var self     = this;

      //async execution in case of big objects!
      process.nextTick( function() {

         //since the recursive check routines are promises, I have to
         //collect them
         var promises = [];

         //but promises do not save the propery name, so I have to remember it
         var keys = [];

         //for sure I have to reject on error === true
         var error = false;

         _.forOwn( schema, function( subSchema, key ) {

            //the propery name in dot notation
            var name = prefix + '.' + key;

            //collect the fail of require
            if( value.required && !object[ key ] ) {
               error = true;
               collect( name, 'is required' );
            } else

            //recursive check if object exists
            if( object.hasOwnProperty( key ) ) {
               promises.push = self.filter( object[key], subSchema, pre );
            } else {

               //if I go here means that the property with current key
               //is not required and is not present in the object
            }
         } );

         } else {
            Q.allSettled( promises )
               .then( function( results ) {
                  results.forEach(function (result) {
                     if( result.state === 'fullfilled' ) {

                     }
                  }
               } )
               .cathc();
         }
      } )

      return deferred.promise();
   },
}
