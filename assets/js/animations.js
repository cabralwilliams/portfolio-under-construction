const DEG_RAD = Math.PI/180;
const RAD_DEG = 180/Math.PI;

/*
    Bone List
    0: Root -> Mid Spine
    1: Upper Torso
    2: Left Shoulder
    3: Upper Left Arm
    4: Lower Left Arm
    5: Left Hand
    6: Right Shoulder
    7: Upper Right Arm
    8: Lower Right Arm
    9: Right Hand
    10: Neck
    11: Head
    12: Lower Torso
    13: Left Hip
    14: Upper Left Leg
    15: Lower Left Leg
    16: Left Foot
    17: Right Hip
    18: Upper Right Leg
    19: Lower Right Leg
    20: Right Foot
*/

/*
    Bone Lengths
    0: Root -> Always set to zero -> 0
    1: Upper Torso -> 1 (12)
    2: Shoudlers -> 2,6 (8.5)
    3: Upper Arms -> 3,7 (12)
    4: Lower Arms -> 4,8 (11)
    5: Hands -> 5,9 (8)
    6: Neck -> 10 (7.5)
    7: Head -> 11 (8.5)
    8: Lower Torso -> 12 (10)
    9: Hips -> 13,17 (5.5)
    10: Upper Legs -> 14,18 (18)
    11: Lower Legs -> 15,19 (18)
    12: Feet -> 16,20 (10)
*/

var lengths1 = [0,12,8.5,12,11,8,7.5,8.5,10,5.5,18,18,10];
var defaultAngles = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var defaultColors = ["black","black","black","red","red","red","black","blue","blue","blue","black","black","black","black","green","green","green","black","yellow","yellow","yellow"];

class BoneOb1  {
    constructor(rootLocation = [0,0,0],parentB = null,bLength = 0,boneDirection = 0,bRotation = 0,bodyRotation = 0) {
        this.rootLocation = rootLocation;
        this.parentB = parentB;
        this.origin = this.getOrigin();
        this.bLength = bLength;
        this.boneDirection = boneDirection; //0: up, 1: down, 2: left (to right side of screen), 3: right (to left side of screen), 4: out, 5: in
        this.bRotation = bRotation; //Individual bone rotation
        this.bodyRotation = bodyRotation; //Value of 0 looks straight ahead, positive turns left, negative turns right
        this.axesArray = this.getAxes();
        this.currentAxes = this.axesArray[0];
        this.nextAxes = this.axesArray[1];
        this.terminus = this.getTerminus();
    }

    getOrigin() {
        if(this.parentB == null) {
            return this.rootLocation;
        }
        return this.parentB.terminus;
    }

