let capture;
let catShader;
let usingBackCamera = false;
let cameraButton;

function preload() {
  catShader = loadShader('catVisionShader.vert', 'catVisionShader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Remove any margins and make it fullscreen
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  
  // Create a button to switch cameras
  cameraButton = createButton('Switch Camera');
  cameraButton.style('position', 'absolute');
  cameraButton.style('top', '10px');
  cameraButton.style('left', '10px');
  cameraButton.style('z-index', '10');
  cameraButton.mousePressed(switchCamera);

  startCamera(usingBackCamera);
}

function draw() {
  background(0);

  if (capture && capture.elt.readyState === capture.elt.HAVE_ENOUGH_DATA) {
    shader(catShader);
    catShader.setUniform('tex0', capture);
    catShader.setUniform('resolution', [width, height]);
    catShader.setUniform('hasDepth', false);

    // Fix the plane to properly display the video fullscreen
    push();
    translate(0, 0, 0);
    scale(-1, 1); // Mirror the video so it appears natural
    plane(width, height);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Start the camera with the correct mode
function startCamera(useBack) {
  let constraints = {
    video: {
      facingMode: useBack ? "environment" : "user",
      width: { ideal: windowWidth },
      height: { ideal: windowHeight }
    }
  };

  // Stop existing video before starting a new one
  if (capture) {
    let stream = capture.elt.srcObject;
    if (stream) {
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    capture.remove();
  }

  // Start the new camera
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      capture = createCapture(stream);
      capture.elt.srcObject = stream;
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
