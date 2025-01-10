// Signaling server URL
const signalingServerUrl = "wss://your-signaling-server.com";
let socket;
let peerConnection;
let dataChannel;

// WebRTC configuration
const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Connect to the signaling server
function connectToSignalingServer() {
    socket = new WebSocket(signalingServerUrl);

    socket.onopen = () => {
        console.log("Connected to signaling server");
    };

    socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "offer") {
            const answer = await createAnswer(message.offer);
            sendSignalingMessage({ type: "answer", answer: answer });
        } else if (message.type === "answer") {
            await handleAnswer(message.answer);
        } else if (message.type === "candidate") {
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

// Send a signaling message
function sendSignalingMessage(message) {
    socket.send(JSON.stringify(message));
}

// Create a new WebRTC connection
function createConnection() {
    peerConnection = new RTCPeerConnection(configuration);

    dataChannel = peerConnection.createDataChannel("gameChannel");

    dataChannel.onopen = () => {
        console.log("Data channel is open");
    };

    dataChannel.onmessage = (event) => {
        console.log("Received message:", event.data);
        // Handle received game data
        handleGameData(JSON.parse(event.data));
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            sendSignalingMessage({ type: "candidate", candidate: event.candidate });
        }
    };

    peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        dataChannel.onmessage = (event) => {
            console.log("Received message:", event.data);
            // Handle received game data
            handleGameData(JSON.parse(event.data));
        };
    };
}

// Create an offer
async function createOffer() {
    createConnection();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
}

// Create an answer
async function createAnswer(offer) {
    createConnection();
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
}

// Handle an answer
async function handleAnswer(answer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

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

// Start the connection and game
connectToSignalingServer();
startGame();
