let capture;
let catShader;

function preload() {
  // Load the vertex and fragment shaders
  catShader = loadShader('catVisionShader.vert', 'catVisionShader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
  
    capture = createCapture(VIDEO);
    capture.size(windowWidth, windowHeight);
    capture.hide();
   
  }
  

  function draw() {
    shader(catShader);
    catShader.setUniform('tex0', capture);
    catShader.setUniform('resolution', [width, height]);
    catShader.setUniform('hasDepth', false);
  
    plane(width, height, 50, 50); 
  

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    capture.size(windowWidth, windowHeight);
  }
}
