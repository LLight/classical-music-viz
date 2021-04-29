//define constants and initialize global variables
var colorPalette=[];
var randomPiece;
var nPieces;
var composer;
var title;
var id;
var midX;
var midY;
var newCenterPiece;
var oldCenterPiece;
var lineWeight=2;
var textHeight;
var outerHeightBig;
var outerHeightSmall;
var innerHeightBig;
var innerHeightSmall;
var timeSigNum;
var shapeSize;
var nLines;
var spotifyID;
var keyTypesList=[];
var tempoList=[];
var timeSigNumList=[];
var composerList=[];
var titleList=[];
var nLinesList=[];
var spotifyIDList=[];
var tempoList=[];
var randomNumList;
var keysList=[];
var voiceList=[];
var woodwindsList=[];
var stringsList=[];
var percussionList=[];
var brassList=[];
var fileList=[];
var midiFileList=[];
var scoreList=[];
var difficultyList=[];
var nscores;
var img;
var selectedFile;
var randomize=1;
var midiFile;
var isPlaying=0;
var playbackStarted=0;
var imageFile;
var closeScoreButton;
var scoreClicked=0;
var scoreOpen=0;
var loc;
var spotifyOpen=0;
var imgtemp;
var toggleRandom=1;

function preload(){
  featureData=loadJSON('features.json');

  violin = loadImage('images/violin_solid.svg');
  clarinet = loadImage('images/clarinet_solid.svg');
  sax = loadImage('images/sax_solid.svg');
  keyboard = loadImage('images/keys_solid.svg');
  drum = loadImage('images/drum_solid.svg');
  singer = loadImage('images/singer.svg');
}

function setup() {
//  print('padding=',document.getElementById('navbar').padding);
  navbarH=document.getElementById('navbar').clientHeight;
  canvasH = windowHeight - navbarH- 80;
  canvasW=canvasH;
  myCanvas=createCanvas(canvasW,canvasH);  //create square canvas, size 80 pct of total window height
  myCanvas.parent('canvasContainer');
  yoffset=document.getElementById('exploreContainer').offsetTop; //y coordinate of top of canvas
  totalW=document.getElementById('exploreContainer').clientWidth;  //total width of screen (canvas plus area on right side)

  textHeight=floor(canvasH/40);
  textSize(textHeight);
  noLoop();
  rectMode(CENTER);
  nscores = Object.keys(featureData).length;

  sel=createSelect();
  sel.position(20,yoffset);
  sel.option('Show random pieces');
  sel.option('Show pieces similar to current selection');
  sel.changed(selectEvent);

  viewButton = createButton('Preview score');
  viewButton.position(3*canvasW/4, yoffset + 3*canvasH/8);
  viewButton.mousePressed(() => showScore());

  playButton = createButton('Play MIDI');
  playButton.position(3*canvasW/4, yoffset+canvasH/2);
  playButton.mousePressed(toggleMIDI);

  openSpotifyButton=createButton('Listen on Spotify');
  openSpotifyButton.position(3*canvasW/4, yoffset + 5*canvasH/8);
  openSpotifyButton.mousePressed(openSpotify);

  closeSpotifyButton=createButton("X");
  closeSpotifyButton.position(canvasW-closeSpotifyButton.height,yoffset + canvasH - closeSpotifyButton.height);
  closeSpotifyButton.mousePressed(closeSpotify);

  closeScoreButton=createButton('Close score');
  closeScoreButton.position(canvasW, yoffset);
  closeScoreButton.mousePressed(closeScore);

  downloadButton = createButton('Download Score');
  downloadButton.position(canvasW, yoffset + downloadButton.height*2);
  downloadButton.mousePressed(downloadScore);

  closeScoreButton.hide();
  downloadButton.hide();
  closeSpotifyButton.hide();
}

