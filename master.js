/*
Slot machine:

This is: master.js
Also need: wheelScript.js


Instructor: M. Kishore
Class: CSCI 3550
*/

/*
  Steven Essig
  Slot Machine
  Previous edit: 12/5/16
  Lastest edit: 1/17/19
*/


#pragma strict

var gameNo: int = 0;
var gameOver = false;
var credit: int = 50; // initial credit

var id: int; // 0 for wheel0, 1 for wheel1, 2 for wheel2

var randomReady: int; // get random seed

// -1: get random seed, ..., 5: Game over
var state: int = 0;
// 0 = wait, 1 = spin
var stateWheels = new int[3];

var betTime: boolean; // can bet only before wheel0 spins
var betMax: int = 5;
var bet: int = 1;;
var betWin: int;

var tt = 0.0; // Time.time; set to 0 for state 2
var td = 0.0; // Time.delta

var tWheel0 = 3.0;  // whell0 starts
var tWheel1 = 3.5;  // whell1 starts
var tWheel2 = 4.0;  // whell2 starts

var index0: int = 0;
var index1: int = 0;
var index2: int = 0;

var match0: int = 0;
var match1: int = 0;
var match2: int = 0;

var isWinner = "";
var bettingTime = "Betting Time!";
var numWins: int = 0;
var gamesPlayed: int = 0;
var amountWon: int = 0;

var wheel0: GameObject;  // wheel0  
var wheel0Script: wheelScript;  // wheel0 script
var wheel1: GameObject;  // wheel0  
var wheel1Script: wheelScript;  // wheel0 script
var wheel2: GameObject;  // wheel0  
var wheel2Script: wheelScript;  // wheel0 script

var mask: GameObject;   // face plane 
var maskLeft: GameObject;
var maskRight: GameObject;
var maskTop: GameObject;
var maskBottom: GameObject;
var texture : Texture2D; //texture for GUI

var wheel0Prefab: GameObject; // for wheel0 and wheel2
var wheel1Prefab: GameObject; // for wheel1

var TextStyle : GUIStyle;
var BetStyle : GUIStyle;
var BetTimeStyle : GUIStyle;
var CreditStyle : GUIStyle;
var WinnerStyle : GUIStyle;
var RightArrow : GUIContent;
var LeftArrow : GUIContent;


function Start() {
	createObjects();

	gameNo = 0;
	//credit = 10;
	randomReady = -10; // if 0, get seed
	betTime = false;
	bet = 3;
	state = -1;
}


function Update() {
    var i: int;

	td = Time.deltaTime; // time since last Update call
	tt += td;  // Time.time; tt = 0 in state = 0
	
	switch (state) {
	    case -1: // get random seed
	        // wait 10 times randomReady == 1
	        randomReady++;
	        if (randomReady < 1) return;
	        // randomReady == 1
	        Random.seed = Mathf.Floor(100000*Time.time) % 100;

	        // set all wheels to wait
	        for (i = 0; i < 3; i++) stateWheels[i] = 0;	// stop wheels

	        state++;
	        return;
		
	    case 0: // game begins
	        gameNo++;
	        // betting is allowed
	        betTime = true;
	        bettingTime = "Betting Time!";

	        tt = 0;
	        state++; 
	        return;
	    
	    case 1:
	        return;
		
	    case 4: 
			
	        if (credit <= 0) {
	            gameOver = true;
	            state = 5;
	            return;
	        }

	        if (credit < 5){
	            betMax = credit;
	            if (bet > credit){
	                bet = credit;
	            }
	                
	        } else {
	            betMax = 5;
	        }
			
	        gamesPlayed++;

	        // start again
	        tt = 0.0;
	        state = 0;
	        return;

	    case 5: // game over
	        // loop inactive state
	        isWinner = "GAME OVER";
	        return;
	}
}


