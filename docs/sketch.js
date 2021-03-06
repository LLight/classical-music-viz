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
var lineWeight=2;
var textHeight;
var outerHeightBig;
var outerHeightSmall;
var innerHeightBig;
var innerHeightSmall;
var timeSigNum;
var shapeSize;
var nLines;
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

function preload(){
 //jsonurl='https://www.asdesigned.com/6310examples/proxy.php?url=https://raw.githubusercontent.com/LLight/classical-music-viz/main/features.json';
  featureData=loadJSON('features.json');

  violin = loadImage('images/violin_solid.svg');
  clarinet = loadImage('images/clarinet_solid.svg');
  sax = loadImage('images/sax_solid.svg');
  keyboard = loadImage('images/keys_solid.svg');
  drum = loadImage('images/drum_solid.svg');
  singer = loadImage('images/singer.svg');
  families = loadImage('images/families.svg');
  difficultyEx = loadImage('images/difficulty.png');
}

function setup() {
  //createCanvas(800, 800);
  myCanvas=createCanvas(windowHeight, windowHeight-80);
  myCanvas.parent('myContainer');
  background(240);
  noLoop();
  rectMode(CENTER);
  nscores = Object.keys(featureData).length;
  helpButton = createButton('?');
  helpButton.position(10, 10);
  helpButton.mouseOver(question);

  playButton = createButton('Play MIDI');
  playButton.position(3*width/4, height/2);
  playButton.mousePressed(toggleMIDI);

  viewButton = createButton('Preview score');
  viewButton.position(3*width/4, height/2-height/8);
  viewButton.mousePressed(() => showScore());

  openSpotifyButton=createButton('Listen on Spotify');
  openSpotifyButton.position(3*width/4,height/2+height/8);
  openSpotifyButton.mousePressed(openSpotify);

  closeSpotifyButton=createButton("X");
  closeSpotifyButton.position(myCanvas.width-closeSpotifyButton.height,myCanvas.height-closeSpotifyButton.height);
  closeSpotifyButton.mousePressed(closeSpotify);

  closeScoreButton=createButton('Close score');
  closeScoreButton.position(width-closeScoreButton.width,closeScoreButton.height);
  closeScoreButton.mousePressed(closeScore);

  downloadButton = createButton('Download Score');
  downloadButton.position(width-downloadButton.width,downloadButton.height*3);
  downloadButton.mousePressed(downloadScore);
  //closeButton = createButton('Close');
  //closeButton.position(width/6,height/20);
  //closeButton.mousePressed(closeScore);

  playButton.hide();
  viewButton.hide();
  helpButton.hide();
  openSpotifyButton.hide();
  closeScoreButton.hide();
  downloadButton.hide();
  closeSpotifyButton.hide();
  //downloadButton.hide();
  //closeButton.hide();
}