function draw(){
  noLoop();
  console.log('toggle random=',toggleRandom);

  pieceData(featureData);

  [majorSlowColors, minorSlowColors, majorFastColors, minorFastColors] = defineColors();
  console.log('frame=',frameCount);
  //intro page
  if (frameCount==1) {
    for (i=0; i < fileList.length; i++){
    scoreList.push('images/' + fileList[i].split(".")[0] + '.png');
    }
  }

  //display random pieces with one currently selected shown larger in the middle
  //other random pieces are smaller at the top and bottom of the screen

    viewButton.show();
    playButton.show();
    viewButton.show();
    openSpotifyButton.show();

    //re-randomize the pieces shown, stop playback, close score and spotify player if open
    if (randomize==1){
      if (toggleRandom==1){
        randomSort();
      }
      else if (toggleRandom==0){
        sortSimilar();
      }
      isPlaying=0;
      playbackStarted=0;
      MIDIjs.stop();
      scoreClicked=0;
      if (scoreOpen==1){
        img.remove();
        scoreOpen=0;
        closeScoreButton.hide();
        downloadButton.hide();
      }
      if (spotifyOpen=1){
        closeSpotify();
      }
    }

    outerHeightBig=width/4;
    outerHeightSmall=width/6;
    innerHeightBig=outerHeightBig/2;
    innerHeightSmall=outerHeightSmall/2;

    for (let i=0; i<7; i++){

      if (frameCount>1 && i==0){
        randomPiece=newCenterPiece;
        console.log('i=',i,'randomPiece=',randomPiece,fileList[randomPiece]);
      }
      else {
        randomPiece=randomNumList[i];
        newCenterPiece=randomNumList[0];
        console.log('i=',i,'randomPiece=',randomPiece,fileList[randomPiece]);
      }

      if (i==0){
      //  randomPiece=randomNumList[i];
        imageFile=scoreList[randomPiece];
        imgtemp=loadImage(imageFile);
        console.log('image file=',imageFile);
        selectedFile=fileList[randomPiece];
        midiFile='midi/'+ midiFileList[randomPiece];
        console.log('new center piece=',newCenterPiece,selectedFile);
        console.log('MIDI file=',midiFile);
        spotifyID=spotifyIDList[randomPiece];
        loc = "https://open.spotify.com/embed/track/"+spotifyID;
        console.log('SpotifyID=',spotifyID);
      }
      if (scoreClicked==0){
        img=createImg(imageFile,"Image of score");
        img.hide();
      }

      setParameters(randomPiece);
      if (i==0){
        x=width/2;
        y=height/2;

        drawViz(randomPiece, x, y, outerHeightBig, innerHeightBig, lineWeight, textHeight, colorPalette,strings,voice,percussion,woodwinds,keys,6,difficulty);

        push();
        textSize(textHeight);
        textAlign(CENTER,CENTER);
        rectMode(CENTER);
        fill(0);
        text(composer+': \n "'+ title +'"',
           x-width*.4, height/2, width/5, height/2);
        pop();
      }
      else{
        if (i<=3){
          x=i/4*width;
          y=height/6;
        }
        else{
          x=(i-3)/4*width;
          y=5*height/6;
        }
        drawViz(randomPiece, x, y, outerHeightSmall, innerHeightSmall, lineWeight, textHeight, colorPalette,strings,voice,percussion,woodwinds,keys,4,difficulty);
      }
    }

    if (isPlaying==1){
      playButton.html("Pause");
    }
    else if (playbackStarted==1 & isPlaying==0){
      playButton.html("Resume");
    }
    else if (playbackStarted==0){
      playButton.html("Play MIDI");
    }
    //print("spotifyID=",spotifyID);
    if (!spotifyID){
      openSpotifyButton.html('Not available on Spotify');
    }
    else{
      openSpotifyButton.html('Listen on Spotify');
    }

    oldCenterPiece=newCenterPiece;
}

