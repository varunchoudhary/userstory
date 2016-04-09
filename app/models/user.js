var mongoose = require('mongoose');

var Schema = mongoose.Schema;//to create the schema of user and password
var bcrypt = require('bcrypt-nodejs');//to hash passwords

var UserSchema = new Schema({
	name: String,
	username: {type: String, required: true , index: {unique: true}},
	password: {type: String, required: true , select: false }
});

UserSchema.pre('save', function(next){
	var user =  this;
	 if(!user.isModified('password')) return next();

	 bcrypt.hash(user.password, null, null, function(err,hash){
	 	if(err) return next(err);

	 	user.password =  hash;
	 	next();
	 });
});


// compareing of password
UserSchema.methods.comparePassword= function(password){
	var user = this;

	 return bcrypt.compareSync(password,user.password); 
}

module.exports =  mongoose.model('User',UserSchema);
