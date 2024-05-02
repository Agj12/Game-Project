var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;
var redCollectables;

var game_score;
var lives;
var flagpole;
var platforms;
var enemies;

var jumpSound;
var drinkSound;
var fallingSound;

function preload()
{
    soundFormats('mp3','wav');
    // Sound when jumping
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.025);
    // Sound when collecting potion
    drinkSound = loadSound('assets/drink.mp3');
    drinkSound.setVolume(2);
    // Sound when falling in Canyon
    fallingSound = loadSound('assets/falling.mp3');
    fallingSound.setVolume(0.05);
}

function setup()
{
	createCanvas(1024, 576);
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 4;
    startGame();
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects    
    clouds = 
    [
        {x: -650, y: 60, size: 5}, 
        {x: -200, y: 50, size: 5}, 
        {x: 150, y: 50, size: 5},
        {x: 280, y: 90, size: 5}, 
        {x: 410, y: 50, size: 10}, 
        {x: 840, y: 40, size: 10}, 
        {x: 1300, y: 50, size: 10},
        {x: 1700, y: 50, size: 10},
        {x: 1900, y: 80, size: 10},
        {x: 1900, y: 80, size: 10},
        {x: 2300, y: 80, size: 10},
        //Collection of clouds
        {x: 2900, y: 110, size: 10},
        {x: 3000, y: 110, size: 10},
        {x: 3300, y: 100, size: 10},
        //Collection of clouds
        {x: 3600, y: 80, size: 10},
        {x: 3650, y: 60, size: 10},
        {x: 3700, y: 100, size: 10},
        //Collection of clouds
        {x: 4100, y: 60, size: 10},
        {x: 4150, y: 100, size: 10},
        {x: 4200, y: 80, size: 10},
    ]
    
    mountains = 
    [
        {x: -250, y: 200},
        {x: 650, y: 200},
        {x: 1270, y: 200},
        {x: 2800, y: 200},
        {x: 2650, y: 200},
        {x: 4150, y: 200},
    ]
    
    trees_x = [-400, 500, 820, 2000, 2730, 2755];
    
    canyons = 
    [
        // Canyons to prevent travel to the left
        {x: -1040, width: 5},
        {x: -870, width: 5},
        {x: -700, width: 5},
        {x: -530, width: 5},
        {x: 100, width: 5},
        // Canyons for bridge
        {x: 1000, width: 5},
        {x: 1170, width: 5},
        {x: 1340, width: 5},
        {x: 1510, width: 5},
        {x: 1680, width: 5},
        {x: 1850, width: 5},
        // Canyons
        {x: 2120, width: 5},
        {x: 2320, width: 5},
        
        {x: 3200, width: 5},
        {x: 3450, width: 5},
        {x: 3700, width: 5},
        
    ]
    
    collectables = 
    [
        {x: -400, y: 400, size: 2},
        {x: 250, y: 400, size: 2}, 
        {x: 1100, y: 340, size: 2}, 
        {x: 1750, y: 340, size: 2}, 
        // Collectable on the platform to points
        {x: 2060, y: 130, size: 2},
        {x: 2060, y: 260, size: 2},
        {x: 2200, y: 330, size: 2},
        {x: 2200, y: 200, size: 2},
        {x: 2200, y: 60, size: 2},
        // Group of collectables
        {x: 2730, y: 400, size: 2},
        {x: 2775, y: 400, size: 2},
        {x: 2820, y: 400, size: 2},
        {x: 2775, y: 360, size: 2},
        {x: 2775, y: 360, size: 2},
        {x: 2775, y: 360, size: 2},
    ]
    
    redCollectables =
    [
        {x: -250, y: 137, size: 2},
    ]
    // Sets the game score to 0
    game_score = 0;
    
    flagpole = 
    {
        x_pos: 4500, isReached: false, height: 300
    }
    // Takes away everytime the game is run
    lives -= 1;
    
    platforms = []; 
    // Platforms to health Potion
    platforms.push(createPlatform(-300, floorPos_y - 270, 100));
    platforms.push(createPlatform(-200, floorPos_y - 200, 100));
    platforms.push(createPlatform(-75, floorPos_y - 140, 100));
    platforms.push(createPlatform(60, floorPos_y - 70, 100));
    // Bridge
    platforms.push(createPlatform(870, floorPos_y - 60, 250));
    platforms.push(createPlatform(1250, floorPos_y - 60, 300));
    platforms.push(createPlatform(1700, floorPos_y - 60, 100));
    // Platform to points
    platforms.push(createPlatform(2150, floorPos_y - 340, 100));
    platforms.push(createPlatform(2010, floorPos_y - 270, 100));
    platforms.push(createPlatform(2150, floorPos_y - 200, 100));
    platforms.push(createPlatform(2010, floorPos_y - 140, 100));
    platforms.push(createPlatform(2150, floorPos_y - 70, 100));
    
    enemies = [];
    
    enemies.push(new Enemy(-350, floorPos_y, 300));
    enemies.push(new Enemy(300, floorPos_y, 100));
    enemies.push(new Enemy(1400, floorPos_y - 60, 40));
    enemies.push(new Enemy(2575, floorPos_y, 400));
    enemies.push(new Enemy(3900, floorPos_y, 60));
    enemies.push(new Enemy(4150, floorPos_y, 150));
}

