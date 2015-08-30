(function() {

    angular.module('TaskShooterApp')
           .controller('NavController', ['$scope', '$location', 'AuthenticationService', 'toaster', function($scope, $location, authSvc, toaster) {

               $scope.signedIn = authSvc.signedIn;
               
               $scope.logout = function() {
                   authSvc.logout();
                   toaster.pop('success', 'Logged Out Successfully');
                   $location.path('/');
               };

           }]);
           // ===== end of 'NavController' function =====
})();