function setParameters(randomPiece){
  nLines=nLinesList[randomPiece];
  timeSigNum=timeSigNumList[randomPiece];
  colorPalette=setColors(randomPiece);
  composer=composerList[randomPiece];
  title=titleList[randomPiece];
  //spotifyID=spotifyIDList[randomPiece];
  strings=stringsList[randomPiece];
  voice=voiceList[randomPiece];
  percussion=percussionList[randomPiece];
  woodwinds=woodwindsList[randomPiece];
  keys=keysList[randomPiece];
  brass=brassList[randomPiece];
  difficulty=difficultyList[randomPiece];
}

function randomSort(){
  console.log('executed random sort');
  randomNumList=[];
  for (let i=0; i < nscores - 1; i++){
    randomNumList.push(i);
  }
  randomNumList.sort(() => Math.random()-0.5);
  if (frameCount>1){
    randomNumList[0]=newCenterPiece;
  }
  console.log('random num list from randomSort',randomNumList);
}

function sortSimilar(){
  console.log('executed similar sort');
  console.log('newCenterPiece at start of sort=',newCenterPiece);
  similarityList=[];
  for (let i=0; i<nscores-1; i++){
    similarity=0; //for each piece, calculate a similarity score between that piece and the current selection
    if (timeSigNumList[i]==timeSigNumList[newCenterPiece]){
      similarity+=1;  //+1 for same time signature numerator
    }

    if (difficultyList[i]==difficultyList[newCenterPiece]){
      similarity+=2;  //+2 for same difficulty score
    }
    else if (abs(difficultyList[i]-difficultyList[newCenterPiece])<=1){
      similarity+=1;  //+1 for difficulty score within +/- 1
    }

    if (abs(nLinesList[i]-nLinesList[newCenterPiece])<=2){
      similarity+=1;  //+1 for note density within +/- 2 notes/sec
    }

    if (stringsList[newCenterPiece]==stringsList[i] && voiceList[newCenterPiece]==voiceList[i] &&
     keysList[newCenterPiece]==keysList[i] && woodwindsList[newCenterPiece]==woodwindsList[i] &&
      brassList[newCenterPiece]==brassList[i]){
         similarity+-2; //+2 for exact same instrument categories
       }
    else if ((stringsList[newCenterPiece]==1 & stringsList[i]==1) | (voiceList[newCenterPiece]==1 & voiceList[i]==1) |
     (keysList[newCenterPiece]==1 & keysList[i]==1) | (woodwindsList[newCenterPiece]==1 & woodwindsList[i]==1) |
     (brassList[newCenterPiece]==1 & brassList[i]==1)){
         similarity+-1; //+1 for at least one match on instrument family
       }

    if ( (tempoList[i]>=100 && tempoList[newCenterPiece]>=100) | (tempoList[i]<100 && tempoList[newCenterPiece]<100)){
      similarity+=1; //+1 if tempo is in same category
    }

    if (keyTypesList[i] == keyTypesList[newCenterPiece]){
      similarity+=1; //+1 if pieces are in the same mode;
    }
    similarityList.push(similarity); //list of similarity scores for each piece
  }
  var simDistinct=[...new Set(similarityList)] //distinct values of similarity scores
  simDistinct.sort(function(a,b){return b-a})  //sorted in descending order
  function getAllIndexes(arr, val) {       //get list of all indexes in array corresponding to a specific value
      var indexes = [], i;
      for(i = 0; i < arr.length; i++)
          if (arr[i] === val & i!=newCenterPiece)
              indexes.push(i);
      return indexes;
  }

  //create  a list of indexes of pieces sorted by similarity score (best to worst match)
 sortedIndexList=[];
  for (i=0; i<simDistinct.length; i++){
  		a=getAllIndexes(similarityList,simDistinct[i]);  //list of all indexes corresponding to a specific similarity score
      sortedIndexList.push(a);
  }

  randomNumList=[newCenterPiece].concat(sortedIndexList.flat());
  //console.log('randomNumList at end of sortsimilar',randomNumList);
}