function draw()
{
	background(0, 0, 120); // fill the sky midnight blue
    noStroke();
    fill(51, 22, 95, 250);
    rect(0, 0, width, 100); // purple sky
    fill(51, 22, 95, 200);
    rect(0, 80, width, 80); // purple sky
    fill(51, 22, 95, 150);
    rect(0, 160, width, 80); // purple sky
    fill(51, 22, 95, 100);
    rect(0, 240, width, 80); // purple sky
    
	fill(58, 95, 11);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos, 0); // Scrolling effect
    drawClouds();
    drawMountains();
    drawTrees();
    
    // Draw canyons
    for(var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
	// Draw collectables
    for(var j = 0; j < collectables.length; j++)
    {   
        if(!collectables[j].isFound)
        {
            drawCollectable(collectables[j]);
            checkCollectable(collectables[j]);
        }
    }
    
    // Draw Red collectables
    for(var j = 0; j < redCollectables.length; j++)
    {   
        if(!redCollectables[j].isFound)
        {
            drawRedCollectable(redCollectables[j]);
            checkRedCollectable(redCollectables[j]);
        }
    }
    
    // Draw Flag
    renderFlagpole(flagpole);
    // Check Character is in range
    if(!checkFlagpole.isReached)
    {
        checkFlagpole(flagpole);
    }
    
    // Draw Platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    // Draw Enemy
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].isContact(gameChar_world_x, gameChar_y))
        {
            startGame();
            break;
        }
    }
    pop();
    
	drawGameChar();
    
    strokeWeight(3);
    stroke(0);
    textSize(18);
    fill(51, 153, 255);
    text("score: " + game_score, 20, 40); // Score text
    fill(255, 0, 0);
    text("lives: " + lives, 20, 60); // Lives text
    
    // If all lives are gone display text
    if(lives < 1)
    {
        fill(255);
        text("Game over - Press space to continue", width/2 - 100, height/2);
        return;
    }
    // If the flag isReached then display text
    else if(flagpole.isReached)
    {
        fill(255);
        text("Level completed with " + game_score + "/1500 score - press space to continue", width/2 - 100, height/2)       
        return;
    }
    if(gameChar_y > height)
    {
       if(lives > 0) 
       {
           startGame();
           fallingSound.play(); // The falling sound plays
       }
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}
	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
    
	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        var isContact = false; // Local var for platform
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                break; // Stop the loop if character makes contact
            }
        }
        if(isContact == false)
        {
            gameChar_y += 2.65; // How fast the character falls
            isFalling = true;
        }
        else
        {
            isFalling = false;
        }
    }
    else
    {
        isFalling = false;
    }
    
    if(isPlummeting)
    {
        gameChar_y += 4.5; // How fast the character plummets
    }

    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;
}

// ---------------------
// Key control functions
// ---------------------
function keyPressed()
{   
    // if statements to control the animation of the character
    if(keyCode == 65) // A key
    {
        isLeft = true;
    }

    if(keyCode == 68) // D key
    {
        isRight = true;
    }

    if(keyCode == 87) // W key
    {
        if(!isFalling && !isPlummeting)
        {
            gameChar_y -= 100; //Jumping distance
            jumpSound.play();
        }
    }
}

