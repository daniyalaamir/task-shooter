(function() {
    
    angular.module('TaskShooterApp')
           .factory('OfferService', ['FURL', '$firebase', 'AuthenticationService', '$q', 'TaskService', function(FURL, $firebase, authSvc, $q, taskSvc) {
               
               var fbReference = new Firebase(FURL);
               var user = authSvc.user;

               var Offer = {

                    offers: function(taskId) {
                        return $firebase(fbReference.child('offers').child(taskId)).$asArray();
                    },

                    makeOffer: function(taskId, offer) 
                    {
                        var task_offers = this.offers(taskId);

                        if(task_offers) {
                            return task_offers.$add(offer);
                        }
                    },

                    isOfferred: function(taskId) {

                        if(user && user.provider) 
                        {
                            var d = $q.defer();

                            $firebase(fbReference.child('offers').child(taskId).orderByChild("uid")
                                .equalTo(user.uid))
                                .$asArray()
                                .$loaded().then(function(data) {						
                                    d.resolve(data.length > 0);
                                }, function() {
                                    d.reject(false);
                                });

                            return d.promise;
                        }

                    },

                    isMaker: function(offer) {
                        return (user && user.provider && user.uid === offer.uid);
                    },

                    getOffer: function(taskId, offerId) {
                        return $firebase(fbReference.child('offers').child(taskId).child(offerId));
                    },

                    cancelOffer: function(taskId, offerId) {
                        return this.getOffer(taskId, offerId).$remove();			
                    },

                    acceptOffer: function(taskId, offerId, runnerId) 
                    {
                        var taskId_and_offerId = this.getOffer(taskId, offerId);
                        return taskId_and_offerId.$update({ accepted: true }).then(function() {

                            var get_task_by_taskId = taskSvc.getTask(taskId);
                            return get_task_by_taskId.$update({ status: 'assigned', runner: runnerId });

                        }).then(function() {
                            return taskSvc.createUserTask(taskId);
                        });
                    },

                    notifyRunner: function(taskId, runnerId) 
                    {
                        authSvc.getProfile(runnerId).$loaded().then(function(runner) 
                        {    
                            var n = {
                                 taskId: taskId,
                                   name: runner.name,
                                  email: runner.email
                            };
 
                            var notifications = $firebase(fbReference.child('notifications')).$asArray();
 
                            return notifications.$add(n);
 
                        });
                    }
               };
               
               return Offer;
               
           }]);
           // ===== end of 'OfferService' function =====
}());
