(function() {
    
    angular.module('TaskShooterApp')
           .factory('CommentService', ['FURL', '$firebase', function(FURL, $firebase) {
               
               var fbReference = new Firebase(FURL);

               var Comment = {

                       getComments: function(taskId) {
                            return $firebase(fbReference.child('comments').child(taskId)).$asArray();
                       },

                       addComment: function(taskId, newComment) 
                       {
                           var task_comments = this.getComments(taskId);
                           newComment.datetime = Firebase.ServerValue.TIMESTAMP;

                           if(task_comments) {
                               return task_comments.$add(newComment);
                           }
                       }

                   };
               
               return Comment;
    
           }]);
           // ===== end of 'CommentService' function =====
}());
