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
    }

    // Handle sending a special email
    const emailButton = document.getElementById("sendEmailButton");
    if (emailButton) {
        emailButton.addEventListener("click", () => {
            alert("Special Birthday Email functionality coming soon!");
        });
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
