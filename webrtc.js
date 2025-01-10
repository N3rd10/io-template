// webrtc.js

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
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            // Send the ICE candidate to the other peer
        }
    };

    peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        dataChannel.onmessage = (event) => {
            console.log("Received message:", event.data);
            // Handle received game data
        };
    };
}

async function createOffer() {
    createConnection();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
}

async function createAnswer(offer) {
    createConnection();
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
}

async function handleAnswer(answer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}
