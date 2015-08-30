(function() {

    angular.module('TaskShooterApp')
           .controller('DashboardController', ['$scope', 'DashboardService', 'AuthenticationService', function($scope, dashboardSvc, authSvc) {
     
               $scope.taskPoster = [];
               $scope.taskRunner = [];
               var uid = authSvc.user.uid;
               
               dashboardSvc.getTasksForUser(uid).then(function(tasks) 
               {
                    for(var i=0; i<tasks.length; i++) 
                    {
                        tasks[i].type ? $scope.taskPoster.push(tasks[i]) : $scope.taskRunner.push(tasks[i]);
                    }

                    $scope.numPoster = $scope.taskPoster.length;
                    $scope.numRunner = $scope.taskRunner.length;
               });

           }]);
           // ===== end of 'DashboardController' function =====
})();