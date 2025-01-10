// game.js

const signalingServerUrl = "wss://your-signaling-server.com";
let socket;

function connectToSignalingServer() {
    socket = new WebSocket(signalingServerUrl);

    socket.onopen = () => {
        console.log("Connected to signaling server");
    };

    socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "offer") {
            const answer = await createAnswer(message.offer);
            socket.send(JSON.stringify({ type: "answer", answer: answer }));
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

function sendSignalingMessage(message) {
    socket.send(JSON.stringify(message));
}

// Start the connection
connectToSignalingServer();
