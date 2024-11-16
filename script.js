document.getElementById("send-btn").addEventListener("click", function (event) {

    // Get the mouse's position when clicked
    const mouseX = event.clientX;
    const mouseY = event.clientY;
console.log(mouseX,"  ",mouseY);
    // Generate hearts and apply explosion animation
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement("div");
        heart.className = "heart";

        // Randomize heart direction and position
        const randomX = Math.random() * 200 - 100;  // Random X position (-100 to 100px)
        const randomY = Math.random() * 200 - 100;  // Random Y position (-100 to 100px)

        // Set initial position of the heart at the mouse location
        heart.style.left = `${mouseX - 15}px`;  // Offset by half the heart size (15px)
        heart.style.top = `${mouseY - 15}px`;   // Offset by half the heart size (15px)

        // Set custom CSS properties for animation
        heart.style.setProperty('--random-x', randomX + 'px');
        heart.style.setProperty('--random-y', randomY + 'px');
        heart.style.animationDelay = `${i * 0.1}s`; // Stagger the animation start time

        // Append the heart to the body
        document.body.appendChild(heart);

        // Remove the heart after the animation
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
});
