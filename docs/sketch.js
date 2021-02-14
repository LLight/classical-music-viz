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
var idList=[];
var tempoList=[];
var randomNumList;
var keysList=[];
var voiceList=[];
var woodwindsList=[];
var stringsList=[];
var percussionList=[];
var fileList=[];
var scoreList=[];
var nscores;
var img;
var selectedFile;
var randomize=1;

function preload(){
 //jsonurl='https://www.asdesigned.com/6310examples/proxy.php?url=https://raw.githubusercontent.com/LLight/classical-music-viz/main/features.json';
  featureData=loadJSON('features.json');

  violin = loadImage('images/violin_solid.svg');
  clarinet = loadImage('images/clarinet_solid.svg');
  sax = loadImage('images/sax_solid.svg');
  keyboard = loadImage('images/keys_solid.svg');
  drum = loadImage('images/drum_solid.svg');
  singer = loadImage('images/singer.svg');

}

function setup() {
  //createCanvas(800, 800);
  createCanvas(windowHeight, windowHeight);
  background(240);
  noLoop();
  rectMode(CENTER);
}



function draw(){
  noLoop();
  pieceData(featureData);

 // console.log(featureData);
       [majorSlowColors, minorSlowColors, majorFastColors, minorFastColors]=defineColors();

  textHeight=floor(windowHeight/40);

  //intro page
  if (frameCount==1) {
    nscores=fileList.length;
    for (i=0; i < fileList.length; i++){
    scoreList.push(loadImage(fileList[i] + '.png'));
  }
    print ('nscores=',nscores);
    background(240);
    textAlign(CENTER);
    textSize(textHeight+14);
    text('Classical Music Visualizations',width/2,height/4);
    textSize(textHeight+6);
    textStyle(ITALIC);
    text('Explore scores with pictures',width/2,3*height/4);
    textSize(textHeight);
    textStyle(NORMAL);
    text('Click anywhere to start',width/2,height-textHeight);
    randomSort();
    intro1();
  }
  //explain representations of mood through color palettes
  else if (frameCount==2) {
   push();
   background(240);
   textAlign(CENTER);
   textSize(textHeight);
   text('Click anywhere to continue',width/2,height-textHeight);
   textSize(textHeight+12);
   text('Color palettes',width/2,height/12);
   pop();
   intro2();
  }
  //explain representations of time signature (shape) and note density (number of lines)
  else if (frameCount==3){
   push();
   background(240);
   textAlign(CENTER,CENTER);
   textSize(textHeight+6);
   text('Time Signature',width/2,height/8);
   text('Note Density',width/2,height/2);
   textSize(textHeight);
   text('In 3 or 6',width/3, 3*height/8);
   text('In 2 or 4', 2*width/3, 3*height/8);
   text('Fewer notes per measure',width/3,5*height/6,width/4,textHeight*3);
   text('More notes per measure',2*width/3,5*height/6,width/4,textHeight*3);
   text('Click anywhere to display random pieces',width/2,height-textHeight);
   pop();

   intro3();
  }
  //start the main part of the visualizations
  //display random pieces with one currently selected shown larger in the middle
  //other random pieces are smaller at the top and bottom of the screen
  else  {
    background(240);
    helpButton = createButton('?');
    helpButton.position(10, 10);
    helpButton.mouseOver(question);

    if (randomize==1){
      randomSort();
    }
    outerHeightBig=width/3;
    outerHeightSmall=width/6;
    innerHeightBig=outerHeightBig/2;
    innerHeightSmall=outerHeightSmall/2;

    for (let i=0; i<7; i++){

      if (frameCount>4 && i==0){
        randomPiece=newCenterPiece;
        //console.log('center piece=',randomPiece,fileList[randomPiece]);
        //console.log(img);
        console.log('i=',i,'randomPiece=',randomPiece,fileList[randomPiece]);
      }
      else {
        randomPiece=randomNumList[i];
        newCenterPiece=randomNumList[0];
        console.log('i=',i,'randomPiece=',randomPiece,fileList[randomPiece]);
      }

      if (i==0){
        img=scoreList[randomPiece];
        selectedFile=fileList[randomPiece]
        console.log('new center piece=',newCenterPiece,selectedFile);
      }
      setParameters(randomPiece);
      if (i==0){
        x=width/2;
        y=height/2;

        drawViz(randomPiece, x, y, outerHeightBig, innerHeightBig, lineWeight, textHeight, colorPalette,strings,voice,percussion,woodwinds,keys,6);
       // pop();
        push();
        textSize(textHeight);
        textAlign(CENTER,CENTER);
        rectMode(CENTER);
        fill(0);
        text(composer, x-width/2, y-height/4, width/6, windowHeight/2);
        textStyle(ITALIC);
        text(title, x-width/2, y-height/8, width/7 , windowHeight/2);
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
        drawViz(randomPiece, x, y, outerHeightSmall, innerHeightSmall, lineWeight, textHeight, colorPalette,strings,voice,percussion,woodwinds,keys,4);
      }
    }
    playButton = createButton('Listen');
    playButton.position(3*width/4, height/2+height/8);
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
      drawViz(randomPiece, x, y, width/5, width/10, lineWeight, textHeight, colorPalette,strings,voice,percussion,woodwinds,keys,4);
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
  id=idList[randomPiece];
  strings=stringsList[randomPiece];
  voice=voiceList[randomPiece];
  percussion=percussionList[randomPiece];
  woodwinds=woodwindsList[randomPiece];
  keys=keysList[randomPiece];
}

function randomSort(){
  nPieces=60;
  randomNumList=[];
  for (let i=0; i<nPieces-1; i++){
    randomNumList.push(i);
  }
  //console.log('randomNumList length=',randomNumList.length);
  randomNumList.sort(() => Math.random()-0.5);
}


function pieceData (featureData) {
  for (let i=0; i<59; i++){
    keyTypesList.push(featureData[i].keyTypes);
    tempoList.push(featureData[i].tempo);
    timeSigNumList.push(featureData[i].timeSig[0]);
    composerList.push(featureData[i].composer);
    titleList.push(featureData[i].title);
    nLinesList.push(floor(featureData[i].noteDensity));
    idList.push(featureData[i].spotifyID);
    keysList.push(featureData[i].keys);
    voiceList.push(featureData[i].voice);
    woodwindsList.push(featureData[i].woodwinds);
    stringsList.push(featureData[i].strings);
    percussionList.push(featureData[i].percussion);
    fileList.push(featureData[i].filename);
  }
}

function drawViz(randomPiece,midX,midY,outerHeight,innerHeight, lineWeight,textHeight,colorPalette,strings,voice,percussion,woodwinds,keys,shapeSize){

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
  lineSpacing=outerHeight/nLines;
  //line spacing determined by noteDensity
  stroke(colorPalette[0]);

  for (i=1; i<=nLines; i++){
    h=i*lineSpacing;
    fill(colorPalette[0]);
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
  if (frameCount<=3){
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
  text('Currently selected piece is in the center. Select a smaller icon to change the current selection.',width/2,20,3*width/4,textHeight*3);
}

function showScore(){
  background(255);
  viewButton.remove();
  helpButton.remove();
  playButton.remove();

  img.resize(img.width/img.height*height,height);
  image(img,0,0);
  saveButton = createButton('Save');
  saveButton.position(width/20,height/20);
  saveButton.mousePressed(saveScore);
  closeButton = createButton('Close');
  closeButton.position(width/6,height/20);
  closeButton.mousePressed(closeScore);
}

function saveScore(){
  //img.save('score','png');
  img.save(selectedFile,'png');
}

function closeScore(){
  //redraw();
  saveButton.remove();
  closeButton.remove();
  randomize=0;
  redraw();
}