function pieceData (featureData) {
  for (let i=0; i< nscores - 1; i++){
    keyTypesList.push(featureData[i].keyType);
    tempoList.push(featureData[i].tempo);
    timeSigNumList.push(featureData[i].timeSig[0]);
    composerList.push(featureData[i].composer);
    titleList.push(featureData[i].title);
    nLinesList.push(floor(featureData[i].noteDensity));
    spotifyIDList.push(featureData[i].spotifyID);
    keysList.push(featureData[i].keys);
    voiceList.push(featureData[i].voice);
    woodwindsList.push(featureData[i].woodwinds);
    stringsList.push(featureData[i].strings);
    percussionList.push(featureData[i].percussion);
    brassList.push(featureData[i].brass);
    fileList.push(featureData[i].filename);
    midiFileList.push(featureData[i].midiFileName);
    difficultyList.push(featureData[i].difficulty);
  }
}

function drawViz(randomPiece,midX,midY,outerHeight,innerHeight, lineWeight,textHeight,colorPalette,strings,voice,percussion,woodwinds,keys,shapeSize, difficulty){

  //outer shape
  push();
  strokeWeight(lineWeight);
  fill(colorPalette[1]);
  stroke(colorPalette[0]);
  rectMode(CENTER);
  rect(midX,midY,outerHeight);
  pop();

  push();
  if (nLines>=9){
    nLines=9;
  }
  lineSpacing=outerHeight/(nLines+1);
  //line spacing determined by noteDensity
  stroke(colorPalette[0]);

  for (i=1; i<=nLines+1; i++){
    h=i*lineSpacing;
    fill(colorPalette[0]);
    x=round(midX-outerHeight/2+i*lineSpacing-lineSpacing/2);

    if (timeSigNum==2 | timeSigNum==4){
      for (j=1; j<=nLines+1; j++){
        y=round(midY-outerHeight/2+j*lineSpacing-lineSpacing/2);
        rect(x,y,shapeSize,shapeSize);
      }
    }

    else if (timeSigNum==3 | timeSigNum==6 | timeSigNum==5){
      for (j=1; j<=nLines+1; j++){
        y=round(midY-outerHeight/2+j*lineSpacing-lineSpacing/2);
        triangle(x,y-shapeSize/2,
                 x-shapeSize/sqrt(3), y + shapeSize/sqrt(3),
                 x+shapeSize/sqrt(3), y + shapeSize/sqrt(3));
       }
    }
  }
  pop();

  //inner shape
  push();
  fill(colorPalette[0]);
  stroke(colorPalette[0]);
  circle(midX,midY,innerHeight);
  if (strings==1){
    image(violin,midX+0.1*innerHeight,midY-0.2*innerHeight,0.4*innerHeight, 0.4*innerHeight);
  }
  if (woodwinds==1){
    image(clarinet, midX-innerHeight/10, midY-0.4*innerHeight, 0.4*innerHeight, 0.4*innerHeight);
  }
  if (percussion==1){
    image(drum, midX-0.4*innerHeight, midY, 0.3*innerHeight, 0.3*innerHeight);
  }
   if (keys==1){
    image(keyboard, midX-0.1*innerHeight, midY+0.2*innerHeight, 0.3*innerHeight, 0.3*innerHeight);
  }
  if (voice==1){
    image(singer, midX-0.4*innerHeight, midY-0.35*innerHeight, 0.4*innerHeight, 0.3*innerHeight);
  }
  pop();
  //difficulty
  circleSpacing=outerHeight/6;
  circleD=circleSpacing/2;
  padding=0;
  push();
  stroke(75);
  for (i=1;i<=5;i++) {
    if (i<=difficulty){
      fill(75);
    }
    else{
      fill(255);
    }
    circle(midX - outerHeight/2 + circleSpacing * i, midY+outerHeight/2 + circleD+padding,circleD);
  }
  pop();
}

