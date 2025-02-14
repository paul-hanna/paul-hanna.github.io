let capture;
let catShader;

function preload() {
  // Load the vertex and fragment shaders
  catShader = loadShader('catVisionShader.vert', 'catVisionShader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Start video capture
  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide(); // Hide the default HTML video element
}

function draw() {
    shader(catShader);
    catShader.setUniform('tex0', capture);
    catShader.setUniform('resolution', [width, height]);
    
    // Since no depth texture is available on the laptop, set hasDepth to false.
    catShader.setUniform('hasDepth', false);
    
    // If you had a depth texture, you’d also set:
    // catShader.setUniform('depthTex', depthCapture);
    
    // Draw a rectangle covering the whole canvas.
    rect(-width / 2, -height / 2, width, height);
  }
  
  

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
