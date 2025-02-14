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
