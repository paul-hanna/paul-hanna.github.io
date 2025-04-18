window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-music');
    audio.volume = 0.3;
  
    // Unlock audio on first user scroll
    let audioUnlocked = false;
    function unlockAudio() {
      if (!audioUnlocked) {
        audio.muted = false;
        audio.play().catch(() => {
          window.addEventListener('click', () => audio.play(), { once: true });
        });
        audioUnlocked = true;
      }
    }
  
    // Hardcoded test sequences
    const sequences = [
      { name: 'sequence1', count: 14 },
      { name: 'sequence2', count: 11 }
    ];
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  
    const shuffled = shuffle([...sequences]);
    const container = document.getElementById('container');
  
    // 1) Build your sequences exactly as before
    const sequenceElements = [];
    shuffled.forEach(seq => {
      const div = document.createElement('div');
      div.classList.add('sequence');
      container.appendChild(div);
  
      const images = [];
      for (let i = 0; i < seq.count; i++) {
        const num = String(i + 1).padStart(3, '0');
        const img = document.createElement('img');
        img.src = `sequences/${seq.name}/${num}.jpg`;
        img.classList.add('image');
  
        // keep your diagonal offsets
        img.style.top = `${i * 30}px`;
        img.style.left = `${i * 20}px`;
        img.style.zIndex = i + 1;
  
        div.appendChild(img);
        images.push(img);
      }
  
      sequenceElements.push(images);
    });
  
    // 2) Add a spacer to grow the page on demand
    const spacer = document.createElement('div');
    spacer.id = 'spacer';
    spacer.style.width = '100%';
    spacer.style.height = '0px';
    container.appendChild(spacer);
  
    const flatImages = sequenceElements.flat();
    let currentIndex = 0;
    let scrollCounter = 0;
    const SCROLLS_PER_IMAGE = 30;
    const PIXELS_PER_IMAGE = 100; // how much to scroll/space each reveal
  
    function handleScroll(e) {
      e.preventDefault();
      unlockAudio();
  
      scrollCounter++;
      if (scrollCounter >= SCROLLS_PER_IMAGE && currentIndex < flatImages.length) {
        // reveal the next image
        const img = flatImages[currentIndex];
        img.classList.add('visible');
        currentIndex++;
        scrollCounter = 0;
  
        // grow the spacer so the page is taller
        const newH = parseInt(spacer.style.height) + PIXELS_PER_IMAGE;
        spacer.style.height = newH + 'px';
  
        // manually move the viewport into that new space
        window.scrollBy(0, PIXELS_PER_IMAGE);
      }
    }
  
    window.addEventListener('wheel', handleScroll, { passive: false });
  });
  