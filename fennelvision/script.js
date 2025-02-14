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
    // Set up the shader with our uniforms
    shader(catShader);
    catShader.setUniform('tex0', capture);
    catShader.setUniform('resolution', [width, height]);
    catShader.setUniform('hasDepth', hasDepth);
    if (hasDepth && depthTexture) {
      catShader.setUniform('depthTex', depthTexture);
    }

    // Get the native video dimensions
    let nativeVideoWidth = capture.elt.videoWidth;
    let nativeVideoHeight = capture.elt.videoHeight;
    
    // If the metadata hasn’t loaded yet, skip drawing
    if (nativeVideoWidth === 0 || nativeVideoHeight === 0) return;

    // Compute the video’s aspect ratio
    let videoAspect = nativeVideoWidth / nativeVideoHeight;
    let canvasAspect = width / height;

    // Calculate drawing dimensions that preserve the video’s aspect ratio
    let drawWidth, drawHeight;
    if (canvasAspect > videoAspect) {
      // Canvas is wider than the video: match height
      drawHeight = height;
      drawWidth = height * videoAspect;
    } else {
      // Canvas is taller than the video: match width
      drawWidth = width;
      drawHeight = width / videoAspect;
    }

    push();
    // In WEBGL mode, (0, 0) is at the center.
    // Drawing a plane centers it by default. No extra translate is needed.
    
    // Flip horizontally only for the front camera (mirrored view)
    if (!usingBackCamera) {
      scale(-1, 1);
    }
    
    // Draw the plane using the computed dimensions
    plane(drawWidth, drawHeight);
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