    getAxes() {
        //Default Axes: right = positive i, up = positive j, out = positive k
        var iHat, jHat, kHat;
        if(this.parentB == null) {
            jHat = [0,1,0];
            iHat = [Math.cos(this.bodyRotation*DEG_RAD),0,-Math.sin(this.bodyRotation*DEG_RAD)];
            kHat = [Math.sin(this.bodyRotation*DEG_RAD),0,Math.cos(this.bodyRotation*DEG_RAD)];
            return [[iHat,jHat,kHat],[iHat,jHat,kHat]];
        }
        //Up/Down/Out/In Bones: positive rotation = rotate head back when in neutral position
        //For now, left/right bones will not rotate
        var cAxes = this.parentB.nextAxes;
        var newI, newJ, newK; //Gives the transformed i, j, and k directions after the bone's rotation
        var sineVal = Math.sin(this.bRotation*DEG_RAD);
        var cosVal = Math.cos(this.bRotation*DEG_RAD);
        switch(this.boneDirection) {
            case 0:
                newI = cAxes[0];
                newJ = [cAxes[1][0]*cosVal - cAxes[2][0]*sineVal,cAxes[1][1]*cosVal - cAxes[2][1]*sineVal,cAxes[1][2]*cosVal - cAxes[2][2]*sineVal];
                newK = [cAxes[2][0]*cosVal + cAxes[1][0]*sineVal,cAxes[2][1]*cosVal + cAxes[1][1]*sineVal,cAxes[2][2]*cosVal + cAxes[1][2]*sineVal];
                break;
            case 1:
                newI = cAxes[0];
                newJ = [cAxes[1][0]*cosVal - cAxes[2][0]*sineVal,cAxes[1][1]*cosVal - cAxes[2][1]*sineVal,cAxes[1][2]*cosVal - cAxes[2][2]*sineVal];
                newK = [cAxes[2][0]*cosVal + cAxes[1][0]*sineVal,cAxes[2][1]*cosVal + cAxes[1][1]*sineVal,cAxes[2][2]*cosVal + cAxes[1][2]*sineVal];
                break;
            case 2:
                newI = cAxes[0];
                newJ = cAxes[1];
                newK = cAxes[2];
                break;
            case 3:
                newI = cAxes[0];
                newJ = cAxes[1];
                newK = cAxes[2];
                break;
            case 4:
                newI = cAxes[0];
                newJ = [cAxes[1][0]*cosVal - cAxes[2][0]*sineVal,cAxes[1][1]*cosVal - cAxes[2][1]*sineVal,cAxes[1][2]*cosVal - cAxes[2][2]*sineVal];
                newK = [cAxes[2][0]*cosVal + cAxes[1][0]*sineVal,cAxes[2][1]*cosVal + cAxes[1][1]*sineVal,cAxes[2][2]*cosVal + cAxes[1][2]*sineVal];
                break;
            case 5:
                newI = cAxes[0];
                newJ = [cAxes[1][0]*cosVal - cAxes[2][0]*sineVal,cAxes[1][1]*cosVal - cAxes[2][1]*sineVal,cAxes[1][2]*cosVal - cAxes[2][2]*sineVal];
                newK = [cAxes[2][0]*cosVal + cAxes[1][0]*sineVal,cAxes[2][1]*cosVal + cAxes[1][1]*sineVal,cAxes[2][2]*cosVal + cAxes[1][2]*sineVal];
                break;
            default:
                newI = cAxes[0];
                newJ = [cAxes[1][0]*cosVal - cAxes[2][0]*sineVal,cAxes[1][1]*cosVal - cAxes[2][1]*sineVal,cAxes[1][2]*cosVal - cAxes[2][2]*sineVal];
                newK = [cAxes[2][0]*cosVal + cAxes[1][0]*sineVal,cAxes[2][1]*cosVal + cAxes[1][1]*sineVal,cAxes[2][2]*cosVal + cAxes[1][2]*sineVal];
                break;
        }
        return [cAxes,[newI,newJ,newK]];
    }

    getTerminus() {
        if(this.parentB == null) {
            this.bLength = 0;
            return this.rootLocation;
        }
        var tx = this.origin[0];
        var ty = this.origin[1];
        var tz = this.origin[2];
        switch(this.boneDirection) {
            case 0:
                tx += this.nextAxes[1][0]*this.bLength;
                ty += this.nextAxes[1][1]*this.bLength;
                tz += this.nextAxes[1][2]*this.bLength;
                break;
            case 1:
                tx -= this.nextAxes[1][0]*this.bLength;
                ty -= this.nextAxes[1][1]*this.bLength;
                tz -= this.nextAxes[1][2]*this.bLength;
                break;
            case 2:
                tx += this.nextAxes[0][0]*this.bLength;
                ty += this.nextAxes[0][1]*this.bLength;
                tz += this.nextAxes[0][2]*this.bLength;
                break;
            case 3:
                tx -= this.nextAxes[0][0]*this.bLength;
                ty -= this.nextAxes[0][1]*this.bLength;
                tz -= this.nextAxes[0][2]*this.bLength;
                break;
            case 4:
                tx += this.nextAxes[2][0]*this.bLength;
                ty += this.nextAxes[2][1]*this.bLength;
                tz += this.nextAxes[2][2]*this.bLength;
                break;
            case 5:
                tx -= this.nextAxes[2][0]*this.bLength;
                ty -= this.nextAxes[2][1]*this.bLength;
                tz -= this.nextAxes[2][2]*this.bLength;
                break;
            default:
                tx += this.nextAxes[0][0]*this.bLength;
                ty += this.nextAxes[0][1]*this.bLength;
                tz += this.nextAxes[0][2]*this.bLength;
                break;
        }
        return [tx,ty,tz];
    }
}

class SimpleSkeleton {
    constructor(rootLocation = [0,46,0],bodyRotation = 0,boneLengths = lengths1,boneAngles = defaultAngles,boneColors = defaultColors) {
        this.rootLocation = rootLocation;
        this.bodyRotation = bodyRotation;
        this.boneLengths = boneLengths;
        this.boneAngles = boneAngles;
        this.boneColors = boneColors;
        this.orderLeft = [3,4,5,14,15,16,2,13,0,12,1,10,11,17,6,18,19,20,7,8,9];
        this.orderRight = [7,8,9,18,19,20,6,17,0,12,1,10,11,13,2,14,15,16,3,4,5];
    }