function keyReleased()
{
    // if statements to control the animation of the character
    if(keyCode == 65) // A key
    {
        isLeft = false;
    }

    if(keyCode == 68) // D key
    {
        isRight = false;
    }
}

// ------------------------------
// Game character render function
// ------------------------------
// Function to draw the game character.
function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{   
        // Jumping-left code
        //// HEAD ////
        fill(0);
        ellipse(gameChar_x - 5, 
                gameChar_y - 38,
                23, 
                20);

        //// HEAD KNOT ////
        fill(0);
        rect(gameChar_x + 4,
             gameChar_y - 41, 
             6, 
             4, 
             1.5);

        rect(gameChar_x + 9,
             gameChar_y - 42, 
             6, 
             2.5, 
             1.5);

        rect(gameChar_x + 8,
             gameChar_y - 38.5, 
             6, 
             2.5, 
             1.5);    

        //// FACE ////
        fill(255, 224, 189);
        ellipse(gameChar_x - 10, 
                gameChar_y -39, 
                14,
                8);

        //// EYES ////
        fill(0);
        ellipse(gameChar_x - 8.5, 
                gameChar_y - 39,
                3,
                3);

        //// EYE GLARE //// 
        fill(255, 255, 255);
        ellipse(gameChar_x - 8,
                gameChar_y -40,
                1,
                1);

        //// BODY ////
        fill(0);
        rect(gameChar_x - 7, 
             gameChar_y - 31,
             14, 
             19, 
             1.5);

        //// LEFT LEG ////
        fill(0);
        rect(gameChar_x - 7,
             gameChar_y - 18, 
             5, 
             13,
             1.5);

        //// LOWER LEFT LEG ////
        quad(gameChar_x - 6.5, gameChar_y - 6.5,
             gameChar_x - 1.9, gameChar_y - 8,
             gameChar_x + 1, gameChar_y - 3,
             gameChar_x - 4, gameChar_y - 3);

        //// RIGHT LEG ////
        fill(0);
        rect(gameChar_x + 2,
             gameChar_y - 18, 
             5, 
             13,
             1.5);

         //// LOWER RIGHT LEG ////
         quad(gameChar_x + 2.5, gameChar_y - 6.5,
              gameChar_x + 6.9, gameChar_y - 10,
              gameChar_x + 11, gameChar_y + 1,
              gameChar_x + 6, gameChar_y + 1);

        //// BELT ////
        fill(255, 0, 0);
        rect(gameChar_x - 7, 
             gameChar_y - 18, 
             14,
             3);

        //// ARM ////
        fill(0);
        stroke(255, 255, 255);
        strokeWeight(0.2);
        quad(gameChar_x, gameChar_y - 24,
             gameChar_x, gameChar_y - 28,
             gameChar_x + 13, gameChar_y - 15,
             gameChar_x + 13, gameChar_y - 11);
        noStroke();
        strokeWeight(1);
	}
    
	else if(isRight && isFalling)
	{
        // Jumping-right code  
        //// HEAD ////
        fill(0);
        ellipse(gameChar_x + 5, 
                gameChar_y - 38,
                23, 
                20);

        //// HEAD KNOT ////
        fill(0);
        rect(gameChar_x - 10,
             gameChar_y - 41, 
             6, 
             4,
             1.5);

        rect(gameChar_x - 15,
             gameChar_y - 42, 
             6, 
             2.5,
             1.5);

        rect(gameChar_x - 14,
             gameChar_y - 38.5, 
             6, 
             2.5,
             1.5);    

        //// FACE ////
        fill(255, 224, 189);
        ellipse(gameChar_x + 10, 
                gameChar_y -39, 
                14, 
                8);

        //// EYES ////
        fill(0);
        ellipse(gameChar_x + 8.5, 
                gameChar_y - 39,
                3, 
                3);

        //// EYE GLARE //// 
        fill(255, 255, 255);
        ellipse(gameChar_x + 8,
                gameChar_y -40,
                1,
                1);

        //// BODY ////
        fill(0);
        rect(gameChar_x - 7, 
             gameChar_y - 31,
             14, 
             19, 
             1.5);

        //// LEFT LEG ////
        fill(0);
        rect(gameChar_x - 7,
             gameChar_y - 18, 
             5, 
             13,
             1.5);

        //// LOWER LEFT LEG ////
        quad(gameChar_x - 7, gameChar_y - 8.5,
             gameChar_x - 2, gameChar_y - 8,
             gameChar_x - 5, gameChar_y + 1,
             gameChar_x - 10, gameChar_y + 1);


        //// RIGHT LEG ////
        fill(0);
        rect(gameChar_x + 2,
             gameChar_y - 18, 
             5, 
             13,
             1.5);

        //// LOWER RIGHT LEG ////
        quad(gameChar_x + 2, gameChar_y - 8.5,
             gameChar_x + 6.9, gameChar_y - 6.5,
             gameChar_x + 4, gameChar_y - 3,
             gameChar_x - 1, gameChar_y - 3);

        //// BELT ////
        fill(255, 0, 0);
        rect(gameChar_x - 7, 
             gameChar_y - 18, 
             14,
             3);

        //// ARM ////
        fill(0);
        stroke(255, 255, 255);
        strokeWeight(0.2);
        quad(gameChar_x, gameChar_y - 24,
             gameChar_x, gameChar_y - 28,
             gameChar_x - 13, gameChar_y - 15,
             gameChar_x - 13, gameChar_y - 11);
        noStroke();
        strokeWeight(1);
    }
    
	else if(isLeft)
	{   
        // Walking left code
        //// HEAD ////
        fill(0);
        ellipse(gameChar_x - 5, 
                gameChar_y - 38,
                23, 
                20);

        //// HEAD KNOT ////
        fill(0);
        rect(gameChar_x + 4,
             gameChar_y - 41, 
             6, 
             4,
             1.5);

        rect(gameChar_x + 9,
             gameChar_y - 42, 
             6, 
             2.5,
             1.5);

        rect(gameChar_x + 8,
             gameChar_y - 38.5, 
             6, 
             2.5,
             1.5);    

        //// FACE ////
        fill(255, 224, 189);
        ellipse(gameChar_x - 10, 
                gameChar_y -39, 
                14, 
                8);

        //// EYES ////
        fill(0);
        ellipse(gameChar_x - 8.5, 
                gameChar_y - 39,
                3, 
                3);

        //// EYE GLARE //// 
        fill(255, 255, 255);
        ellipse(gameChar_x - 8,
                gameChar_y -40,
                1,
                1);

        //// BODY ////
        fill(0);
        rect(gameChar_x - 7, 
             gameChar_y - 31,
             14, 
             19, 
             1.5);

        //// ARM ////
        fill(0);
        stroke(255, 255, 255);
        strokeWeight(0.2);
        quad(gameChar_x, gameChar_y - 24,
             gameChar_x, gameChar_y - 28,
             gameChar_x + 17, gameChar_y - 24,
             gameChar_x + 17, gameChar_y - 20);
        noStroke();
        strokeWeight(1);

        //// LEFT LEG ////
        fill(0);
        rect(gameChar_x - 7,
             gameChar_y - 18, 
             5, 
             13,
             1.5);

        //// LOWER LEFT LEG ////
        quad(gameChar_x - 6.5, gameChar_y - 6.5,
             gameChar_x - 1.9, gameChar_y - 8,
             gameChar_x + 1, gameChar_y + 1,
             gameChar_x - 4, gameChar_y + 1);

        //// RIGHT LEG ////
        fill(0);
        rect(gameChar_x + 2,
             gameChar_y - 18, 
             5, 
             13,
             1.5);

        //// LOWER RIGHT LEG ////
        quad(gameChar_x + 2.5, gameChar_y - 6.5,
             gameChar_x + 6.9, gameChar_y - 10,
             gameChar_x + 11, gameChar_y + 1,
             gameChar_x + 6, gameChar_y + 1);

        //// BELT ////
        fill(255, 0, 0);
        rect(gameChar_x - 7, 
             gameChar_y - 18, 
             14,
             3);
	}
    
	else if(isRight)
	{
        // Walking right code
        //// HEAD ////
        fill(0);
        ellipse(gameChar_x + 5, 
                gameChar_y - 38,
                23, 
                20);

        //// HEAD KNOT ////
        fill(0);
        rect(gameChar_x - 10,
             gameChar_y - 41, 
             6, 
             4,
             1.5);

        rect(gameChar_x - 15,
             gameChar_y - 42, 
             6, 
             2.5,
             1.5);

        rect(gameChar_x - 14,
             gameChar_y - 38.5, 
             6, 
             2.5,
             1.5);    

        //// FACE ////
        fill(255, 224, 189);
        ellipse(gameChar_x + 10, 
                gameChar_y -39, 
                14, 
                8);

        //// EYES ////
        fill(0);
        ellipse(gameChar_x + 8.5, 
                gameChar_y - 39,
                3, 
                3);

        //// EYE GLARE //// 
        fill(255, 255, 255);
        ellipse(gameChar_x + 8,
                gameChar_y -40,
                1,
                1);

        //// BODY ////
        fill(0);
        rect(gameChar_x - 7, 
             gameChar_y - 31,
             14, 
             19, 
             1.5);

        //// ARM ////
        fill(0);
        stroke(255, 255, 255);
        strokeWeight(0.2);
        quad(gameChar_x, gameChar_y - 24,
             gameChar_x, gameChar_y - 28,
             gameChar_x - 17, gameChar_y - 24,
             gameChar_x - 17, gameChar_y - 20);
        noStroke();
        strokeWeight(1);

        //// LEFT LEG ////
        fill(0);
        rect(gameChar_x - 7,
             gameChar_y - 18, 
             5, 
             13,
             1.5);

        //// LOWER LEFT LEG ////
        quad(gameChar_x - 7, gameChar_y - 8.5,
             gameChar_x - 2, gameChar_y - 8,
             gameChar_x - 5, gameChar_y + 1,
             gameChar_x - 10, gameChar_y + 1);


        //// RIGHT LEG ////
        fill(0);
        rect(gameChar_x + 2,
             gameChar_y - 18, 
             5, 
             13,
             1.5);

        //// LOWER RIGHT LEG ////
        quad(gameChar_x + 2, gameChar_y - 8.5,
             gameChar_x + 6.9, gameChar_y - 6.5,
             gameChar_x + 4, gameChar_y + 1,
             gameChar_x - 1, gameChar_y + 1);

        //// BELT ////
        fill(255, 0, 0);
        rect(gameChar_x - 7, 
             gameChar_y - 18, 
             14,
             3);
	}
    
	else if(isFalling || isPlummeting)
	{
        // Jumping facing forwards code
        //// HEAD ////
        fill(0);
        ellipse(gameChar_x , 
                gameChar_y - 40,
                23, 
                20);

        //// FACE ////
        fill(255, 224, 189);
        ellipse(gameChar_x, 
                gameChar_y - 41, 
                17, 
                8);

        fill(0);
        ellipse(gameChar_x, 
                gameChar_y - 36.5, 
                8, 
                3);

        //// EYES ////
        fill(0);
        ellipse(gameChar_x - 3.5, 
                gameChar_y - 41,
                3, 
                3);

        fill(0);
        ellipse(gameChar_x + 3.5, 
                gameChar_y - 41,
                3, 
                3);

        //// EYE GLARE ////
        fill(255, 255, 255);
        ellipse(gameChar_x + 4,
                gameChar_y - 42,
                1,
                1);

        fill(255, 255, 255);
        ellipse(gameChar_x - 3,
                gameChar_y - 42,
                1,
                1);

        //// BODY ////
        fill(0);
        rect(gameChar_x - 7, 
             gameChar_y - 31,
             14, 
             19, 
             1.5);

        //// LEFT ARM ////
        fill(0);
        stroke(255, 255, 255);
        strokeWeight(0.2);
        quad(gameChar_x - 5, gameChar_y - 31,
             gameChar_x - 9, gameChar_y - 31,
             gameChar_x - 15, gameChar_y - 17,
             gameChar_x - 11, gameChar_y - 17);

        //// RIGHT ARM ////    
        quad(gameChar_x + 5, gameChar_y - 31,
             gameChar_x + 9, gameChar_y - 31,
             gameChar_x + 15, gameChar_y - 17,
             gameChar_x + 11, gameChar_y - 17);
        noStroke();
        strokeWeight(1);

        //// LEFT LEG ////
        quad(gameChar_x - 5, gameChar_y - 18, 
             gameChar_x + 3, gameChar_y - 18, 
             gameChar_x - 10, gameChar_y,
             gameChar_x - 16, gameChar_y);

        //// RIGHT LEG ////
        quad(gameChar_x + 5, gameChar_y - 18, 
             gameChar_x - 3, gameChar_y - 18, 
             gameChar_x + 10, gameChar_y,
             gameChar_x + 16, gameChar_y);

        //// BELT ////
        fill(255, 0, 0);
        rect(gameChar_x - 7, 
             gameChar_y - 18, 
             14,
             3);
	}
    
	else
	{
        // Standing front facing code 
        //// HEAD ////
        fill(0);
        ellipse(gameChar_x,
                gameChar_y - 40, 
                23,
                20); 

        //// FACE ////
        fill(255, 224, 189);
        ellipse(gameChar_x, 
                gameChar_y -41, 
                17, 
                8);

        fill(0);
        ellipse(gameChar_x, 
                gameChar_y - 36.5, 
                8, 
                3);

        //// EYES ////
        fill(0);
        ellipse(gameChar_x - 3.5, 
                gameChar_y - 41,
                3, 
                3);

        fill(0);
        ellipse(gameChar_x + 3.5, 
                gameChar_y - 41,
                3, 
                3);

        //// EYE GLARE ////
        fill(255, 255, 255);
        ellipse(gameChar_x + 4,
                gameChar_y -42,
                1,
                1);

        fill(255, 255, 255);
        ellipse(gameChar_x - 3,
                gameChar_y -42,
                1,
                1);

        //// BODY ////
        fill(0);
        rect(gameChar_x - 7, 
             gameChar_y - 31,
             14, 
             19, 
             1.5);

        //// LEFT ARM ////
        fill(0);
        stroke(255, 255, 255);
        strokeWeight(0.2);
        quad(gameChar_x - 5, gameChar_y - 31,
             gameChar_x - 9, gameChar_y - 31,
             gameChar_x - 12, gameChar_y - 17,
             gameChar_x - 8, gameChar_y - 17);

        //// RIGHT ARM ////    
        quad(gameChar_x + 5, gameChar_y - 31,
             gameChar_x + 9, gameChar_y - 31,
             gameChar_x + 12, gameChar_y - 17,
             gameChar_x + 8, gameChar_y - 17);
        noStroke();
        strokeWeight(1);
        
        //// LEFT LEG ////
        fill(0);
        rect(gameChar_x - 7,
             gameChar_y - 18, 
             5, 
             21,
             1.5);

        //// RIGHT LEG ////
        fill(0);
        rect(gameChar_x + 2,
             gameChar_y - 18, 
             5, 
             21,
             1.5);

        //// BELT ////
        fill(255, 0, 0);
        rect(gameChar_x - 7, 
             gameChar_y - 18, 
             14,
             3);
	}
}       

