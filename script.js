document.getElementById("send-btn").addEventListener("click", function (event) {
    // Get the mouse's position relative to the viewport
    const mouseX = event.clientX;
    const mouseY = event.clientY + window.scrollY;  // Account for scroll position

    // Counter to track how many hearts have been created
    let heartCount = 0;

    // Set an interval to spawn hearts every 0.1s
    const interval = setInterval(() => {
        // Create a wrapper div for each heart
        const heartWrapper = document.createElement("div");
        heartWrapper.className = "heart-wrapper";
        
        // Create the actual heart inside the wrapper
        const heart = document.createElement("div");
        heart.className = "heart-inner";

        // Randomize the movement in X and Y directions with wider spread
        const randomX = Math.random() * 300 - 150;  // Increase the range for more spread
        const randomY = Math.random() * 300 - 150;  // Increase the range for more spread

        // Set the initial position of the wrapper at the mouse location
        heartWrapper.style.left = `${mouseX - 15}px`;  // Offset by half the heart size (15px)
        heartWrapper.style.top = `${mouseY - 15}px`;   // Offset by half the heart size (15px)

        // Apply random movement to the wrapper using CSS custom properties
        heartWrapper.style.setProperty('--random-x', `${randomX}px`);
        heartWrapper.style.setProperty('--random-y', `${randomY}px`);

        // Apply the animation to move the heart wrapper outward
        heartWrapper.style.animation = `burst-wrapper 1.5s ease-out forwards`;

        // Apply animation to the heart for rotation
        heart.style.animation = `rotate-heart 1.5s linear infinite`;

        // Append the heart to the wrapper
        heartWrapper.appendChild(heart);
        
        // Append the wrapper to the body
        document.body.appendChild(heartWrapper);

        // Remove the wrapper after the animation ends (1.5s duration)
        setTimeout(() => {
            heartWrapper.remove();
        }, 1500);

        // Increment heart counter
        heartCount++;

        // Stop spawning after 15 hearts (or any number you want)
        if (heartCount >= 10) {
            clearInterval(interval);
        }
    }, 24);  // Spawn a new heart every 100 milliseconds (0.1s)
});

document.addEventListener('DOMContentLoaded', function () {
    const sendBtn = document.getElementById("send-btn");
    const countdownText = document.getElementById("countdown-text");

    // Check if the user has already sent a message


    function checkisclosed() {
        let lastSentTime = localStorage.getItem("lastSentTime10");
        let currentTime = new Date().getTime();
    
        // If there was a previous submission, calculate the remaining time
        if (lastSentTime) {
        let timeRemaining = 6 * 60 * 60 * 1000 - (currentTime - lastSentTime); // 6 hours in milliseconds
        if (timeRemaining > 0) {
            // Disable button and display closed message
                sendBtn.disabled = true;
                displayClosedMessage(timeRemaining);
            } else {
            // Allow sending a message after 6 hours
                enableSendButton();
            }
            } else {
            // Allow sending a message right away
                enableSendButton();
            }
        }
    checkisclosed();




    // Event listener for the Send Love button
    sendBtn.addEventListener("click", function () {
        const name = document.getElementById("name").value;
        const message = document.getElementById("message").value;

        if (name && message) {
            sendMessage(name, message);
        }
    });

    // Function to send the message and disable the button for 6 hours
    function sendMessage(name, message) {
        // Disable the button and set the timestamp for the last sent message
        sendBtn.disabled = true;
        localStorage.setItem("lastSentTime10", new Date().getTime());
        checkisclosed();
        toggleCountdownVisibility();

        // Send the message to your email via EmailJS
        sendEmail(name, message);
    }

    // Function to enable the send button after 6 hours
    function enableSendButton() {
        sendBtn.disabled = false;
        // countdownText.textContent = ""; // Clear the countdown text
        toggleCountdownVisibility(); // Hide countdown text when it's cleared
    }

    // Function to display the "closed until" message and start the countdown
    function displayClosedMessage(timeRemaining) {
        let currentTime = new Date().getTime();

        let resetTime = new Date(currentTime + timeRemaining);
        let resetDate = resetTime.toLocaleString(); // This will show the date and time
        let nTime = new Date(currentTime);
        let nDate = nTime.toLocaleString(); // This will show the date and time
        countdownText.textContent = `Closed until ${resetDate}`;
        const now = new Date().getTime();
        const timeLeft = resetTime - now;
        let hours = Math.floor(timeLeft / (1000 * 60 * 60));
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        let nhours = Math.floor(now / (1000 * 60 * 60));
        let nminutes = Math.floor((now % (1000 * 60 * 60)) / (1000 * 60));
        let nseconds = Math.floor((now % (1000 * 60)) / 1000);
        console.log(`Log (${nDate})`, `Closed until ${resetDate}.<br>Next available in ${hours}h ${minutes}m ${seconds}s.`);

        // Start a countdown to the reset time
        const interval = setInterval(function () {
            const now = new Date().getTime();
            const timeLeft = resetTime - now;

            if (timeLeft <= 0) {
                clearInterval(interval);
                countdownText.innerHTML = `You can send a message now!`;
                enableSendButton();
            } else {
                // Calculate hours, minutes, and seconds
                let hours = Math.floor(timeLeft / (1000 * 60 * 60));
                let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                // Update the countdown below the "Closed until" message
                countdownText.innerHTML = `Closed until ${resetDate}.<br>Next available in ${hours}h ${minutes}m ${seconds}s.`;
            }


            // Check if the countdownText is empty, hide it if it is
            toggleCountdownVisibility();
        }, 1000); // Update every second
    }

    // Function to hide or show countdown text based on its content
    function toggleCountdownVisibility() {
        if (countdownText.textContent.trim() === "") {
            countdownText.style.display = "none"; // Hide element if text is empty
        } else {
            countdownText.style.display = "block"; // Show element if text is not empty
        }
    }

    // Function to send the email via EmailJS
    function sendEmail(name, message) {
        emailjs.send("service_kt6a7yr", "template_1tgzcop", {
            from_name: name,
            message: message,
            to_email: "diamondmya89@gmail.com"
        })
        .then(function(response) {
            console.log("Sent message: ", response);
        }, function(error) {
            console.log("Error: ", error);

            // Check if the error status is 429 (rate limit exceeded)
            if (error.status === 429) {
                // Get the retry_after value from the response, which is in seconds
                let retryAfter = error.response.retry_after; // Retry time in seconds

                // Calculate the reset date and time based on retryAfter
                let resetTime = new Date().getTime() + (retryAfter * 1000); // Convert seconds to milliseconds
                let resetDate = new Date(resetTime).toLocaleString(); // Format the reset date

                // Show an error message to users indicating the request limit has been reached
                countdownText.textContent = `Server limit reached. Resets on: ${resetDate}`;
                disableSending();  // Optionally, you can disable the button to prevent further attempts
            }
        });
    }

    // Function to disable the sending button if limit is reached
    function disableSending() {
        sendBtn.disabled = true;
        countdownText.textContent = ""; // Clear countdown since sending is disabled
        toggleCountdownVisibility(); // Hide the countdown text
    }
});