    createBones() {
        var output = [];
        var pIndex;
        var bd; //boneDirection
        var bl; //boneLength
        for(var i = 0; i < 21; i++) {
            if(i == 0 || i == 1 || i == 10 || i == 11) {
                bd = 0;
            } else if(i == 2 || i == 13) {
                bd = 2;
            } else if(i == 6 || i == 17) {
                bd = 3;
            } else if(i == 16 || i == 20) {
                bd = 4;
            } else {
                bd = 1;
            }
            if(i == 0) {
                pIndex = null;
            } else if(i == 12) { //Lower torso
                pIndex = 0;
            } else if(i == 6 || i == 10) { //Right shoulder or neck
                pIndex = 1;
            } else if(i == 17) { //Right hip
                pIndex = 12;
            } else {
                pIndex = i - 1;
            }
            if(i < 6) {
                bl = this.boneLengths[i];
            } else if(i < 17) {
                bl = this.boneLengths[i - 4];
            } else {
                bl = this.boneLengths[i - 8];
            }
            var newBone;
            if(i == 0) {
                newBone = new BoneOb1(this.rootLocation,pIndex,bl,bd,this.boneAngles[i],this.bodyRotation);
            } else {
                newBone = new BoneOb1(this.rootLocation,output[pIndex],bl,bd,this.boneAngles[i],this.bodyRotation);
            }
            output.push(newBone);
        }
        return output;
    }

    rotateFigure(rotateAngle = 400) {
        var newAngle = rotateAngle;
        if(newAngle > 180) {
            do {
                newAngle -= 360;
            } while(newAngle > 180);
        } else if(newAngle < -180) {
            do {
                newAngle += 360;
            } while(newAngle < -180);
        }
        this.bodyRotation = newAngle;
    }

    updateSingleAngle(angleIndex = 0, angleValue = 90) {
        if(angleIndex < 21 && angleIndex >= 0 && typeof angleValue == "number") {
            var newIndex = Math.floor(angleIndex);
            this.boneAngles[newIndex] = angleValue;
        }
    }

    updateAllAngles(inputArray = defaultAngles) {
        if(inputArray.length == 21) {
            var numberCount = 0;
            for(var i = 0; i < 21; i++) {
                if(typeof inputArray[i] == "number") {
                    numberCount++;
                }
            }
            if(numberCount == 21) {
                for(i = 0; i < 21; i++) {
                    this.boneAngles[i] = inputArray[i];
                }
            }
        }
    }

    updatePosition(newPosition = [0,46,0]) {
        this.rootLocation = newPosition;
    }

    drawLine(origin,terminus,strokeColor,lineW) {
        var output = `<line x1='${origin[0]}' y1='${-origin[1]}' x2='${terminus[0]}' y2='${-terminus[1]}' stroke='${strokeColor}' stroke-width='${lineW}' />`;
        return output;
    }

    drawFigure() {
        var lineW = 0.75;
        var adjRotation = this.bodyRotation;
        if(adjRotation > 180) {
            do {
                adjRotation -= 360;
            } while(adjRotation > 180);
        } else if(adjRotation < -180) {
            do {
                adjRotation += 360;
            } while(adjRotation < -180);
        }
        var order = adjRotation < 0 ? this.orderRight : this.orderLeft;
        var boneObs = this.createBones();
        var output = "";
        for(var i = 0; i < 21; i++) {
            if(order[i] != 0) {
                output += this.drawLine(boneObs[order[i]].origin,boneObs[order[i]].terminus,this.boneColors[order[i]],lineW);
            }
        }
        return output;
    }
}

var faceOutline = (fhxr = 3,fhyr = 3.5,fhy = 6,chkbr = 2.25,chkby = 2.5,jawr = 2.5,jawy = 2,chinr = 1.125,chiny = 0,offsetx = 0,offsety = 0,strokeWidth = 0.25,fill='none',shadowOpacity = 0.25) => {
    var baseOutline = `<path d='M${offsetx + fhxr} ${-offsety - fhy} A ${fhxr} ${fhyr} 0, 0, 0, ${offsetx - fhxr} ${-offsety - fhy} L ${offsetx - jawr} ${-offsety - jawy} L ${offsetx - chinr} ${-offsety - chiny} A `;
    baseOutline += `${chinr} ${chinr/5} 0, 0, 0, ${offsetx + chinr} ${-offsety - chiny} L ${offsetx + jawr} ${-offsety - jawy} Z' stroke='black' stroke-width='${strokeWidth}' fill='${fill}' />`;
    var faceLeft = `<path d='M${offsetx + fhxr} ${-offsety - fhy} L ${offsetx + chkbr} ${-offsety - chkby} L ${offsetx + chinr} ${-offsety - chiny} L ${offsetx + jawr} ${-offsety - jawy} Z' stroke='none' fill='black' opacity='${shadowOpacity}' />`;
    var faceRight = `<path d='M${offsetx - fhxr} ${-offsety - fhy} L ${offsetx - chkbr} ${-offsety - chkby} L ${offsetx - chinr} ${-offsety - chiny} L ${offsetx - jawr} ${-offsety - jawy} Z' stroke='none' fill='black' opacity='${shadowOpacity}' />`;
    return [baseOutline,faceLeft,faceRight];
};

