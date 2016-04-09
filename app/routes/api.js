var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config'); 

var secretKey = config.secretKey;
 
var jsonwebtoken = require('jsonwebtoken'); //used to create tokens for users authentication and incryption

//userId and password creator
function createToken(user){

	var token = jsonwebtoken.sign({
		id : user._id,
		name: user.name,
		username: user.username
	},secretKey,{
		expirtesInMinutes : 1440
	});

	return token;
}



module.exports = function(app,express,io){

	var api = express.Router();


	api.get('/all-stories', function(req,res){
		Story.find({},function(err,stories){
			if(err) {
				res.send(err);
				return;
			}
			res.json(stories);
		});

	});

//get and post for singup or new user
	api.post('/signup',function(req,res){
		
		var user = new User({
			name: req.body.name,
			username:req.body.username,
			password: req.body.password
		});

		var token = createToken(user);
			
		user.save(function(err){
			if (err){
				res.send(err);
				return;
			}
			res.json({ 
				success: true,
				message:"user has been created ...!",
				token: token
				});
		});

	});

	api.get('/users',function(req,res){
		
		User.find({},function(err, users){
			if(err){
				res.send(err);
				return;
			}

			res.json(users);
		});

	});


//get and post request for login

	api.post('/login',function(req,res){
		User.findOne({username:req.body.username}).select('name username password').exec(function(err,user){
			if(err) throw err;

			if(!user){
				res.send({messsge: "user doesn't exist"});
			}else if(user){

				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
				res.send({messsge:"invalid"})
				}else{
				///token

						var token = createToken(user);

						res.json({
							success:true,
							message:"successfully login",
							token : token
						});
				}
			
			}


	});

	});



//it is a middleware everything above it is a data before the user enter the app 
api.use(function(req, res, next){

	console.log("a user wants to authenticate in ur app");

	var token = req.body.token /*|| req.param('token')*/ || req.headers['x-access-token'];

	//check if token exit ,if exist then authenticate else give message

	if(token){

		jsonwebtoken.verify(token,secretKey,function(err, decoded){

			if(err){
				res.status(403).send({success: false, message:"failed to authenticate"});
			}else{
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.status(403).send({ success: false , message: " no token provided" });
	}
});



// destination b or where the app starts, here after login user is directed to home route 
api.route('/')

	.post(function(req,res) {

			var story = new Story({
			   	creator: req.decoded.id,
				content: req.body.content,
			});

			story.save(function(err, newStory){
				if(err){
					res.send(err);
					return;
				}
				io.emit('story', newStory)
				res.json({message:"new story created" });
			});
		})

	.get(function(req,res){

		Story.find({ creator: req.decoded.id}, function(err,stories){
			if(err){
				res.send(err);
				return;
			}

			res.json(stories);
		});
	});



// decoded api.use method cant be called so new route is made to call and get middleware to frontend
api.get('/me',function(req,res){
	res.send(req.decoded);
});

	return api;

} 