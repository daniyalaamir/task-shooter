(function() {

    angular.module('TaskShooterApp')
           .controller('TaskController', ['$scope', 
                                          '$location', 
                                          'toaster', 
                                          'TaskService', 
                                          'AuthenticationService', 
            function($scope, $location, toaster, taskSvc, authSvc) {

                        $scope.createTask = function() 
                        {
                            $scope.task.status = 'open';                          
                            $scope.task.gravatar = authSvc.user.profile.gravatar;  
                            $scope.task.name = authSvc.user.profile.name;          
                            $scope.task.poster = authSvc.user.uid;                  
                    
                            taskSvc.createTask($scope.task).then(function(dataReturnFromFirebaseValue) 
                            {
                                toaster.pop('success', 'Task created successfully.');
                                $scope.task = 
                                {
                                    title: '',
                                    description: '',
                                    total: '',
                                    status: 'open',
                                    gravatar: '',
                                    name: '',
                                    poster: ''
                                };
                                $location.path('/browse/' + dataReturnFromFirebaseValue.key());
                            });
                        };                                                            

                        $scope.editTask = function(task) 
                        {
                           taskSvc.editTask(task).then(function() 
                           {
                               toaster.pop('success', 'Task is updated.');
                           });
                        };
           }]);
}());