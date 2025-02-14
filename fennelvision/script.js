let capture;
let catShader;
let usingBackCamera = true; // Default to back camera for LiDAR
let cameraButton;
let depthTexture;
let hasDepth = false;

function preload() {
  catShader = loadShader('catVisionShader.vert', 'catVisionShader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Remove browser margins for fullscreen
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";

  // Create button to switch cameras
  cameraButton = createButton('Switch Camera');
  cameraButton.style('position', 'absolute');
  cameraButton.style('top', '10px');
  cameraButton.style('left', '10px');
  cameraButton.style('z-index', '10');
  cameraButton.style('font-size', '20px'); // Increase font size
  cameraButton.style('padding', '20px 40px'); // Increase padding for bigger button
  cameraButton.style('background-color', '#007BFF'); // Optional: Change background color
  cameraButton.style('color', 'white'); // Optional: Set text color
  cameraButton.style('border', 'none'); // Optional: Remove border
  cameraButton.mousePressed(switchCamera);

  startCamera(usingBackCamera);

  // Detect orientation change
  window.addEventListener('orientationchange', adjustVideoSize, false);
  window.addEventListener('resize', adjustVideoSize, false);
}

function draw() {
  background(0);
  
  if (capture && capture.elt.readyState === capture.elt.HAVE_ENOUGH_DATA) {
    shader(catShader);
    catShader.setUniform('tex0', capture);
    catShader.setUniform('resolution', [width, height]);
    catShader.setUniform('hasDepth', hasDepth);
    
    if (hasDepth && depthTexture) {
      catShader.setUniform('depthTex', depthTexture);
    }

    // Get video aspect ratio and scale it to fit window
   // let videoAspectRatio = capture.width / capture.height;
    let videoWidth, videoHeight;


    // Center the video within the window
    let xOffset = (windowWidth - videoWidth) / 2;
    let yOffset = (windowHeight - videoHeight) / 2;

    // Draw the video with correct aspect ratio
    push();
    translate(xOffset, yOffset);
    scale(-1, 1); // Flip video for front camera
    plane(videoWidth, videoHeight);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recalculate video scaling on window resize
  adjustVideoSize();
}

// Start camera & check for LiDAR support
async function startCamera(useBack) {
  let constraints = {
    video: {
      facingMode: useBack ? "environment" : "user",
      width: { ideal: windowWidth },
      height: { ideal: windowHeight }
    }
  };

  // Stop previous camera stream
  if (capture) {
    let stream = capture.elt.srcObject;
    if (stream) {
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    capture.remove();
  }

  // Request new video stream
  navigator.mediaDevices.getUserMedia(constraints)
    .then(async stream => {
      capture = createCapture(stream);
      capture.elt.srcObject = stream;
      capture.size(windowWidth, windowHeight);
      capture.hide();
      
      // Check if LiDAR depth is available
      if ('depth' in capture.elt) {
        depthTexture = capture.elt.depth;
        hasDepth = true;
        console.log("LiDAR Depth Texture Activated");
      } else {
        hasDepth = false;
        console.log("No LiDAR depth detected. Using simulated blur.");
      }
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

// Detect screen orientation change and adjust video scaling
function adjustVideoSize() {
  let videoAspectRatio = capture.width / capture.height;
  let videoWidth, videoHeight;

  // Handle landscape and portrait orientations
  if (windowWidth / windowHeight > videoAspectRatio) {
    // Portrait mode (window is taller)
    videoHeight = windowHeight;
    videoWidth = videoHeight * videoAspectRatio;
  } else {
    // Landscape mode (window is wider)
    videoWidth = windowWidth;
    videoHeight = videoWidth / videoAspectRatio;
  }

  // Center the video within the window
  let xOffset = (windowWidth - videoWidth) / 2;
  let yOffset = (windowHeight - videoHeight) / 2;
}
