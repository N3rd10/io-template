const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
let peerConnection;
let dataChannel;

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
            console.log("New ICE candidate:", JSON.stringify(event.candidate));
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

async function createOffer() {
    createConnection();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    document.getElementById('offer').value = JSON.stringify(offer);
}

async function setAnswer() {
    const answer = JSON.parse(document.getElementById('answer').value);
    await peerConnection.setRemoteDescription(answer);
}

// Example function to handle game data
function handleGameData(data) {
    console.log("Handling game data:", data);
    // Update game state based on received data
}
