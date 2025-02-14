let capture;
let catShader;
let usingBackCamera = false; // Tracks which camera is in use
let cameraButton;

function preload() {
  catShader = loadShader('catVisionShader.vert', 'catVisionShader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create a button to switch cameras
  cameraButton = createButton('Switch Camera');
  cameraButton.position(10, 10);
  cameraButton.mousePressed(switchCamera);

  startCamera(usingBackCamera); // Start with the front camera
}

function draw() {
  if (capture && capture.elt.readyState === capture.elt.HAVE_ENOUGH_DATA) {
    shader(catShader);
    catShader.setUniform('tex0', capture);
    catShader.setUniform('resolution', [width, height]);
    catShader.setUniform('hasDepth', false);
    plane(width, height, 50, 50);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Start the camera with the given mode (true = back, false = front)
function startCamera(useBack) {
  let constraints = {
    video: { facingMode: useBack ? "environment" : "user" }
  };

  // Stop any existing video stream
  if (capture) {
    let stream = capture.elt.srcObject;
    if (stream) {
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    capture.remove(); // Remove the old capture element
  }

  // Request new video stream
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      capture = createCapture(stream);
      capture.elt.srcObject = stream; // Assign stream directly
      capture.size(windowWidth, windowHeight);
      capture.hide();
    })
    .catch(error => {
      console.error('Camera access error:', error);
      alert('Could not access the camera. Please check permissions.');
    });
}

// Switch between front and back cameras
function switchCamera() {
  usingBackCamera = !usingBackCamera;
  startCamera(usingBackCamera);
}
