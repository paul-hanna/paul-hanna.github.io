document.addEventListener("click", function(event) {
    let tick = document.createElement("img");
    tick.src = "tickshtml/ticktick.png"; 
    tick.style.width = "200px";
    tick.style.height = "200px";
    tick.style.position = "absolute";
    tick.style.transform = "rotate(180deg)";
    tick.style.animation = "wigglewiggle 0.5s linear infinite, upward";

    tick.onload = function() {
        tick.style.left = (event.pageX - tick.width / 2) + "px";
        tick.style.top = (event.pageY - tick.height / 2) + "px";
        
        
        tick.style.transition = "transform 3s ease-out";
        tick.style.filter = "grayscale(1)";

        document.body.appendChild(tick);

        setTimeout(() => {
            tick.style.transform = "rotate(180deg) translateY(600px) translateX(10px)";
        }, 50);

        setTimeout(() => {
            tick.remove();
        }, 80000);
    };

    if (tick.complete) {
        tick.onload();
    }

    document.addEventListener('click', () => {
        const audio = document.getElementById('bugsound');
        audio.play(); // No need for .then() if you don't need to track completion
    });
});
