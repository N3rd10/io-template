// Example game logic
function startGame() {
    console.log("Game started");
    // Initialize game state
    let gameState = {
        players: []
    };

    // Example: Send game data to peers
    function sendGameData(data) {
        if (dataChannel && dataChannel.readyState === "open") {
            dataChannel.send(JSON.stringify(data));
        }
    }

    // Example: Handle received game data
    function handleGameData(data) {
        console.log("Handling game data:", data);
        // Update game state based on received data
        gameState = data;
        // Update the game UI or state accordingly
    }

    // Example: Update game state and send updates to peers
    function updateGameState() {
        // Update game state logic here
        // Send updated game state to peers
        sendGameData(gameState);
    }

    // Example: Game loop or event handling
    setInterval(updateGameState, 1000 / 60); // 60 FPS update rate
}

// Start the game
startGame();
