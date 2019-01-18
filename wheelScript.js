// script0.js
// To be attached to Wheel0
//transform.localEulerAngles = new Vector3(xRotation, 0, 0);
//var rotation = Quaternion.Euler(0, 30, 0);
//public Transform target;
//Quaternion ang = Quaternion.Euler (target.eulerAngles.x + delta_ang.x, target.eulerAngles.y + delta_ang.y, 0);
// t.rotation = ang;


#pragma strict

var id: int = -1; // wheel id number; chnaged to 0, 1, or 2 by master.js

var GO: GameObject;
var mScript: master; // script

// 0=stopped 1, 2, 3, 4=spinning 5=finished
var stateWheel: int = 0;

var angleStart = 0.0;
var angleStop = 0.0;
var angT = 0.0;
var ang = 0.0;
var r = 0.0;
var angleRandom = 0.0;
var countFast: int;
var index: int = -1;

var totalFaster = 0.0;
var totalSlower = 0.0;


var t = 0.0;
var td = 0.0;

function Start (){
	GO = GameObject.Find("Master");
	mScript = GO.GetComponent (master);

	//renderer.material.color = Color(1, 1, 1); //rgb
	stateWheel = 0;
	angleStart = 0.0;
	angT = 0.0;
	t = 0.0;
} 

function Update () {	
	td = Time.deltaTime; // time since last Update
	t += td;
		
	switch (stateWheel) {
		case 0:
			initialize();
			return;
		case 1:
			rotateFaster();
			return;
		case 2:
			rotateFast();
			return;
		case 3:
			rotateSlower();
			return;
		case 4:
			rotateReverse();
			return;
		case 5:
			finished();
			return;
	}
}

function initialize() {
	// wait until smScript.stateWheels[id] is 1
	if (mScript.stateWheels[id] != 1) return;
	// when this wheel stops, wait until mScript.stateWheels[id] is 1
	mScript.stateWheels[id] = 0;
	
	r = mScript.randomNo();
	angleStop = 18.0*Mathf.RoundToInt(360.0*r/18.0);
	if (angleStop >= 360) angleStop -= 360;
	angleRandom = angleStop - angleStart;
	if (angleRandom < 0) angleRandom += 360;
		
	ang = 0.0;
	stateWheel++;
}

function rotateFaster() {
	ang += 0.02;
	if (ang > 10) {
		var angleAdjust = (360 - 335) + (360 - 135);
		// (360 - totalFaster) + (360 - totalSlower)			
		var a = angleAdjust + angleRandom;
		if (a >= 360) a -= 360;
		countFast = Mathf.RoundToInt(a/10) + 1;
		stateWheel++;
		return;
	}

	totalFaster += ang;
	if (totalFaster >= 360) totalFaster -= 360;
	angT += ang;
	if (angT >= 360) angT -= 360;
	transform.rotation = Quaternion.Euler(-angT, 0.0, 0.0);
}

function rotateFast() {
	countFast--;
	if (countFast == 0) stateWheel++;

	ang = 10;
	angT += ang;
	if (angT >= 360) angT -= 360;
	transform.rotation = Quaternion.Euler(-angT, 0.0, 0.0);
}

function rotateSlower() {
	ang -= 0.1;
	if (ang < 0) {
		stateWheel++;
		return;
	}

	totalSlower += ang;
	if (totalSlower>= 360) totalSlower -= 360;
	angT += ang;
	if (angT >= 360) angT -= 360;
	transform.rotation = Quaternion.Euler(-angT, 0.0, 0.0);
}

function rotateReverse() {
	angT -= 0.4;
	if (angT < angleStop) {
		angT = Mathf.RoundToInt(angT);
		stateWheel++;
	}
	transform.rotation = Quaternion.Euler(-angT, 0.0, 0.0);
}

function finished() {
	//angleStart = transform.eulerAngles.x;	// does not work
	index = Mathf.RoundToInt(angT/18);
	if (index == 0) index += 20;
	angleStart = angT;
	stateWheel = 0;
}