function defineColors(){
  var majorSlowColors=[color(201,177,208),color(247,206,215)];
  var minorSlowColors=[color(102,89,108),color(110,128,169)];
  var majorFastColors=[color(108,209,58),color(249,229,71)];
  var minorFastColors = [color(205,0,26),color(255,105,0)];
  return [majorSlowColors,minorSlowColors,majorFastColors,minorFastColors];
}

//var colorPalette;
function setColors(i){
  var colorPalette;
  if (keyTypesList[i] == 'major' && tempoList[i]<100){
      colorPalette=majorSlowColors;
    }
  else if (keyTypesList[i] == 'minor' && tempoList[i] < 100){
      colorPalette=minorSlowColors;
    }
  else if (keyTypesList[i]  == 'major' && tempoList[i]  >=100){
      colorPalette=majorFastColors;
    }
    else if (keyTypesList[i]  == 'minor' && tempoList[i]  >=100){
      colorPalette=minorFastColors;
    }
  return colorPalette;
}

// When the user clicks the mouse on one of the smaller icons to change the current selection
function mousePressed() {
    for (let i=1; i<7; i++){
      if (i<=3){
          x=i/4*width;
          y=height/6;
        }
        else{
          x=(i-3)/4*width;
          y=5*height/6;
        }
      let distance=dist(mouseX, mouseY, x, y);
      if (distance < outerHeightSmall/2) {
        newCenterPiece=randomNumList[i];
        randomize=1;
        clear();
        redraw();
      }
    }
}


function showScore(){
  scoreClicked+=1;   //number of times button clicked (to prevent multiple button instances)
  scoreOpen=1;

  imgX=canvasW+downloadButton.width;
  imgY=yoffset;
  img.position(imgX,imgY);
  imgW=(windowWidth-imgX)*.9;
  imgH = imgW * img.height / img.width;
  img.size(imgW, imgH);
  img.show();

  //if (typeof closeButton =="undefined"){
  if (scoreClicked==1) {
    closeScoreButton.show();
    downloadButton.show();
  }
}

function downloadScore(){
  imgtemp.save(imageFile.split("/")[1],'png');
}

function closeScore(){
  randomize=0;
  closeScoreButton.hide();
  downloadButton.hide();
  img.hide();
  scoreOpen=0;
  scoreClicked=0;
}

function toggleMIDI(){
  if (isPlaying==0){
    if (playbackStarted==0){
      MIDIjs.play(midiFile);
    }
    else {
      MIDIjs.resume(midiFile);
    }
    isPlaying=1;
    playbackStarted=1;
    playButton.html("Pause");
  }
  else if (isPlaying==1){
    MIDIjs.pause(midiFile);
    playButton.html("Resume");
    isPlaying=0;
  }
}


function openSpotify(){
  console.log('spotifyID=',spotifyID);
  if (spotifyOpen==0 && spotifyID){
      openSpotifyButton.html('Listen on Spotify');
    closeSpotifyButton.show();
    iframe=document.createElement('iframe');
    iframe.src=loc;
    iframe.allow="encrypted-media";
    iframe.width=myCanvas.width;
    iframe.height="80";

    spotifyContainer.appendChild(iframe);
    spotifyOpen=1;
  }
}

function closeSpotify(){
  if (typeof iframe != "undefined") {
     iframe.remove();
  }
  closeSpotifyButton.hide();
  spotifyOpen=0;
}

function selectEvent(){
  let item = sel.value();
  if (item == 'Show random pieces'){
    toggleRandom=1;
    console.log('sort order=random');
  }
  else {
    toggleRandom=0;
    console.log('sort order=similar');
  }

  console.log('randomNumList after changing selection=',randomNumList);
  newCenterPiece=randomNumList[0];
  randomize=1;
  clear();
  redraw();
}
