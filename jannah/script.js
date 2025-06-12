// disable the browser’s “restore scroll on reload” behavior
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  // immediately jump to top on first parse
  window.scrollTo(0, 0);
  
  // Reset scroll on unload/load
  window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
  window.addEventListener('DOMContentLoaded', () =>
    setTimeout(() => window.scrollTo(0, 0), 10)
  );
  
  
  document.addEventListener('DOMContentLoaded', () => {
  
      const basePath = 'sequences',
            ext      = 'jpg',
            fps      = 30,
            scrollPerFrame = 20; // Pixels scrolled per video frame
  
      const sequenceConfig = [
        { type: 'images', count: 14, text: `I could never\npicture how you’d\ntear through\nthe envelope\nor if you’d\nleave it sitting\nupon your\nchestnut vanity.`, position: 'bottom-right', imgOffset: -170 },
        { type: 'images', count: 11, text: `I’ve\nseen\nthis\nbefore,\nbrief\nglimpses\nof\npictures\non\ngallery\nwalls.`, position: 'bottom-left', imgOffset: 70 },
        { type: 'images', count: 15, text: `We can look up now,\nspotting our\nprismed faces\nstretching to\nthe infinite end.`, position: 'bottom-center', imgOffset: -50 },
        { type: 'video', src: 'sequences/sequence4/001.mp4', duration: 10 }
      ];
  
      const container = document.getElementById('main-container');
      const scriptContainer = document.getElementById('script-sequence');
      const scriptLines = Array.from(scriptContainer.querySelectorAll('.script-line'));
      const bgAudio = document.getElementById('bg-audio');
  
      let currentScriptLineIndex = 0;
      const observedLines = new Set(); // Track lines we've started observing
  
      // build sequences and append to #main-container
      sequenceConfig.forEach((seq, s) => {
          if (seq.type === 'images') {
              const seqDiv = document.createElement('div');
              seqDiv.className = 'sequence';
              seqDiv.dataset.seq = s;
              seqDiv.dataset.type = 'images'; // Add type for easier lookup
              // Initial state: hide image sequences
              seqDiv.style.display = 'none';
  
  
              for (let i = 0; i < seq.count; i++) {
                  const layer = document.createElement('div');
                  layer.className = 'image-layer';
                  layer.dataset.idx = i;
  
                  const img = document.createElement('img');
                  img.src = `${basePath}/sequence${s+1}/${String(i+1).padStart(3,'0')}.${ext}`;
                  // maximum random jiggle, in pixels
                  const maxJiggle = 20;
  
                  // compute a random offset around your base imgOffset
                  const randX = seq.imgOffset + (Math.random() * 2 - 1) * maxJiggle;
                  const randY = (Math.random() * 2 - 1) * maxJiggle;
  
                  // Apply initial random transform
                  img.style.transform = `translate(${randX}px, ${randY}px) scale(0.98)`;
  
                  layer.appendChild(img);
                  seqDiv.appendChild(layer);
              }
  
              const textDiv = document.createElement('div');
              textDiv.className = `scroll-text ${seq.position}`;
              textDiv.textContent = seq.text;
              seqDiv.appendChild(textDiv);
  
              container.appendChild(seqDiv);
          }
  
          if (seq.type === 'video') {
              const videoSection = document.createElement('div');
              videoSection.className = 'video-sequence';
              videoSection.dataset.seq = s; // Use sequence index for consistency
              videoSection.dataset.type = 'video'; // Add type for easier lookup
  
               // Initial state: hide video sequence
              videoSection.style.display = 'none';
  
              // The height is effectively managed by the sticky behaviour,
              // but we might need some height for the video scrubbing scroll range.
              // We'll manage the video scrubbing scroll *while it's sticky*.
               // The scroll range needed for scrubbing will happen *within* the 100vh sticky view.
               // Let's set a minimum scroll height for the video section
              const minVideoScrollHeight = window.innerHeight * 2; // Allow at least 1 viewport height of scrolling
  
              videoSection.style.height = `${minVideoScrollHeight}px`;
  
  
              const wrapper = document.createElement('div');
              wrapper.className = 'video-wrapper';
  
              const video = document.createElement('video');
              video.src = seq.src;
              video.muted = true;
              video.playsInline = true;
              video.preload = 'auto';
  
              wrapper.appendChild(video);
              videoSection.appendChild(wrapper);
              container.appendChild(videoSection);
  
              // Video scrubbing logic remains, but only active when videoSection is visible
              window.addEventListener('scroll', () => {
                   if (videoSection.style.display !== 'none') {
                      const start = videoSection.offsetTop;
                      const scrollPos = window.scrollY - start;
  
                      // Ensure frame calculation is within the video section's height
                      const maxScrollForScrubbing = videoSection.clientHeight - window.innerHeight; // max scroll when the *bottom* of the element is at the bottom of the viewport
                       const frame = Math.floor(
                          Math.max(0, Math.min(scrollPos / scrollPerFrame, seq.duration * fps)) // Scrub based on scroll relative to video start
                       );
                       video.currentTime = frame / fps;
                   }
              });
          }
      });
  
      // Get references to the created sequences
      const sequences = Array.from(container.querySelectorAll('.sequence, .video-sequence'));
  
  
      // --- Audio Handling ---
      bgAudio.play().catch(() => {/* ignore autoplay errors */});
  
      // Mute/unmute on first click anywhere
      document.addEventListener('click', () => {
        if (bgAudio.muted) {
          bgAudio.muted = false;
          bgAudio.play(); // Try playing again in case it was paused
        }
      }, { once: true });
  
  
      // --- Core Logic: Script Progression Drives Visuals ---
  
      // Function to type out a script line
      function typeScriptLine(lineElement, onComplete) {
          const fullText = lineElement.textContent;
          lineElement.textContent = '';
          lineElement.classList.add('visible');
           // Scroll the line into view smoothly
          lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  
          const cursor = document.createElement('span');
          cursor.className = 'cursor';
          cursor.textContent = '|';
          lineElement.appendChild(cursor);
  
          let charIndex = 0;
          const speed = 20; // Typing speed
  
          function typeChar() {
              if (charIndex < fullText.length) {
                  lineElement.insertBefore(
                      document.createTextNode(fullText[charIndex++]),
                      cursor
                  );
                  setTimeout(typeChar, speed);
              } else {
                  cursor.remove();
  
                  // Handle click-required lines
                  if (lineElement.dataset.requiresClick === "true") {
                      lineElement.classList.add('needs-click'); // Add class for cursor/styling
                      lineElement.addEventListener('click', function clickHandler() {
                          lineElement.classList.remove('needs-click');
                           // Remove the event listener after click
                          lineElement.removeEventListener('click', clickHandler);
                          if (onComplete) onComplete(); // Call the completion callback
                      });
                  } else {
                      // Auto-advance after typing
                      if (onComplete) onComplete();
                  }
              }
          }
  
          typeChar(); // Start typing
      }
  
      // Function to update image layers for a specific sequence
      function updateImageLayers(seqIndex, imgIndex) {
          const sequenceDiv = sequences.find(seq => seq.dataset.seq == seqIndex && seq.dataset.type === 'images');
          if (!sequenceDiv) {
               console.error(`Image sequence ${seqIndex} not found.`);
              return;
          }
  
          // Ensure this sequence is visible and others are hidden
          sequences.forEach(seq => {
              if (seq === sequenceDiv) {
                   seq.style.display = 'block';
              } else if (seq.dataset.type === 'images' || seq.dataset.type === 'video') {
                   // Hide other visual sequences when an image sequence is active
                   seq.style.display = 'none';
              }
          });
  
  
          const layers = sequenceDiv.querySelectorAll('.image-layer');
          const textDiv = sequenceDiv.querySelector('.scroll-text');
  
          layers.forEach((l, i) => {
              l.classList.remove('visible', 'previous');
              // Show images up to the triggered index
              if (i < imgIndex) {
                   l.classList.add('previous');
                   // Apply base transform to previous images so they don't jiggle
                   const img = l.querySelector('img');
                   if(img) img.style.transform = `translate(${sequenceConfig[seqIndex].imgOffset}px, 0) scale(1)`;
  
              }
              if (i === imgIndex) {
                  l.classList.add('visible');
                   // Apply base transform + scale to visible image
                   const img = l.querySelector('img');
                   if(img) img.style.transform = `translate(${sequenceConfig[seqIndex].imgOffset}px, 0) scale(1)`; // Reset transform for visible one for consistency
              }
              // Images with index > imgIndex remain hidden (opacity 0) and keep their initial transform
          });
  
           // Handle text overlay typing if it's the last image
          const isLastImage = imgIndex === sequenceConfig[seqIndex].count - 1;
          if (textDiv) {
               if (isLastImage) {
                   if (!textDiv.dataset.typed) {
                       textDiv.dataset.typed = 'true';
                       textDiv.style.opacity = 1;
                       typeScrollText(textDiv); // Use your existing helper
                   }
               } else {
                   textDiv.style.opacity = 0; // Hide text for non-last images
                   textDiv.dataset.typed = ''; // Reset typed state
                   textDiv.textContent = sequenceConfig[seqIndex].text; // Reset text content
               }
          }
          return isLastImage; // Return true if the last image was shown
      }
  
      // Helper for typing scroll-text (re-used from your code)
      function typeScrollText(el) {
        const full = el.textContent;
        el.textContent = '';
        let i = 0;
        const speed = 25;
        const timer = setInterval(() => {
          el.textContent += full.charAt(i++);
          if (i >= full.length) clearInterval(timer);
        }, speed);
      }
  
      // Function to handle actions after a script line is typed/clicked
      function handleLineComplete(lineIndex) {
          const lineElement = scriptLines[lineIndex];
          if (!lineElement) return;
  
          // Read data attributes
          const seqTrigger = lineElement.dataset.seqTrigger; // e.g., "0,5" or "1,last"
          const videoTrigger = lineElement.dataset.videoTrigger === 'true';
          const unlockScroll = lineElement.dataset.unlockScroll === 'true';
  
          let wasLastImage = false;
  
          // Handle sequence triggers
          if (seqTrigger) {
              const [seqIndexStr, imgIndexStr] = seqTrigger.split(',');
              const seqIndex = parseInt(seqIndexStr, 10);
              const imgIndex = imgIndexStr === 'last' ? sequenceConfig[seqIndex].count - 1 : parseInt(imgIndexStr, 10);
  
              if (!isNaN(seqIndex) && !isNaN(imgIndex)) {
                   wasLastImage = updateImageLayers(seqIndex, imgIndex);
              } else {
                  console.error(`Invalid seq-trigger format on line ${lineIndex}: ${seqTrigger}`);
              }
          }
  
          // Handle video trigger
          if (videoTrigger) {
              const videoSeqDiv = sequences.find(seq => seq.dataset.type === 'video');
              if (videoSeqDiv) {
                  // Hide all image sequences
                  sequences.filter(seq => seq.dataset.type === 'images').forEach(seq => seq.style.display = 'none');
                  // Show video sequence
                  videoSeqDiv.style.display = 'block';
                   // Make sure the video is potentially playing (muted autoplay allowed)
                   const videoEl = videoSeqDiv.querySelector('video');
                   if(videoEl) videoEl.play().catch(e => console.log("Video autoplay failed:", e)); // Ignore errors
              }
          }
  
          // Handle scroll unlock
          if (unlockScroll) {
               document.body.classList.replace('locked','unlocked');
               console.log("Scroll Unlocked");
          } else if (!videoTrigger && !seqTrigger && !wasLastImage) {
               // If no specific trigger occurred and it wasn't the end of a sequence ending in text,
               // ensure body is still locked (unless it was explicitly unlocked)
               if (!document.body.classList.contains('unlocked')) {
                  document.body.classList.replace('unlocked','locked');
               }
          }
  
  
          // Move to the next script line
          currentScriptLineIndex++;
          // Set up observation for the next line if it exists
          if (currentScriptLineIndex < scriptLines.length) {
              setupLineObserver(scriptLines[currentScriptLineIndex]);
          }
      }
  
      // Setup observer for a specific script line
      function setupLineObserver(lineElement) {
          // Use a threshold of 0.5 to trigger when half the element is visible
          const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  // Check if the intersecting entry is the current line we expect
                  if (entry.isIntersecting && parseInt(entry.target.dataset.lineIndex, 10) === currentScriptLineIndex) {
                      observer.unobserve(entry.target); // Stop observing this line once it triggers
  
                      // Start typing the line, pass handleLineComplete as the callback
                      typeScriptLine(entry.target, () => {
                          handleLineComplete(currentScriptLineIndex);
                      });
                  }
              });
          }, { threshold: 0.5 }); // Adjust threshold as needed
  
          observer.observe(lineElement);
          observedLines.add(lineElement); // Keep track
      }
  
  
      // --- Initial Setup ---
  
      // Start observing the first script line
      if (scriptLines.length > 0) {
          setupLineObserver(scriptLines[0]);
      } else {
           // If no script lines, just unlock the body
           document.body.classList.replace('locked', 'unlocked');
      }
  
  
      // --- Remove Old Listeners (already done in plan, just double check) ---
      // Original click/scroll listeners for advancing sequences are removed
      // Video scroll listener is modified to only act when video is visible.
  
  });