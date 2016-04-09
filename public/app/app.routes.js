angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider,$locationProvider){

	$routeProvider
	    	.when('/',{
	    		templateUrl:'app/views/pages/home.html',
	    		controller:'mainController',
	    		controllerAs: 'main'	 
	    	})
	    	.when('/login',{
	    		templateUrl:'app/views/pages/login.html'
	    	})
	    	.when('/signup',{
	    		templateUrl:'app/views/pages/signup.html'
	    	})
	    	.when('/all-stories',{
	    		templateUrl: 'app/views/pages/allstories.html',
	    		controller:'AllStoriesController',
	    		controllerAs:'story',
	    		resolve: {
	    			stories : function(Story){
	    				return Story.allstories();
	    			}
	    		}
	    	})

	    $locationProvider.html5Mode(true);
})