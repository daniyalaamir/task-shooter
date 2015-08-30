(function() {

    angular.module('TaskShooterApp')
           .factory('DashboardService', ['FURL', '$firebase', '$q', function(FURL, $firebase, $q) {
               
               var fbReference = new Firebase(FURL);

               var Dashboard = {

                    getTasksForUser: function(uid) 
                    {
                        var defer = $q.defer();
                        
                        $firebase(fbReference.child('user_tasks').child(uid)).$asArray().$loaded().then(function(tasks) {					
                                defer.resolve(tasks);
                            
                            }, function(err) {
                                defer.reject();
                            
                            });

                        return defer.promise;
                    }

               };
               
               return Dashboard;
               
           }]);
           // ===== end of 'DashboardService' function =====
}());
