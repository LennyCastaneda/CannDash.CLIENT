(function() {
    'use strict';

    angular
        .module('cannDash')
        .factory('dispensaryFactory', dispensaryFactory);

    dispensaryFactory.$inject = ['$http', '$q', 'toastr', 'apiUrl'];

    /* @ngInject */
    function dispensaryFactory($http, $q, toastr, apiUrl) {
        var service = {
            addDispensary: addDispensary,
            getByDispensary: getByDispensary
        };
        return service;

        //////////////////////////

        function addDispensary(dispensary) {
             var defer = $q.defer();

             $http.post(apiUrl + '/dispensaries', dispensary)
                  .then(
                       function(response) {
                            defer.resolve(response.data);
                            toastr.success('Successfully added dispensary', 'Saved');
                       },
                       function(error) {
                            defer.reject(error);
                            toastr.error('Error adding dispensary', 'Error');
                       }
                  );

             return defer.promise;
        }

        function getByDispensary(id) {
             var defer = $q.defer();

             $http.get(apiUrl + '/dispensaries/' + id)
                  .then(
                       function(response) {
                            defer.resolve(response.data);
                       },
                       function(error) {
                            defer.reject(error);
                            toastr.error('Error getting dispensary detail', 'Error');
                       }
                  );

             return defer.promise;
        }
    }
})();