var faceFeatures = (noseW = 1.5,noseL = 1.75,noseY = 2.5,pupilR = 0.25,eWidth = 1.5,pupilSep = 2.6,pupilY = 4.5,mouthL = 2.25,mouthY = 1.75,smileL = 3,smileG = 0.5,offsetx = 0,offsety = 0,strokeWidth = 0.25,pupilColor = 'black',shadowOpacity = 0.35) => {
    var eyesOpen = `<circle cx='${offsetx - pupilSep/2}' cy='${-offsety - pupilY}' r='${pupilR}' stroke='none' fill='${pupilColor}' />`;
    eyesOpen += `<circle cx='${offsetx + pupilSep/2}' cy='${-offsety - pupilY}' r='${pupilR}' stroke='none' fill='${pupilColor}' />`;
    var eyesClosed = `<path d='M${offsetx - pupilSep/2 - eWidth/2} ${-offsety - pupilY} A ${eWidth/2} ${eWidth/12} 0, 0, 0, ${offsetx - pupilSep/2 + eWidth/2} ${-offsety - pupilY}' stroke='black' stroke-width='${strokeWidth}' fill='none' />`;
    eyesClosed += `<path d='M${offsetx + pupilSep/2 - eWidth/2} ${-offsety - pupilY} A ${eWidth/2} ${eWidth/12} 0, 0, 0, ${offsetx + pupilSep/2 + eWidth/2} ${-offsety - pupilY}' stroke='black' stroke-width='${strokeWidth}' fill='none' />`;
    var eyeBrows = `<path d='M${offsetx - pupilSep/2 - eWidth/2} ${-offsety - pupilY - 2.5*pupilR} A ${eWidth/2} ${pupilR} 0, 0, 1, ${offsetx - pupilSep/2 + eWidth/2} ${-offsety - pupilY - 2.5*pupilR}' stroke='black' stroke-width='${strokeWidth*1.5}' fill='none' />`;
    eyeBrows += `<path d='M${offsetx + pupilSep/2 - eWidth/2} ${-offsety - pupilY - 2.5*pupilR} A ${eWidth/2} ${pupilR} 0, 0, 1, ${offsetx + pupilSep/2 + eWidth/2} ${-offsety - pupilY - 2.5*pupilR}' stroke='black' stroke-width='${strokeWidth*1.5}' fill='none' />`;
    var mouthClosed = `<path d='M${offsetx - mouthL/2} ${-offsety - mouthY} A ${mouthL/2} ${mouthL/15} 0, 0, 0, ${offsetx + mouthL/2} ${-offsety - mouthY}' stroke='black' stroke-width='${strokeWidth}' fill='none' />`;
    var mouthSmile = `<path d='M${offsetx - smileL/2} ${-offsety - mouthY - smileG/4} A ${smileL/2} ${smileG} 0, 0, 0, ${offsetx + smileL/2} ${-offsety - mouthY - smileG/4} A ${smileL/2} ${smileL/20} 0, 0, 1, ${offsetx - smileL/2} ${-offsety - mouthY - smileG/4} Z' stroke='black' stroke-width='${strokeWidth}' fill='white' />`;
    var nose = `<path d='M${offsetx + noseW/2} ${-offsety - noseY} A ${noseW/2} ${noseW/3} 0, 0, 0, ${offsetx - noseW/2} ${-offsety - noseY} Z' stroke='none' fill='black' opacity='${shadowOpacity}' />`;
    nose += `<ellipse cx='${offsetx}' cy='${-offsety - noseY - noseL/2}' rx='${noseL/4}' ry='${noseL/2}' stroke='none' fill='black' opacity='${shadowOpacity}' />`;
    return [eyesOpen,eyesClosed,mouthClosed,mouthSmile,nose,eyeBrows];
};