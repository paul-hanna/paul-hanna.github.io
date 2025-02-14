let capture;
let catShader;
let usingBackCamera = true;
let cameraButton;
let depthTexture;
let hasDepth = false;
let videoWidth, videoHeight;

function preload() {
  catShader = loadShader('catVisionShader.vert', 'catVisionShader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";

  cameraButton = createButton('Switch Camera');
  cameraButton.style('position', 'absolute');
  cameraButton.style('top', '10px');
  cameraButton.style('left', '10px');
  cameraButton.style('z-index', '10');
  cameraButton.style('font-size', '20px');
  cameraButton.style('padding', '20px 40px');
  cameraButton.style('background-color', '#007BFF');
  cameraButton.style('color', 'white');
  cameraButton.style('border', 'none');
  cameraButton.mousePressed(switchCamera);

  startCamera(usingBackCamera);

  window.addEventListener('resize', windowResized, false);
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
    
    // Get camera dimensions: use capture.width if available, else the video element’s dimensions.
    let camW = capture.width || capture.elt.videoWidth;
    let camH = capture.height || capture.elt.videoHeight;
    let videoAspectRatio = camW / camH;
    
    // Get current device orientation (0 for portrait, 90/-90 for landscape)
    let orientation = window.orientation || 0;
    
    // If the device is rotated, the video feed might be rotated relative to the display.
    // In that case, swap the aspect ratio.
    if (Math.abs(orientation) === 90) {
      videoAspectRatio = camH / camW;
    }
    
    // Calculate dimensions for the video plane to fit the canvas while preserving aspect ratio.
    let displayAspectRatio = windowWidth / windowHeight;
    let videoDrawWidth, videoDrawHeight;
    if (displayAspectRatio > videoAspectRatio) {
      videoDrawHeight = windowHeight;
      videoDrawWidth = videoDrawHeight * videoAspectRatio;
    } else {
      videoDrawWidth = windowWidth;
      videoDrawHeight = videoDrawWidth / videoAspectRatio;
    }
    
    push();
    
    // Translate to center of canvas.
    // In WEBGL mode, (0,0) is the canvas center.
    // If you need further centering adjustments, you can translate as needed.
    
    // Apply rotation based on device orientation.
    if (orientation !== 0) {
      rotateZ(radians(orientation));
    }
    
    // Flip horizontally only if using the front camera (which is usually mirrored).
    if (!usingBackCamera) {
      scale(-1, 1);
    }
    
    plane(videoDrawWidth, videoDrawHeight);
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
      height: { ideal: windowHeight }
    }
  };

  if (capture) {
    let stream = capture.elt.srcObject;
    if (stream) {
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    capture.remove();
  }

  navigator.mediaDevices.getUserMedia(constraints)
    .then(async stream => {
      capture = createCapture(stream);
      capture.elt.srcObject = stream;
      capture.hide();

      capture.elt.onloadedmetadata = () => {
        adjustVideoSize();
      };

      if ('depth' in capture.elt) {
        depthTexture = capture.elt.depth;
        hasDepth = true;
        console.log("LiDAR Depth Texture Activated");
      } else {
        hasDepth = false;
        console.log("No LiDAR depth detected.");
      }
    })
    .catch(error => {
      console.error('Camera access error:', error);
      alert('Could not access the camera. Please check permissions.');
    });
}

function switchCamera() {
  usingBackCamera = !usingBackCamera;
  startCamera(usingBackCamera);
}
