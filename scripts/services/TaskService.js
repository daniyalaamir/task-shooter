(function() {
    
    angular.module('TaskShooterApp')
           .factory('TaskService', ['FURL', '$firebase', 'AuthenticationService', function(FURL, $firebase, authSvc) {
  
               var fbReference = new Firebase(FURL);
               var tasks = $firebase(fbReference.child('tasks')).$asArray();
               var currentUser = authSvc.user;
               
               var Task = {

                   all: tasks,

                   getTask: function(taskId) {
                       return $firebase(fbReference.child('tasks').child(taskId));
                   },

                   createTask: function(task) {
                       task.datetime = Firebase.ServerValue.TIMESTAMP;
                       return tasks.$add(task).then(function(newTask) {
                           var obj = {
                               taskId: newTask.key(),
                                 type: true,
                                title: task.title
                           };
                           
                           $firebase(fbReference.child('user_tasks').child(task.poster)).$push(obj);
                           
                           return newTask;
                           
                       });
                   },
 
                   createUserTask: function(taskId) {
                       Task.getTask(taskId).$asObject().$loaded().then(function(task) 
                       {
                           var obj = {
                             taskId: taskId,
                               type: false,
                              title: task.title
                           };
                           
                           return $firebase(fbReference.child('user_tasks').child(task.runner)).$push(obj);
                           
                       }); 
                   },

                   editTask: function(task) {
                       var t = this.getTask(task.$id);
                       return t.$update(
                       {
                                title: task.title,
                          description: task.description,
                                total: task.total
                       });
                   },

                   cancelTask: function(taskId) {
                       var t = this.getTask(taskId);
                       return t.$update({
                           status: 'cancelled'
                       });
                   },
                   
                   isTaskCreator: function(task) {
                       return (currentUser && currentUser.provider && currentUser.uid === task.poster);
                   },
     
                   isTaskOpen: function(task) {
                       return task.status === 'open';
                   },
                   
                   isAssignee: function(task) {
                        return (currentUser && currentUser.provider && currentUser.uid === task.runner);	
                   },

                   completeTask: function(taskId) {
                       var task = this.getTask(taskId);
                       return task.$update({ status: 'completed' });
                   },

                   isTaskCompleted: function(task) {
                        return task.status === "completed";
                   }
                    
       
               };
               // ===== end of 'Task' object =====
               
               return Task;
  
               
           }]);
           // ===== end of 'TaskService' function =====
}());