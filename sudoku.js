"use strict";

var EASY_PUZZLE = "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
var MEDIUM_PUZZLE = "-3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--";
var HARD_PUZZLE = "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--";

// Set this variable to true to publicly expose otherwise private functions inside of SudokuSolver
var TESTABLE = true;

var SudokuSolver = function (testable) {
  var solver;

  // PUBLIC FUNCTIONS
  function solve(boardString) {
    var boardArray = boardString.split("");//boardString to boardArray in which all we are having all the nos. that are on the string. 
    if (boardIsInvalid(boardArray)) {
      return false;//Invalid Board
    }
    return recursiveSolve(boardString);//invalid board backtrack it to solve
  }

  function solveAndPrint(boardString) {
    var solvedBoard = solve(boardString);
    console.log(toString(solvedBoard.split("")));
    return solvedBoard;
  }

  // PRIVATE FUNCTIONS
  function recursiveSolve(boardString) {
    var boardArray = boardString.split(""); //boardString to boardArray
    if (boardIsSolved(boardArray)) { //Step1: check board is filled or not (by checking if it contains "- / dash" character )
      return boardArray.join(""); //Step2: then we join array in the form of strings
    }
    var cellPossibilities = getNextCellAndPossibilities(boardArray); //what possible nos. can be filled 
    var nextUnsolvedCellIndex = cellPossibilities.index; //that contains "-" dash character
    var possibilities = cellPossibilities.choices; // all the possibilities of cell is put here 
    for (var i = 0; i < possibilities.length; i++) {
      boardArray[nextUnsolvedCellIndex] = possibilities[i];//putting possibilities in nextUnsolvedCellIndex 
      var solvedBoard = recursiveSolve(boardArray.join(""));//if board is complete we recursively join function to state that board is complete
      if (solvedBoard) {
        return solvedBoard;
      }
    }
    return false;
  }

  function boardIsInvalid(boardArray) {
    return !boardIsValid(boardArray);//Invalid Board
  }

  function boardIsValid(boardArray) {
    return allRowsValid(boardArray) && allColumnsValid(boardArray) && allBoxesValid(boardArray);//negation of 3 things i.e all rows, all cloums, all box should be valid
  }

  function boardIsSolved(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") {
        return false;
      }
    }
    return true;
  }

  function getNextCellAndPossibilities(boardArray) {//if no. is empty or not
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") { //finding of a NULL character that to be filled by assigning new character
        var existingValues = getAllIntersections(boardArray, i); //returns nos. of box by getAllIntersections function
        var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter(function (num) { // limit (0-9) & which number out of that limit is present in the box and return the which no. can fit in the box (by filter function to get all correct answers)
          return existingValues.indexOf(num) < 0;
        });
        return { index: i, choices: choices };
      }
    }
  }

  function getAllIntersections(boardArray, i) {
    return getRow(boardArray, i).concat(getColumn(boardArray, i)).concat(getBox(boardArray, i));//the req. no. shouldn't be in same row, same column and in same box
  }

  function allRowsValid(boardArray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].map(function (i) {//starting index of each row
      return getRow(boardArray, i); //strings of each row
    }).reduce(function (validity, row) {
      return collectionIsValid(row) && validity; //if collection is valid or not to check whether duplicate no. is there or not
    }, true);
  }

  function getRow(boardArray, i) { //gets only starting index
    var startingEl = Math.floor(i / 9) * 9; //by taking floor of a no.
    return boardArray.slice(startingEl, startingEl + 9); //81 character string is converted into 9-9 sections
  }

  function allColumnsValid(boardArray) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { //staring index of each column
      return getColumn(boardArray, i);
    }).reduce(function (validity, row) {
      return collectionIsValid(row) && validity;
    }, true);
  }

  function getColumn(boardArray, i) {
    var startingEl = Math.floor(i % 9);
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (num) {
      return boardArray[startingEl + num * 9]; //0-9,0-18,0-27,0-36,.... sly with 1-9,1-18,1-27,.... (as it so because there is a difference of 9 between each column)
    });
  }

  function allBoxesValid(boardArray) {
    return [0, 3, 6, 27, 30, 33, 54, 57, 60].map(function (i) {  //starting index of each boxes
      return getBox(boardArray, i);
    }).reduce(function (validity, row) { //to check whether duplicate number exists or not
      return collectionIsValid(row) && validity;
    }, true);
  }

  function getBox(boardArray, i) {
    var boxCol = Math.floor(i / 3) % 3; // ( 0 3 6)
    var boxRow = Math.floor(i / 27); // (0/27=0; 27/27=1 ; 54/27=2)
    var startingIndex = boxCol * 3 + boxRow * 27;
    return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(function (num) { //as 1 box contains index of these numbers only (starting index)
      return boardArray[startingIndex + num]; //0+0,0+1,0+2; 0+9,0+10,0+11; 0+18,0+19,0+20; sly starting index of each box is added to these indexes
    });
  }

  function collectionIsValid(collection) { //in this case we are passing rows & here collection==row
    var numCounts = {}; //to check whether it's existing or not
    for(var i = 0; i < collection.length; i++) {
      if (collection[i] != "-") {
        if (numCounts[collection[i]] === undefined) { //Step 1: to check whether number is defined or not, if not we are not considering it
          numCounts[collection[i]] = 1; //Step 2: then to check if number is existing in numCount or not. If not => it's the 1st arrival ==> assigns to 1.
        } else {
          return false; //implies that duplicate is found
        }
      }
    }
    return true; //=> implies that all cases are passed (i.e 0,9,18,27,....) => ALL ROWS ARE VALID
  }

  function toString(boardArray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].map(function (i) {
      return getRow(boardArray, i).join(" ");
    }).join("\n");
  }

  if (testable) {
    // These methods will be exposed publicly when testing is on.
    solver = { 
      solve: solve,
      solveAndPrint: solveAndPrint,
      recursiveSolve: recursiveSolve,
      boardIsInvalid: boardIsInvalid,
      boardIsValid: boardIsValid,
      boardIsSolved: boardIsSolved,
      getNextCellAndPossibilities: getNextCellAndPossibilities,
      getAllIntersections: getAllIntersections,
      allRowsValid: allRowsValid,
      getRow: getRow,
      allColumnsValid: allColumnsValid,
      getColumn: getColumn,
      allBoxesValid: allBoxesValid,
      getBox: getBox,
      collectionIsValid: collectionIsValid,
      toString: toString };
  } else {
    // These will be the only public methods when testing is off.
    solver = { solve: solve,
      solveAndPrint: solveAndPrint };
  }

  return solver;
}(TESTABLE);
