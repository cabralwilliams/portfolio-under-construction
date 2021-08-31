
var avatar = document.getElementById("avatar");
//[eyesOpen,eyesClosed,mouthClosed,mouthSmile,nose,eyeBrows]
var face1 = faceOutline();
var features1 = faceFeatures();
avatar.innerHTML = `<svg viewBox='-4 -11 8 12'>${face1[0]}${face1[1]}${face1[2]}${features1[4]}${features1[5]}${features1[0]}${features1[3]}</svg>`;
var eyeIndices = [0,0,0,0,0,0,0,0,0,0,1];
var mouthIndices = [2,2,2,2,3,3,3,3,3,3,3,3,2,2,2,2];
var eIndex = 0;
var mIndex = 0;

console.log(`<svg viewBox='-4 -11 8 12'>${face1[0]}${face1[1]}${face1[2]}${features1[4]}${features1[5]}${features1[0]}${features1[3]}</svg>`);

var avatarInterval = setInterval(() => {
    eIndex++;
    mIndex++;
    if(eIndex >= eyeIndices.length) {
        eIndex = 0;
    }
    if(mIndex >= mouthIndices.length) {
        mIndex = 0;
    }
    avatar.innerHTML = `<svg viewBox='-4 -11 8 12'>${face1[0]}${face1[1]}${face1[2]}${features1[4]}${features1[5]}${features1[eyeIndices[eIndex]]}${features1[mouthIndices[mIndex]]}</svg>`;
},300);