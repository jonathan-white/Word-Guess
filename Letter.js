function Letter(strValue) {
	this.strValue = strValue;
	this.hasBeenGuessed = false;

	if(this.strValue === " "){
		this.hasBeenGuessed	= true;
	}
};

// function that returns the underlying character if the letter has been guessed
// or returns a placeholder character if guessed incorrectly
Letter.prototype.toString = function(){
	if(this.hasBeenGuessed) {
		return this.strValue;
	}else {
		return "_";
	}
};

// function that takes a character as an argument and checks it against the 
// strValue, updating hasBeenGuessed to true if it was guessed correctly
Letter.prototype.checkGuess = function(guess){
	if(this.strValue.toUpperCase() === guess.toUpperCase()){
		this.hasBeenGuessed = true;
		return true;
	}else {
		return false;
	}
};

module.exports = Letter;