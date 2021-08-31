
var hero_animation = document.getElementById("hero-animation");
//Default Inputs to testSkeleton: rootLocation = [0,46,0],bodyRotation = 0,boneLengths = lengths1,boneAngles = defaultAngles,boneColors = defaultColors
var testSkeleton = new SimpleSkeleton([0,46,0],45,lengths1,defaultAngles,defaultColors);
var viewBox = "-800 -100 1600 110";
var viewBoxBig = "-200 -100 400 110";
var svgLine1 = `<line x1='-750' y1='1' x2='750' y2='1' stroke='#33F2C4' stroke-width='2' />`;
var drawSprite = (sprite,viewbox = viewBox,lineStr = "") => {
    var output = `<svg viewBox='${viewbox}'>${sprite}${lineStr}</svg>`;
    return output;
};

var rotationInterval;

var jData0 = [0,-10,0,45,105,15,0,-55,95,15,0,-20,-5,0,-35,-85,0,0,75,-30,0]; //Right foot forward - Finished
var jData1 = [0,-10,0,36.25,103.75,15,0,-45,96.25,15,0,-20,-5,0,-32.5,-95.625,0,0,62.5,-31.875,0]; //Finished
var jData2 = [0,-10,0,27.5,102.5,15,0,-35,97.5,15,0,-20,-5,0,-30,-106.25,0,0,50,-33.75,0]; //Finished
var jData3 = [0,-10,0,18.75,101.25,15,0,-25,98.75,15,0,-20,-5,0,-27.5,-116.875,0,0,37.5,-35.625,0];
var jData4 = [0,-10,0,10,100,15,0,-15,100,15,0,-20,-5,0,-25,-127.5,0,0,25,-37.5,0]; //Right foot ground - finished
var jData5 = [0,-10,0,-6.25,98.75,15,0,0,101.25,15,0,-20,-5,0,0,-103.125,0,0,10,-49.375,0];
var jData6 = [0,-10,0,-22.5,97.5,15,0,15,102.5,15,0,-20,-5,0,25,-78.75,0,0,-5,-61.25,0]; //Finished
var jData7 = [0,-10,0,-38.75,96.25,15,0,30,103.75,15,0,-20,-5,0,50,-54.375,0,0,-20,-73.125,0];
var jData8 = [0,-10,0,-55,95,15,0,45,105,15,0,-20,-5,0,75,-30,0,0,-35,-85,0]; //Left foot forward - Finished
var jData9 = [0,-10,0,-45,96.25,15,0,36.25,103.75,15,0,-20,-5,0,62.5,-31.875,0,0,-32.5,-95.625,0];
var jData10 = [0,-10,0,-35,97.5,15,0,27.5,102.5,15,0,-20,-5,0,50,-33.75,0,0,-30,-106.25,0]; //Finished
var jData11 = [0,-10,0,-25,98.75,15,0,18.75,101.25,15,0,-20,-5,0,37.5,-35.625,0,0,-27.5,-116.875,0];
var jData12 = [0,-10,0,-15,100,15,0,10,100,15,0,-20,-5,0,25,-37.5,0,0,-25,-127.5,0]; //Left foot ground - Finished
var jData13 = [0,-10,0,0,101.25,15,0,-6.25,98.75,15,0,-20,-5,0,10,-49.375,0,0,0,-103.125,0];
var jData14 = [0,-10,0,15,102.5,15,0,-22.5,97.5,15,0,-20,-5,0,-5,-61.25,0,0,25,-78.75,0]; //Finished
var jData15 = [0,-10,0,30,103.75,15,0,-38.75,96.25,15,0,-20,-5,0,-20,-73.125,0,0,50,-54.375,0];

var runningAngles1 = [jData0,jData1,jData2,jData3,jData4,jData5,jData6,jData7,jData8,jData9,jData10,jData11,jData12,jData13,jData14,jData15];

var rAngles = [jData0,jData1,jData2,jData3,jData4,jData5,jData6,jData7,jData8,jData9,jData10,jData11,jData12,jData13,jData14,jData15];
var rIndex = 0;
var xPosition = -1200;
var movingRight = true;
testSkeleton.updatePosition([xPosition,testSkeleton.rootLocation[1],testSkeleton.rootLocation[2]]);
testSkeleton.updateAllAngles(rAngles[rIndex]);
hero_animation.innerHTML = drawSprite(testSkeleton.drawFigure(),viewBox,svgLine1);

rotationInterval = setInterval(() => {
    rIndex++;
    if(rIndex >= rAngles.length) {
        rIndex = 0;
    }
    if(movingRight) {
        xPosition += 7;
        if(xPosition > 1200) {
            movingRight = false;
            xPosition = 1200;
            testSkeleton.rotateFigure(-45);
        }
    } else {
        xPosition -= 7;
        if(xPosition < -1200) {
            movingRight = true;
            xPosition = -1200;
            testSkeleton.rotateFigure(45);
        }
    }
    testSkeleton.updatePosition([xPosition,testSkeleton.rootLocation[1],testSkeleton.rootLocation[2]]);
    testSkeleton.updateAllAngles(rAngles[rIndex]);
    hero_animation.innerHTML = drawSprite(testSkeleton.drawFigure(),viewBox,svgLine1);
},40);
