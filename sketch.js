let numRectangles = 25;
let rectangleWidth;
let rectangleHeight;
let lineRectangles = [];
let drawRectangles = true;
let charaBlocks = [];
let smallCharaBlocks = [];
let boundary = [];
let eventInterval = 40;  // 40 frames interval for events
let timer = 0;  // Timer to track frames for periodic events

let yellow, blue, beige, red;
let randomColors;

function setup() {
  createCanvas(500, 500);
  rectangleWidth = width / numRectangles;
  rectangleHeight = height / numRectangles;

  yellow = color(236, 214, 38);
  blue = color(68, 105, 186);
  beige = color(217, 216, 211);
  red = color(176, 58, 46);
  randomColors = [yellow, blue, beige, red];

  let verticalStartX = [140, 220, 260, 380];
  let horizontalStartY = [60, 260, 400];

  for (let i = 0; i < horizontalStartY.length; i++) {
    let startY = horizontalStartY[i];
    for (let j = 0; j < numRectangles; j++) {
      let x = j * rectangleWidth;
      let y = startY;
      lineRectangles.push(new Rectangle(x, y, rectangleWidth, rectangleHeight, random(randomColors)));
    }
  }

  for (let i = 0; i < verticalStartX.length; i++) {
    let startX = verticalStartX[i];
    for (let j = 0; j < numRectangles; j++) {
      let x = startX;
      let y = j * rectangleHeight;
      lineRectangles.push(new Rectangle(x, y, rectangleWidth, rectangleHeight, random(randomColors)));
    }
  }

  let charaWidth = random(40, 60);
  let charaHeight = random(40, 60);

  // Define boundaries here as needed...
  // Dummy boundaries for demonstration purposes
  boundary.push({ startX: 50, startY: 100, endX: 450, endY: 400 });

  for (let i = 0; i < 6; i++) {
    let randomBoundary = boundary[floor(random() * boundary.length)];
    charaBlocks.push(new Chara(
      random(randomBoundary.startX, randomBoundary.endX),
      random(randomBoundary.startY, randomBoundary.endY),
      charaWidth, charaHeight, random() >= 0.5, random(randomColors)));
  }

  for (let i = 0; i < 10; i++) {
    let randomBoundary = boundary[floor(random() * boundary.length)];
    smallCharaBlocks.push(new SmallChara(
      random(randomBoundary.startX, randomBoundary.endX),
      random(randomBoundary.startY, randomBoundary.endY),
      random(20, 30), random(20, 30), random(randomColors)));
  }
}

function draw() {
  background(255);  // Set background to white
  if (drawRectangles) {
    lineRectangles.forEach(rect => rect.draw());
  }
  charaBlocks.forEach(chara => {
    chara.move();
    chara.checkCollision();
    chara.draw();
  });
  smallCharaBlocks.forEach(smallChara => {
    smallChara.move();
    smallChara.draw();
  });
  stroke(0);

  timer++;
  if (timer >= eventInterval) {
    triggerEvent();
    timer = 0; // Reset timer
  }
}

function triggerEvent() {
  lineRectangles.forEach(rect => {
    rect.color = random(randomColors);
  });
  charaBlocks.forEach(chara => {
    chara.color = random(randomColors);
    chara.toggleState();
  });
  smallCharaBlocks.forEach(smallChara => {
    smallChara.color = random(randomColors);
  });
}

class Rectangle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    noStroke();
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Chara {
  constructor(x, y, baseWidth, baseHeight, state, color) {
    this.x = x;
    this.y = y;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.breathingSpeed = 0.30;
    this.speed = random(2, 5);
    this.direction = 1;
    this.Horizontal = state;
    this.color = color;
  }

  update() {
    let breathSizeOuter = sin(frameCount * this.breathingSpeed) * 5;
    let currentWidth = this.baseWidth + breathSizeOuter;
    let currentHeight = this.baseHeight + breathSizeOuter;
    let breathSizeInner = sin(frameCount * this.breathingSpeed + PI / 2) * 2;
    let innerWidth = this.baseWidth * 0.5 + breathSizeInner;
    let innerHeight = this.baseHeight * 0.5 + breathSizeInner;
    let breathSizeSmallest = sin(frameCount * this.breathingSpeed + PI) * 0.5;
    let smallestWidth = this.baseWidth * 0.25 + breathSizeSmallest;
    let smallestHeight = this.baseHeight * 0.25 + breathSizeSmallest;

    push();
    stroke('#FFFFFF');  
    fill(this.color);
    rectMode(CENTER);
    rect(this.x, this.y, currentWidth, currentHeight);
    fill('#FFD700');
    rect(this.x, this.y, innerWidth, innerHeight);
    fill('#FFFFFF');
    rect(this.x, this.y, smallestWidth, smallestHeight);
    pop();
  }

  draw() {
    this.update();
  }

  move() {
    if (this.Horizontal) {
      this.x += this.speed * this.direction;
    } else {
      this.y += this.speed * this.direction;
    }
  }

  checkCollision() {
    if (this.Horizontal) {
      if (this.x <= 50 || this.x >= 450) {
        this.direction *= -1;
      }
    } else {
      if (this.y <= 100 || this.y >= 400) {
        this.direction *= -1;
      }
    }
  }

  toggleState() {
    this.Horizontal = !this.Horizontal; // Toggle movement direction
  }
}

class SmallChara {
  constructor(x, y, baseWidth, baseHeight, color) {
    this.x = x;
    this.y = y;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.breathingSpeed = 0.20;
    this.color = color;
    this.speedX = random(1, 3) * (random() > 0.5 ? 1 : -1);
    this.speedY = random(1, 3) * (random() > 0.5 ? 1 : -1);
  }

  draw() {
    let breathSize = sin(frameCount * this.breathingSpeed) * 5;
    let currentWidth = this.baseWidth + breathSize;
    let currentHeight = this.baseHeight + breathSize;

    noStroke();
    fill(this.color);
    rect(this.x, this.y, currentWidth, currentHeight);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Check boundaries
    if (this.x <= 0 || this.x >= width - this.baseWidth) {
      this.speedX *= -1;
    }
    if (this.y <= 0 || this.y >= height - this.baseHeight) {
      this.speedY *= -1;
    }
  }
}