// ---------------------------
// Background render functions
// ---------------------------
// Function to draw cloud objects.
function drawClouds()
{
    for(var c = 0; c < clouds.length; c++)
    {  
        // CLOUD
        // Highest point of the cloud 
        fill(255,255,255);
        ellipse(clouds[c].x, clouds[c].y -3,
                50 + clouds[c].size, 50 + clouds[c].size);
        // from the left around 
        ellipse(clouds[c].x - 35, clouds[c].y,
                40 + clouds[c].size, 40 + clouds[c].size);
        
        ellipse(clouds[c].x - 55, clouds[c].y + 24, 
                50 + clouds[c].size, 50 + clouds[c].size);

        ellipse(clouds[c].x - 35, clouds[c].y + 45,
                40 + clouds[c].size, 40 + clouds[c].size);

        ellipse(clouds[c].x - 10, clouds[c].y + 40, 
                40 + clouds[c].size, 40 + clouds[c].size);

        ellipse(clouds[c].x + 15, clouds[c].y + 25,
                50 + clouds[c].size, 50 + clouds[c].size);
        //the centre, gap fill
        ellipse(clouds[c].x - 15, clouds[c].y + 15, 
                50 + clouds[c].size, 50 + clouds[c].size);
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var m = 0; m < mountains.length; m++)
    {
        // MOUNTAIN
        fill(102,102,102);
        triangle(mountains[m].x, mountains[m].y - 40,
                 mountains[m].x - 125, mountains[m].y + 232, 
                 mountains[m].x + 125, mountains[m].y + 232);
        // Details in the mountain
        fill(255, 255, 255);
        triangle(mountains[m].x, mountains[m].y - 40, 
                 mountains[m].x - 36, mountains[m].y + 39, 
                 mountains[m].x + 32, mountains[m].y + 30);
        fill(102,102,102);
        triangle(mountains[m].x - 10, mountains[m].y + 26,
                 mountains[m].x - 37, mountains[m].y + 40, 
                 mountains[m].x + 10, mountains[m].y + 35);
        fill(0, 0, 120);
        triangle(mountains[m].x - 65, mountains[m].y + 125,
                 mountains[m].x - 50, mountains[m].y + 65, 
                 mountains[m].x - 110, mountains[m].y + 190);
        
        triangle(mountains[m].x - 112, mountains[m].y + 215,
                 mountains[m].x - 106, mountains[m].y + 190,
                 mountains[m].x - 125, mountains[m].y + 230);
        
        triangle(mountains[m].x + 49, mountains[m].y + 75,
                 mountains[m].x + 33, mountains[m].y + 30, 
                 mountains[m].x + 60, mountains[m].y + 90);

        triangle(mountains[m].x + 83, mountains[m].y + 160, 
                 mountains[m].x + 65, mountains[m].y + 100, 
                 mountains[m].x + 112, mountains[m].y + 200);

        triangle(mountains[m].x + 114, mountains[m].y + 220, 
                 mountains[m].x + 107, mountains[m].y + 190, 
                 mountains[m].x + 125, mountains[m].y + 230);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        // TREE
        // Trunk
        fill(83,53,10);
        rect(trees_x[i] - 25, 
             floorPos_y - 100,
             45, 100);
        //Leaves (left to right)
        fill(58, 95, 11);
        ellipse(trees_x[i], floorPos_y - 107, 
                70, 50);
        ellipse(trees_x[i] - 50, floorPos_y - 102,
                70, 50);
        ellipse(trees_x[i] - 40, floorPos_y - 132, 
                70, 50);
        ellipse(trees_x[i] - 20, floorPos_y - 152,
                70, 50);
        ellipse(trees_x[i] + 10, floorPos_y - 152, 
                70, 50);
        ellipse(trees_x[i] + 30, floorPos_y - 132, 
                70, 50);
        ellipse(trees_x[i] + 40, floorPos_y - 102,
                70, 50);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------
// Function to draw canyon objects.
function drawCanyon(t_canyons)
{
    // CANYON
    fill(102,102,102);
    quad(t_canyons.x + 80 + t_canyons.width, floorPos_y + 318, 
         t_canyons.x - 80 - t_canyons.width, floorPos_y + 318, 
         t_canyons.x - 80 - t_canyons.width, floorPos_y,
         t_canyons.x + 80 + t_canyons.width, floorPos_y);
    // Lava
    fill(207, 16, 32);
    quad(t_canyons.x + 80 + t_canyons.width, floorPos_y + 318,
         t_canyons.x - 80 - t_canyons.width, floorPos_y + 318,
         t_canyons.x - 80 - t_canyons.width, floorPos_y + 47, 
         t_canyons.x + 80 + t_canyons.width, floorPos_y + 47);
    // Lava bubbles
    fill(207, 16, 32);
    ellipse(t_canyons.x - 50, floorPos_y + 50, 
            60 + t_canyons.width, 25);
    ellipse(t_canyons.x, floorPos_y + 50, 
            60 + t_canyons.width, 20);
    ellipse(t_canyons.x + 50, floorPos_y + 50,
            60 + t_canyons.width, 25);
}

// Function to check character is over a canyon.
function checkCanyon(t_canyons)
{
    // If statement to detect canyon
    if(gameChar_world_x < t_canyons.x + 80 && gameChar_world_x > t_canyons.x - 80 && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
// Function to draw collectable objects.
function drawCollectable(t_collectables)
{
    // POTION
    stroke(0,0,0);
    strokeWeight(0.7);
    fill(0, 57, 230);
    ellipse(t_collectables.x, t_collectables.y + 15,
            20 + t_collectables.size, 20 + t_collectables.size);
    noStroke();
    
    // Top of the potion 
    fill(255);
    triangle(t_collectables.x, 
             t_collectables.y - t_collectables.size, 
             t_collectables.x - 9 - t_collectables.size, 
             t_collectables.y + 10 + t_collectables.size,
             t_collectables.x + 9 + t_collectables.size, 
             t_collectables.y + 10 + t_collectables.size);
    // Bottom of potion
    stroke(0,0,0);
    strokeWeight(1);
    fill(204, 102, 0);
    ellipse(t_collectables.x, t_collectables.y - 3, 
            10 + t_collectables.size, 4 + t_collectables.size);
    noStroke();
    fill(255);
    rect(t_collectables.x - 3, t_collectables.y - 3,
         6 , 8 );
    fill(204, 102, 0);
    ellipse(t_collectables.x, t_collectables.y - 3,
            10 + t_collectables.size, 4 + t_collectables.size); 
}

// Function to check character has collected an item.
function checkCollectable(t_collectables)
{
    // detect potion
    var d = dist(gameChar_world_x, gameChar_y, t_collectables.x, t_collectables.y);
    
    if(d <= 38)
    {
        t_collectables.isFound = true;
        game_score += 100; // Increment game score
        drinkSound.play(); // Plays drinking sound
    }
}

// Create Flag
function renderFlagpole(t_flagpole)
{
    push();
    strokeWeight(10);
    stroke(180);
    line(t_flagpole.x_pos, floorPos_y, t_flagpole.x_pos, floorPos_y - flagpole.height);
    pop();
    
    if(t_flagpole.isReached)
    {
        fill(139, 0, 0);
        rect(t_flagpole.x_pos, floorPos_y - flagpole.height, 120, 80);
    }
}

// Check if character reaches the flag
function checkFlagpole(t_flagpole)
{
    if(dist(gameChar_world_x, 0, flagpole.x_pos, 0) < 20)
    {
        t_flagpole.isReached = true;
    }
}

// Create platform
function createPlatform(x, y, length)
{
    var p =
    {
        x: x,
        y: y, 
        length: length,
        draw: function() // Draw platform
        {
            fill(255,223,0);
            stroke(0);
            rect(this.x, this.y, this.length, 20);
        },
        // Checks for collision with the character
        checkContact: function(gc_x, gc_y,)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y
                if(d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    // Draw Ememy
    this.draw = function()
    {
        noStroke();
        fill(0, 255, 0);
        ellipse(this.current_x, this.y - 25, 50);
        fill(255);
        ellipse(this.current_x, this.y - 30, 25);
        stroke(255, 0, 0);
        strokeWeight(3);
        line(this.current_x - 0.5, this.y - 25,
             this.current_x - 0.5, this.y - 35);
    }
    
    // Move enemy
    this.update = function()
    {
        this.current_x += this.incr;
        
        if(this.current_x < this.x)
        {
            this.incr = 1;
        }
        else if(this.current_x > this.x + this.range)
        {
            this.incr = -1;
        }
    }
    
    // If contact is made return true
    this.isContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.current_x, this.y)
        if(d < 35)
        {
            return true;
        }
        return false;
    }
}

function drawRedCollectable(t_collectables)
{
    // POTION
    stroke(0,0,0);
    strokeWeight(0.7);
    fill(255, 0, 0);
    ellipse(t_collectables.x, t_collectables.y + 15,
            20 + t_collectables.size, 20 + t_collectables.size);
    noStroke();
    
    // Top of the potion 
    fill(255);
    triangle(t_collectables.x, 
             t_collectables.y - t_collectables.size, 
             t_collectables.x - 9 - t_collectables.size, 
             t_collectables.y + 10 + t_collectables.size,
             t_collectables.x + 9 + t_collectables.size, 
             t_collectables.y + 10 + t_collectables.size);
    // Bottom of potion
    stroke(0,0,0);
    strokeWeight(1);
    fill(204, 102, 0);
    ellipse(t_collectables.x, t_collectables.y - 3, 
            10 + t_collectables.size, 4 + t_collectables.size);
    noStroke();
    fill(255);
    rect(t_collectables.x - 3, t_collectables.y - 3,
         6 , 8 );
    fill(204, 102, 0);
    ellipse(t_collectables.x, t_collectables.y - 3,
            10 + t_collectables.size, 4 + t_collectables.size); 
}

// Function to check character has collected an item.
function checkRedCollectable(t_collectables)
{
    // detect potion
    var d = dist(gameChar_world_x, gameChar_y, t_collectables.x, t_collectables.y);
    
    if(d <= 38)
    {
        t_collectables.isFound = true;
        drinkSound.play(); // Plays Drinking sound
        lives += 1; // Increment lives
    }
}
