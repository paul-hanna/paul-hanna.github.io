let capture;
let catShader;
let cameraStarted = false; // Flag to track if user has enabled camera

function preload() {
  catShader = loadShader('catVisionShader.vert', 'catVisionShader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Set up video capture but don't start playing until user interaction
  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide(); // Hide the default video element

  // Mobile fix: require user interaction to start video
  if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
    alert('Tap the screen to enable the camera.');
  }
}

function draw() {
  shader(catShader);
  catShader.setUniform('tex0', capture);
  catShader.setUniform('resolution', [width, height]);
  catShader.setUniform('hasDepth', false);

  plane(width, height, 50, 50);
}

// Ensure canvas resizes properly
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  capture.size(windowWidth, windowHeight);
}

// Mobile fix: Start video on user interaction
function touchStarted() {
  if (!cameraStarted) {
    cameraStarted = true; // Set flag to prevent multiple calls
    capture.play();
  }
}