function OnGUI() {
    // click and then release the button to start this game
    if (GUI.Button(Rect(350,550,100,50),"Play")) startGame();
    if (GUI.Button(Rect(225,150,50,50), LeftArrow)) LowerBet();
    if (GUI.Button(Rect(525,150,50,50), RightArrow)) HigerBet();
    GUI.TextField (Rect (350, 245, 100, 20), isWinner, WinnerStyle);
    GUI.TextField (Rect (350, 175, 100, 20), "" + bet, BetStyle);
    GUI.TextField (Rect (350,150,100,20), "Bet Amount", TextStyle);
    GUI.TextField (Rect (350, 110, 100, 20), bettingTime, BetTimeStyle);
    GUI.TextField (Rect (10, 30, 100, 20), "Music: ON", CreditStyle);
    GUI.TextField (Rect (75, 300, 100, 20), "Credits:   " + credit, CreditStyle);
    GUI.TextField (Rect (75, 350, 100, 20), "Games Played:   " + gamesPlayed, CreditStyle);
    GUI.TextField (Rect (76, 400, 100, 20), "Wins:   " + numWins, CreditStyle);
    GUI.TextField (Rect (675, 300, 100, 20), "Amount Won:   " + amountWon, CreditStyle);
}

function LowerBet() {
    if(bet > 1 && betTime == true) {
        bet -= 1;
    }
}

function HigerBet() {
    if(bet < betMax && betTime == true) {
        bet += 1;
    } 
}

function startGame() {
    
    if (gameOver == false && betTime == true){

    
        isWinner = "";
        bettingTime = "";

        betTime = false;
        credit -= bet;

        yield WaitForSeconds (1);
        stateWheels[0] = 1;
        yield WaitForSeconds (1);
        stateWheels[1] = 1;
        yield WaitForSeconds (1);
        stateWheels[2] = 1;

        yield WaitForSeconds (13);
        index0 = wheel0Script.index;
        index1 = wheel1Script.index;
        index2 = wheel2Script.index;

        payLines();
	        

        matchWheel0();
        matchWheel1();
        matchWheel2();
        Winner();

        state = 4;
    }
}

function matchWheel0() {
    //find cherry
    if(index0 == 1 || index0 == 5 || index0 == 9 || index0 == 13 || index0 == 17){
        match0 = 5;
    } 
    //find lemon
    else if(index0 == 20 || index0 == 4 || index0 == 11 || index0 == 15){
        match0 = 4;
    }
    //find bar
    else if(index0 == 19 || index0 == 3 || index0 == 12){
        match0 = 3;
    }
    //find 7
    else if(index0 == 7 || index0 == 16){
        match0 = 2;
    }
    //find Diamond
    else if(index0 == 8){
        match0 = 1;
    }
    //its a space
    else{
        match0 = 0;
    }
}

function matchWheel1() {
    //find cherry
    if(index1 == 2 || index1 == 6 || index1 == 10 || index1 == 14 || index1 == 18){
        match1 = 5;
    } 
        //find lemon
    else if(index1 == 3 || index1 == 7 || index1 == 16 || index1 == 20){
        match1 = 4;
    }
        //find bar
    else if(index1 == 4 || index1 == 8 || index1 == 15){
        match1 = 3;
    }
        //find 7
    else if(index1 == 19 || index1 == 12){
        match1 = 2;
    }
        //find Diamond
    else if(index1 == 11){
        match1 = 1;
    }
        //its a space
    else{
        match1 = 0;
    }
}

function matchWheel2() {
    //find cherry
    if(index2 == 1 || index2 == 5 || index2 == 9 || index2 == 13 || index2 == 17){
        match2 = 5;
    } 
        //find lemon
    else if(index2 == 20 || index2 == 4 || index2 == 11 || index2 == 15){
        match2 = 4;
    }
        //find bar
    else if(index2 == 19 || index2 == 3 || index2 == 12){
        match2 = 3;
    }
        //find 7
    else if(index2 == 7 || index2 == 16){
        match2 = 2;
    }
        //find Diamond
    else if(index2 == 8){
        match2 = 1;
    }
        //its a space
    else{
        match2 = 0;
    }
}