function draw(){
  noLoop();

  pieceData(featureData);

  //console.log(featureData);
  [majorSlowColors, minorSlowColors, majorFastColors, minorFastColors] = defineColors();

  textHeight=floor(windowHeight/40);

  //intro page
  if (frameCount==1) {
    for (i=0; i < fileList.length; i++){
    scoreList.push('images/' + fileList[i].split(".")[0] + '.png');
  }
    print ('nscores=',nscores);
    background(255);
    textAlign(CENTER);
    textSize(textHeight+14);
    text('Score Visualizations',width/2,height/4);
    textSize(textHeight+6);
    //textStyle(ITALIC);
    text('A visual exploration tool for sheet music',width/2,3*height/4);
    textSize(textHeight);
    textStyle(NORMAL);
    text('Click anywhere to start',width/2,height-textHeight);
    randomSort();
    intro1();
  }
  //explain representations of mood through color palettes
  else if (frameCount==2) {
   push();
   background(255);
   textAlign(CENTER);
   textSize(textHeight);
   text('Click anywhere to continue',width/2,height-textHeight);
   textSize(textHeight+12);
   text('Color palettes',width/2,height/12);
   pop();
   intro2();
   //playButton.hide();
  }
  //explain representations of time signature (shape) and note density (number of lines)
  else if (frameCount==3){
   push();
   background(255);
   textAlign(CENTER,CENTER);
   textSize(textHeight+6);
   text('Time Signature',width/2,height/8);
   text('Note Density',width/2,height/2);
   textSize(textHeight);
   text('In 3 or 6',width/3, 3*height/8);
   text('In 2 or 4', 2*width/3, 3*height/8);
   text('Fewer notes per second',width/3,5*height/6,width/4,textHeight*3);
   text('More notes per second',2*width/3,5*height/6,width/4,textHeight*3);
   text('Click anywhere to continue',width/2,height-textHeight);
   pop();

   intro3();
  }

  else if (frameCount==4){
      push();
      textSize(textHeight+6);

      image(families,width*.3,height*.1,width*.4,width*.4*families.height/families.width);
      image(difficultyEx,width*.2,height*.6,width*.5,width*.5*difficultyEx.height/difficultyEx.width);
      text('Instrument families',width*.5,height*.1);
      text('Difficulty level',width*.5,height*.6);
      textSize(textHeight);
      text('Easy',width*.8,height*.7);
      text('Hard',width*.8,height*.85);
      pop();
      text('Click anywhere to continue',width/2,height-textHeight);
  }
  //start the main part of the visualizations
  //display random pieces with one currently selected shown larger in the middle
  //other random pieces are smaller at the top and bottom of the screen
  else  {
    background(255);

    playButton.show();
    viewButton.show();
    helpButton.show();
    openSpotifyButton.show();

    if (randomize==1){
      randomSort();
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

      if (frameCount>5 && i==0){
        randomPiece=newCenterPiece;
        console.log('i=',i,'randomPiece=',randomPiece,fileList[randomPiece]);
      }
      else {
        randomPiece=randomNumList[i];
        newCenterPiece=randomNumList[0];
        console.log('i=',i,'randomPiece=',randomPiece,fileList[randomPiece]);
      }

      if (i==0){
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

    //playButton.mousePressed(toggleMIDI);
    viewButton = createButton('Preview Score');
    viewButton.position(3*width/4, height/2-height/8);
   // viewButton.mousePressed(showScore());
    viewButton.mousePressed(() => showScore());
  }
}

function intro1(){
  for (let i=0, x=width/4; i<3; i++,x+=width/4){
      randomPiece=randomNumList[i];
      console.log(randomPiece,fileList[randomPiece]);
      setParameters(randomPiece);
     // console.log('timeSigNum='+timeSigNum);
     // console.log('nLines='+nLines);
      let y=height/2;
      push();
      drawViz(randomPiece, x, y, width/5, width/10, lineWeight, textHeight, colorPalette,strings,voice,percussion,woodwinds,keys,4,difficulty);
      pop();
    }
}

function intro2(){
  //x and y axes
  let offset=width/8;
  line(offset,height/2,width-offset,height/2);
  line(width/2,offset,width/2,height-offset);

  push();
  textSize(textHeight);
  textAlign(CENTER);
  fill(0);
  text('Minor',offset,height/2-5);
  text('Major',width-offset,height/2-5);
  text('Fast tempo',width/2,offset-5);
  text('Slow tempo',width/2,height-offset+15);
  fill(100);
  textStyle(ITALIC);
  text('Happy/upbeat',3*width/4,height/4);
  text('Calm/peaceful',3*width/4,3*height/4);
  text('Angry/intense',width/4,height/4);
  text('Sad/melancholy',width/4,3*height/4);
  pop();
  [majorSlowColors,minorSlowColors,majorFastColors, minorFastColors]=defineColors();
  noStroke();
  circles(3*width/4-offset, 3*height/4-offset, majorSlowColors, width/8);
  circles(3*width/4-offset, height/4+offset, majorFastColors, width/8);
  circles(width/4+offset, 3*height/4-offset, minorSlowColors, width/8);
  circles(width/4+offset, height/4+offset, minorFastColors, width/8);
}

function intro3(){
  push();
  colorPalette=majorFastColors;
  strokeWeight(lineWeight);
  fill(colorPalette[1]);
  stroke(colorPalette[0]);

  // time signature numerator=2 or 4: fill with squares
  let midX=2*width/3;
  let midY=height/4;
  let outerHeight=width/8;
  let innerHeight=outerHeight/2;
  fill(colorPalette[1]);
  rect(midX,midY,outerHeight);
  fill(colorPalette[0]);
  fillShapes(midX,midY,outerHeight,2,4,4);

  //time signature numerator=3 or 6: fill with triangles
  midX=width/3;
  midY=height/4;
  fill(colorPalette[1]);
  rect(midX,midY,outerHeight);
  fill(colorPalette[0]);
  fillShapes(midX,midY,outerHeight,3,4,4);

  //more notes per measure
  midX=2*width/3;
  midY=2*height/3;
  fill(colorPalette[1]);
  rect(midX,midY,outerHeight);
  fill(colorPalette[0]);
  fillShapes(midX,midY,outerHeight,2,9,4);

  //fewer notes per measure
  midX=width/3;
  midY=2*height/3;
  fill(colorPalette[1]);
  rect(midX,midY,outerHeight);
  fill(colorPalette[0]);
  fillShapes(midX,midY,outerHeight,2,3,4);
  pop();
}

function fillShapes(midX,midY,outerHeight,timeSigNum,nLines,shapeSize){
  lineSpacing=outerHeight/nLines;
    for (i=1; i<=nLines; i++){
     //h=i*lineSpacing;
     x=round(midX-outerHeight/2+i*lineSpacing-lineSpacing/2);

     if (timeSigNum==2 | timeSigNum==4){
       for (j=1; j<=nLines; j++){
         y=round(midY-outerHeight/2+j*lineSpacing-lineSpacing/2);
         rect(x,y,shapeSize,shapeSize);
       }
     }

     else if (timeSigNum==3 | timeSigNum==6 | timeSigNum==5){
       for (j=1; j<=nLines; j++){
         y=round(midY-outerHeight/2+j*lineSpacing-lineSpacing/2);
         triangle(x,y-shapeSize/2,
                  x-shapeSize/sqrt(3), y + shapeSize/sqrt(3),
                  x+shapeSize/sqrt(3), y + shapeSize/sqrt(3));
        }
     }
   }
}

function circles(xCenter,yCenter,colors,d){
  push();
  fill(colors[0]);
  arc(xCenter,yCenter,d,d,PI/2,3*PI/2);
  fill(colors[1]);
  arc(xCenter,yCenter,d,d,3*PI/2,PI/2);
  pop();
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
  difficulty=difficultyList[randomPiece];
}

function randomSort(){
  //nPieces=60;
  randomNumList=[];
  for (let i=0; i < nscores - 1; i++){
    randomNumList.push(i);
  }
  //console.log('randomNumList length=',randomNumList.length);
  randomNumList.sort(() => Math.random()-0.5);
}


function pieceData (featureData) {
  for (let i=0; i< nscores - 1; i++){
    //print(i);
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

// When the user clicks the mouse
function mousePressed() {
  if (frameCount<=4){
    clear();
    redraw();
  }
  else{
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
}

function question(){
  textAlign(LEFT,CENTER);
  textSize(textHeight-6);
  text('Currently selected piece is the square in the center. Select a different square to change the current selection.',width/2,20,width*.8,textHeight*3);
}

function showScore(){
  scoreClicked+=1;   //number of times button clicked (to prevent multiple button instances)
  scoreOpen=1;
  viewButton.hide();

  //img=createImg(imageFile,"Image of score");
  img.position(windowHeight,0);
  img.size(windowWidth-windowHeight,(windowWidth-windowHeight)*img.height/img.width);
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
  //redraw();
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
  if (spotifyOpen==0){
    closeSpotifyButton.show();
    iframe=document.createElement('iframe');
    iframe.src=loc;
    iframe.allow="encrypted-media";
    iframe.width=myCanvas.width;
    iframe.height="80";
    myContainer.appendChild(iframe);
    spotifyOpen=1;
    //closeSpotifyButton.mousePressed(closeSpotify);
  }
}

function closeSpotify(){
  if (typeof iframe != "undefined") {
     iframe.remove();
  }
  closeSpotifyButton.hide();
  spotifyOpen=0;
  //redraw();
}
