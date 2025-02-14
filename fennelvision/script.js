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

function touchStarted() {
  if (!capture) { // Only request once
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          capture = createCapture(VIDEO, stream);
          capture.hide();
        })
        .catch(function(error) {
          console.error('Error accessing camera:', error);
          alert('Camera access denied or not available.'); // Inform the user
        });
    } else {
      console.error('getUserMedia not supported.');
      alert('Your browser does not support camera access.'); // Inform the user
    }
  }
}
