document.addEventListener("DOMContentLoaded", () => {
    // Birthday Message Feature
    const messageInput = document.getElementById("messageInput");
    const messageButton = document.getElementById("messageButton");
    const messageBoard = document.getElementById("messageBoard");

    if (messageInput && messageButton && messageBoard) {
        messageButton.addEventListener("click", () => {
            const message = messageInput.value.trim();
            if (message) {
                const messageElement = document.createElement("p");
                messageElement.textContent = message;
                messageBoard.appendChild(messageElement);

                // Clear input field for next message
                messageInput.value = "";
                messageInput.focus();
            } else {
                alert("Please enter a message before sending!");
            }
        });
    } else {
        console.error("Message input, button, or board not found in the DOM.");
    }

    // Handle sending a special birthday message (Email or Alert)
    const emailButton = document.getElementById("sendEmailButton");
    if (emailButton) {
        emailButton.addEventListener("click", () => {
            const specialMessage = "Happy Birthday, Caydence! 🎉 Wishing you a wonderful day filled with love and joy!";
            
            // Example: Implement email sending logic here (replace with actual API or service)
            if (specialMessage) {
                alert(`Special Birthday Message Sent: ${specialMessage}`);
                console.log(`Email sent with message: ${specialMessage}`);
            } else {
                alert("Failed to send the birthday message. Please try again.");
                console.error("Special message is empty or undefined.");
            }
        });
    } else {
        console.error("Send Email button not found in the DOM.");
    }

    // Improve responsiveness for mobile devices
    const resizeHandler = () => {
        if (window.innerWidth < 600) {
            document.body.style.padding = "10px";
        } else {
            document.body.style.padding = "20px";
        }
    };

    window.addEventListener("resize", resizeHandler);
    resizeHandler(); // Ensure proper layout on initial load
});
