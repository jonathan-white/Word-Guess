var Letter = require("./Letter.js");

function Word(underlyingWord) {
	this.underlyingWord = underlyingWord;
	// An array of new Letter objects 
	this.letters = [];
	for (var i = 0; i < underlyingWord.length; i++) {
		this.letters.push(new Letter(underlyingWord.charAt(i)));
	}
};

Word.prototype.getWord = function(){
	var strWord = "";
	for (var i = 0; i < this.letters.length; i++) {
		strWord += this.letters[i]+ " ";
	}
	return strWord;
};

// Uses the Letter's checkGuess method to check if the charGuess matches 
// the underlying letter; returns a boolean based on the result
Word.prototype.guess = function(charGuess){
	var isCorrect = false;
	for (var i = 0; i < this.letters.length; i++) {
		if (this.letters[i].checkGuess(charGuess)){
			isCorrect = true;
		}
	}
	return isCorrect;
};

// Returns the number of visible characters
Word.prototype.visibleChars = function(){
	var count = 0;
	for (var i = 0; i < this.letters.length; i++) {
		if(this.letters[i].hasBeenGuessed){
			count++;
		}
	}
	return count;
}

module.exports = Word;