function Winner() {
    // Diamond winner
    if(match0 == 1 && match1 == 1 && match2 == 1){
        amountWon = bet * 800;
        credit += amountWon;
        isWinner = "WINNER!!!";
        numWins++;
    }
    // Lucky 7s winner
    else if(match0 == 2 && match1 == 2 && match2 == 2){
        amountWon = bet * 100;
        credit += amountWon;
        isWinner = "WINNER!!!";
        numWins++;
    }
    // bar winner
    else if(match0 == 3 && match1 == 3 && match2 == 3){
        amountWon = bet * 30;
        credit += amountWon;
        isWinner = "WINNER!!!";
        numWins++;
    }
    // lemon winner
    else if(match0 == 4 && match1 == 4 && match2 == 4){
        amountWon = bet * 13;
        credit += amountWon;
        isWinner = "WINNER!!!";
        numWins++;
    }
    // cherry winner
    else if(match0 == 5 && match1 == 5 && match2 == 5){
        amountWon = bet * 6;
        credit += amountWon;
        isWinner = "WINNER!!!";
        numWins++;
    }
    // cherry cherry winner
    else if(match0 == 5 && match1 == 5 && match2 != 5){
        amountWon = bet * 2;
        credit += amountWon;
        isWinner = "WINNER!!!";
        numWins++;
    }
    // single cherry winner
    else if(match0 == 5 && match1 != 5){
        amountWon = bet * 1;
        credit += amountWon;
        isWinner = "WINNER!!!";
        numWins++;
    }
}

// randomNo() is static, and it is accessible from any script
static function randomNo() : float {
	return Random.value;
}


function payLines() {
// show winning lines
// pay winners
print("Credit: "+credit+"; Bet: "+bet+"; Win: "+ numWins);
}

function createObjects() {
	// id = 0 for wheel0, id = 1 for wheel1, id = 3 for wheel2
	id = 0; // id = 
	wheel0 = Instantiate(wheel0Prefab, Vector3(-1*(1-id), 0, 0), 
		Quaternion.identity);
	wheel0.transform.localScale = Vector3(85, 100, 100);
	wheel0.name = "Wheel" + id;		
	wheel0Script = wheel0.AddComponent.<wheelScript>();
	wheel0Script.id = id;
	
	id = 1; // id = 
	wheel1 = Instantiate(wheel1Prefab, Vector3(-1*(1-id), 0, 0), 
		Quaternion.identity);
	wheel1.transform.localScale = Vector3(85, 100, 100);
	wheel1.name = "Wheel" + id;		
	wheel1Script = wheel1.AddComponent.<wheelScript>();
	wheel1Script.id = id;

	id = 2; // id = 
	wheel2 = Instantiate(wheel0Prefab, Vector3(-1*(1-id), 0, 0), 
		Quaternion.identity);
	wheel2.transform.localScale = Vector3(85, 100, 100);
	wheel2.name = "Wheel" + id;		
	wheel2Script = wheel2.AddComponent.<wheelScript>();
	wheel2Script.id = id;

		// hiding plane
	mask = GameObject.CreatePrimitive(PrimitiveType.Plane);
	mask.name = "Mask";
	mask.transform.position = Vector3(0, 0, -2.67); //.zero;
	mask.transform.Rotate(270, 0, 0);
	mask.GetComponent.<Renderer>().material.color = Color(0, 0, 0);

	maskLeft = GameObject.CreatePrimitive(PrimitiveType.Plane);
	maskLeft.name = "MaskLeft";
	maskLeft.transform.position = Vector3(-7.5, 0, -2.75); //.zero;
	maskLeft.transform.Rotate(270, 0, 0);
	maskLeft.GetComponent.<Renderer>().material.color = Color(0.8, 0.1, 0.1);

	maskRight = GameObject.CreatePrimitive(PrimitiveType.Plane);
	maskRight.name = "MaskRight";
	maskRight.transform.position = Vector3(7.5, 0, -2.75); //.zero;
	maskRight.transform.Rotate(270, 0, 0);
	maskRight.GetComponent.<Renderer>().material.color = Color(0.8, 0.1, 0.1);

	maskTop = GameObject.CreatePrimitive(PrimitiveType.Plane);
	maskTop.name = "MaskTop";
	maskTop.transform.position = Vector3(0, 7.25, -2.7); //.zero;
	maskTop.transform.Rotate(270, 0, 0);
	maskTop.GetComponent.<Renderer>().material.color = Color(1, 0.8, 0.1);

	maskBottom = GameObject.CreatePrimitive(PrimitiveType.Plane);
	maskBottom.name = "MaskBottom";
	maskBottom.transform.position = Vector3(0, -6.6, -2.7); //.zero;
	maskBottom.transform.Rotate(270, 0, 0);
	maskBottom.GetComponent.<Renderer>().material.color = Color(1, 0.8, 0.1);
}

