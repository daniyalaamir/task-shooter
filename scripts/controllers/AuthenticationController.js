(function() {

    angular.module('TaskShooterApp')
           .controller('AuthenticationController', ['$scope', '$location', 'AuthenticationService', 'toaster', function($scope, $location, authSvc, toaster) {
     
               $scope.register = function(user) 
               {
                   authSvc.register(user).then(function()                    
                   {                                                             
                      toaster.pop('success', 'Registered Successfully!');      
                      $location.path('/');                                     
                   },                      
                   function(err) {
                      toaster.pop('error', "Oops, something went wrong!"); 
                   });
               };
               // ===== end of '$scope.register' function =====
               
               $scope.login = function(user) 
               {
                   authSvc.login(user).then(function() 
                   {
                       toaster.pop('success', 'Logged In Successfully!');
                       $location.path('/');
                   }, 
                   function(err) {
                       toaster.pop('error', "Oops, something went wrong!");
                   });
               };
               // ===== end of '$scope.login' function =====
               
               $scope.changePassword = function(user) 
               {
                   authSvc.changePassword(user).then(function() 
                   {
                       // Reset Form                     
                       $scope.user.email = '';                     
                       $scope.oldPass = '';                         
                       $scope.newPass = '';
                       
                       toaster.pop('success', 'Password Changed Successfully!')
                       
                   }, function(err) {
                       toaster.pop('error', "Oops, something went wrong!");
                   });
               };
               // ===== end of '$scope.changePassword' function =====
               
               if(authSvc.signedIn()) 
               {
                   $location.path('/');
               }
               
           }]);
           // ===== end of 'AuthenticationController' function =====
})();