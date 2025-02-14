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

    // Get video aspect ratio and scale it to FILL the window
    let videoAspectRatio = capture.width / capture.height;
    let videoWidth, videoHeight;

    if (windowWidth / windowHeight < videoAspectRatio) {
      // Window is taller relative to video aspect ratio, video width fills window
      videoWidth = windowWidth;
      videoHeight = windowWidth / videoAspectRatio;
    } else {
      // Window is wider relative to video aspect ratio, video height fills window
      videoHeight = windowHeight;
      videoWidth = windowHeight * videoAspectRatio;
    }

    // No centering needed, video fills from top-left corner to cover
    push();
    scale(-1, 1); // Flip video for front camera - keep this if you still want front cam flipped
    translate(-videoWidth/2, -videoHeight/2); // Center the plane
    plane(videoWidth, videoHeight);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Start camera & check for LiDAR support
async function startCamera(useBack) {
  let constraints = {
    video: {
      facingMode: useBack ? "environment" : "user",
      width: { ideal: windowWidth },
      height: { ideal: windowHeight },
      depth: true // Request depth data - this might be redundant but good to include explicitly
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

      // Debugging logs for LiDAR detection
      console.log("Capture element:", capture.elt);
      console.log("Capture element prototype:", Object.getPrototypeOf(capture.elt)); // Check prototype for 'depth'
      console.log("'depth' in capture.elt:", 'depth' in capture.elt);


      // Check if LiDAR depth is available
      if ('depth' in capture.elt) {
        depthTexture = capture.elt.depth;
        hasDepth = true;
        console.log("LiDAR Depth Texture Activated");
        console.log("Depth Texture Object:", depthTexture); // Log the depthTexture object itself
        if (depthTexture) {
          console.log("Depth Texture Prototype:", Object.getPrototypeOf(depthTexture)); // Log depthTexture prototype
        }

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
