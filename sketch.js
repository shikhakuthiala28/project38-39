/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,1000,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  
  kangaroo = createSprite(50,250,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.2;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(400,180);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  invisiblejungle = createSprite(200,399,400,1);
  invisiblejungle.visible = false;
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();

  kangaroo.setCollider("rectangle",0,0,100,800);
  kangaroo.debug = true
  
  score = 0;

}

function draw() {
  background(255);
 
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    jungle.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);

    if (jungle.x < 50){
      jungle.x = 700
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& kangaroo.y >= 200) {
        kangaroo.velocityY = -20;
        jumpSound.play();
    }
    
    //add gravity
    kangaroo.velocityY = kangaroo.velocityY + 0.8;

    spawnObstacles();

    spawnShrubs();

    if(obstaclesGroup.isTouching(kangaroo)){
      gameState = END;
      collidedSound.play()
    
  }

  if(shrubsGroup.isTouching(kangaroo)){
    shrubsGroup.destroyEach();
  
}
  }

  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
   
   //change the trex animation
    kangaroo.changeAnimation("collided", kangaroo_collided);
    jungle.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     shrubsGroup.setVelocityXEach(0);   
  }

  kangaroo.collide(invisiblejungle);
    
  if(mousePressedOver(restart)) {
    restart.visible=false;
    gameOver.visible=false;
    gameState=PLAY;
    obstaclesGroup.destroyEach();
    shrubsGroup.destroyEach();
    kangaroo.changeAnimation("running", kangaroo_running);
    
    }

  drawSprites();

  fill("red");
  textSize(18)
  text("Score: "+ score, 700,50);
  

}

function spawnObstacles(){
  if (frameCount % 150 === 0){
    var obstacle = createSprite(800,350,10,40);
    obstacle.velocityX = -(6 + score/100);
    obstacle.addImage(obstacle1);   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.15;
    obstacle.lifetime = 300;
    
    //add each obstacle to the group
     obstaclesGroup.add(obstacle);
  }
 }

 function spawnShrubs(){
  if (frameCount % 185 === 0){
    var shrub = createSprite(800,320,10,40);
    shrub.velocityX = -(6 + score/100);
    
     //generate random obstacles
     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: shrub.addImage(shrub1);
               break;
       case 2: shrub.addImage(shrub2);
               break;
       case 3: shrub.addImage(shrub3);
               break;
       default: break;
     }
    
     //assign scale and lifetime to the obstacle           
     shrub.scale = 0.1;
     shrub.lifetime = 300;
    
    //add each obstacle to the group
     shrubsGroup.add(shrub);
  }
 }
