(function() {

    angular.module('TaskShooterApp')
           .controller('BrowseController', ['$scope', 
                                            '$routeParams', 
                                            'toaster', 
                                            'TaskService', 
                                            'AuthenticationService', 
                                            'CommentService', 
                                            'OfferService', 
            function($scope, $routeParams, toaster, taskSvc, authSvc, commentSvc, offerSvc) {
                   $scope.searchTask = '';
                   $scope.browseAllTasks = taskSvc.all;
                   $scope.signedIn = authSvc.signedIn;  
                   $scope.listMode = true;

               if($routeParams.taskId) 
               {
                   var task = taskSvc.getTask($routeParams.taskId).$asObject();
                   $scope.listMode = false;
                   setSelectedTask(task);
               }
               
               function setSelectedTask(task) {
                   $scope.selectedTask = task;

                   if($scope.signedIn()) 
                   {
                       offerSvc.isOfferred(task.$id).then(function(data) {
                           $scope.alreadyOffered = data;
                       });

                       $scope.isCreator = taskSvc.isTaskCreator;
                       $scope.isOpen = taskSvc.isTaskOpen;
                       $scope.block = false;
                       $scope.isOfferMaker = offerSvc.isMaker;
                       $scope.isAssignee = taskSvc.isAssignee;
                       $scope.isCompleted = taskSvc.isTaskCompleted;
                   }

                   $scope.allComments = commentSvc.getComments(task.$id);
                   $scope.offers = offerSvc.offers(task.$id);
               }

               $scope.cancelTask = function(taskId) {
                   taskSvc.cancelTask(taskId).then(function() {
                       toaster.pop('success', 'This task is cancelled successfully');
                   });
               };

               $scope.completeTask = function(taskId) {
                   taskSvc.completeTask(taskId).then(function() {
                       toaster.pop('success', 'Congratulation! You have completed this task');
                   });
               };

               $scope.user = authSvc.user;
    
               $scope.addComment = function() {
                   var comment = {
                      content: $scope.content,  
                         name: $scope.user.profile.name,
                     gravatar: $scope.user.profile.gravatar 
                   };

                   commentSvc.addComment($scope.selectedTask.$id, comment).then(function() {
                       $scope.content = '';
                   });
               };

               $scope.makeOffer = function() 
               {
                   var offer = {
                       total: $scope.total,       
                       uid: $scope.user.uid,                      
                       name: $scope.user.profile.name,             
                       gravatar: $scope.user.profile.gravatar      
                   };
          
                   offerSvc.makeOffer($scope.selectedTask.$id, offer).then(function() 
                   {
                       toaster.pop('success', 'Your offer has been placed');
                       $scope.total = '';
                       $scope.block = true;
                       $scope.alreadyOffered = true;
                   });
               };
  
               $scope.cancelOffer = function(offerId) 
               {
                   offerSvc.cancelOffer($scope.selectedTask.$id, offerId).then(function() 
                   {
                       toaster.pop('success', "Your offer has been cancelled.");
                       $scope.alreadyOffered = false;
                       $scope.block = false;			
                   });
               };
               
               $scope.acceptOffer = function(offerId, runnerId)
               {
                   offerSvc.acceptOffer($scope.selectedTask.$id, offerId, runnerId).then(function()
                   {
                       toaster.pop('success', "Offer is accepted successfully");
                       offerSvc.notifyRunner($scope.selectedTask.$id, runnerId);
                   });
               };

           }]);
           // ===== end of 'BrowseController' function =====
}());