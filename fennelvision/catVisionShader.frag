#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D tex0;     // Main video texture
uniform sampler2D depthTex;  // Depth texture (if available)
uniform vec2 resolution;     // Canvas resolution
uniform bool hasDepth;       // Flag to indicate whether depth texture is available

// A simple 9-sample box blur function.
vec4 sampleBlur(vec2 uv, float radius) {
    vec4 sum = vec4(0.0);
    float count = 0.0;

    // Loop over a 3x3 grid of neighboring pixels.
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 offset = vec2(float(x), float(y)) * radius / resolution;
            sum += texture2D(tex0, uv + offset);
            count += 1.0;
        }
    }
    return sum / count;
}

void main() {
    // Flip the Y coordinate to correct the upside-down video.
    vec2 uv = vec2(vTexCoord.x, 1.0 - vTexCoord.y);

    // Get depth from the provided depth texture or simulate depth using the vertical coordinate.
    float depth;
    if (hasDepth) {
        depth = texture2D(depthTex, uv).r;
    } else {

        float gradientSharpness = 0.05; // Adjust this value to control sharpness (higher = sharper)
        depth = pow(uv.y, gradientSharpness); // Non-linear depth based on vertical position
    }

 
    float blurMultiplier = hasDepth ? 20.0 : 40.0; // Higher multiplier for fallback
    float maxBlur = hasDepth ? 5.0 : 8.0;        // Increased max blur for fallback

    float blurAmount = clamp((depth - 0.5) * blurMultiplier, 0.0, maxBlur);


    // Choose whether to apply blur.
    vec4 color;
    if (blurAmount < 0.01) {
        color = texture2D(tex0, uv);
    } else {
        color = sampleBlur(uv, blurAmount);
    }

    // Apply a simple cat vision effect: reduce the red channel intensity.
    color.r *= 0.3;

    gl_FragColor = color;
}
