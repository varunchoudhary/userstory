angular.module('storyService',[])

.factory('Story',function($http){


	var storyFactory = {};
	storyFactory.allstories = function(){
		return $http.get('/api/all-stories');
	}

	storyFactory.createStory = function(storyData){
		return $http.post('/api',storyData);
	}

	storyFactory.getAllStory = function(){
		return $http.get('/api');
	}

	return storyFactory;
})

.factory('socketio',function($rootScope){

		var socket = io.connect();

		return{
			
					on : function(eventName,callback){
							socket.on(eventName,function(){
								var args = arguments;
								$rootScope.$apply(function(){
									callback.apply(socket, args);
								});
							});

					},
					emit: function(eventName, data, callback){
								socket.emit(eventName,data, function(){

									var args = arguments;
									$rootScope.apply(function(){
										if(callback){
											callback.apply(socket, args);
										}
									});
								});

					}

		};


});

