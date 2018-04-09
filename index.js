// Imports & NPM Packages
var Letter = require("./Letter.js");
var Word = require("./Word.js");
var inquirer = require("inquirer");

var wordChoices = {
	food: ["Apple", "Butter","Banana","Water","Pineapple","Pepper","Onion","Lasagna","Pizza","Cookies",
		"Chicken Noodle Soup","Artichoke Dip","Pistachio","Spaghetti and Meatballs","Beef Tenderloin",
		"Chicken Quesadilla","Chicken Alfredo","Caesar Salad","Chicken and Waffles","French Toast",
		"Cheesy Grits","Philly Cheesesteak Sandwich","Shepherds Pie"],
	movies: ["Jurassic Park","Black Panther","Space Jam","Mr Nobody","Terminator","RoboCop","Men in Black",
		"The Bourne Identity","Requiem for a Dream","Beautiful Mind","Moonlight","Twister","Saving Private Ryan",
		"Super Troopers","Star Wars: A New Hope","Indiana Jones and the Raiders of the Lost Ark",
		"Spider-Man: Homecoming","Get Out","Ghost in the Darkness","E.T.: Extra Terrestrial","Back to the Future",
		"Casino Royale","Don't Be a Menace to South Central While Drinking Your Juice in the Hood","Out of Africa",
		"Legends of the Fall","Straight Outta Compton"],
	books: ["The Great Gatsby","Great Expectations","Brave New World","Frankenstein","Pride and Prejudice",
		"Ulysses","David Copperfield","The Picture of Dorian Gray","Little Women","North and South","War and Peace",
		"Persuasion","Dracula","Harry Potter","The Lord of the Rings","Game of Thrones"],
	random: ["Question Mark","Flowers","Pen","Computer","Mason Jar","Coffee Table","Bunny Slippers",
		"Remote Control","Light","Sound","Clouds","Wine Bottle","Screwdriver","Placemat","Rollercoaster",
		"Skateboard","Bicycle Helmet","Bilbo Baggins","Garden Gnome","Snow Globe","Piggy Bank","Coffee Maker",
		"Candy Wrapper","Magazine","Newspaper","Blanket"]
};
var themeKeys = ["food","movies","books","random"];

// Global Variables
var availableWords = wordChoices[themeKeys[Math.floor(Math.random() * themeKeys.length)]];
var usedWords = [];
var guessedWords = [];
var hiddenWord;
var remainingGuesses;
var gameOver = false;

var numGamesPlayed = 0;
var numWordsGuessed = 0;
var numLosses = 0;
var numWins = 0;
var numLettersGuessed = 0;

// Selects a random word from the list of available words
function selectRandomWord(){
	if(usedWords.length < 10){
		// reset remaining guesses
		remainingGuesses = 10;

		// Randomly pick a word for the player to guess
		const index = Math.floor(Math.random() * availableWords.length);
		const chosenWord = availableWords[index]; 

		// Push chosen word to list of used words
		usedWords.push(availableWords[index]);

		// Remove chosen word from list of available words;
		availableWords.splice(index,1);

		// Hide the chosen word & display placeholders for the user 
		hiddenWord = new Word(chosenWord);
	}else {
		// If there are no more available words, the player has won
		console.log("You've guessed all of the words. You win!!!");
		numWins++;
		gameOver = true;

		// Ask the player if they want to play again
		promptToPlayAgain();
	}
};

// function to prompt the user for a guess. Will continue until:
// A) player guesses all of the letters of the hidden word
// B) player runs out of guesses
function promptGuess(){
	if(remainingGuesses > 0 && !gameOver){

		// Display the correctly guessed letters
		console.log(hiddenWord.getWord() + "\n");
		inquirer.prompt([
			{
				type: "input",
				name: "guess",
				message: "Guess a letter!",

				// only accept 1 character responses
				validate: function(value){
					return value.length === 1;
				}
			}
		]).then(user => {
			numLettersGuessed++;
			// Check if the user's guess reveals any hidden letters
			if(hiddenWord.guess(user.guess) === true){
				console.log('\nCORRECT!!!\n');

				// Check if we have won the game; if yes, select a new word
				if(hiddenWord.visibleChars() === hiddenWord.letters.length){
					if(!guessedWords.includes(hiddenWord.underlyingWord)){
						guessedWords.push(hiddenWord.underlyingWord);
					}
					numWordsGuessed++;
					console.log("You got it right! Next word!\n");
					selectRandomWord();
				}
			}else {
				console.log('\nINCORRECT!!!\n');
				remainingGuesses--;
				console.log(remainingGuesses + ' remaining guesses!!!\n');
			}

			// Recursively prompt the player to guess again
			promptGuess();
		});
	}else if(remainingGuesses === 0) {
		// if the player has no more remaining guesses they lose
		console.log('Sorry, you lose! Better luck next time.');
		numLosses++;
		gameOver = true;

		// Ask the player if they want to play again
		promptToPlayAgain();
	}
};

// When the game is over ask the player if they want to play again
function promptToPlayAgain(){
	numGamesPlayed++;
	inquirer.prompt([
		{
			type: "confirm",
			name: "continue",
			message: "Do you want to play again?"
		}
	]).then(answer => {
		// If the player wants to play again, reset game, choose a new word and ask for a guess
		if(answer.continue){
			// Re-initialize global variables
			gameOver = false;

			// Prompt user to select a theme
			inquirer.prompt([
				{
					type: "list",
					name: "theme",
					message: "Choose a theme to begin:",
					choices: ["food","movies","books","random"]
				}
			]).then(answer => {
				// console.log(answer.theme);
				availableWords = wordChoices[answer.theme];
			// availableWords = availableWords.concat(usedWords);
				usedWords = [];
				// Select a new word
				selectRandomWord();

				// Prompt the player to guess a letter
				promptGuess();
			});
		}else {
			console.log('Thank you for playing. Here are your stats:\n');
			displayStats();
		}
	});	
};

function displayStats(){
	console.log("Number of Games Played: " + numGamesPlayed);
	console.log("Total Wins: " + numWins);
	console.log("Total Losses: " + numLosses);
	console.log("Number of Letters Guessed: " + numLettersGuessed);
	console.log("Number of Words Revealed: " + numWordsGuessed);
	console.log('Correctly Guessed Words:\n');
	for (var i = 0; i < guessedWords.length; i++) {
		console.log('* ' + guessedWords[i]);
	}
};

// Select a random word
selectRandomWord();

// Prompt the player to guess a letter
promptGuess();