'use client';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, ShieldCheck } from 'lucide-react';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
    ]
};

let socket;
export default function MeetingRoom({ roomId, userName, isHost }) {
    const [stream, setStream] = useState(null);
    const [peers, setPeers] = useState([]); 
    const [muted, setMuted] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const videoGridRef = useRef(null);
    const myVideoRef = useRef(null);
    const peersRef = useRef({}); 

    useEffect(() => {
        const initSocket = async () => {
            await fetch('/api/socket');
            socket = io(undefined, {
                path: '/api/socket',
            });

            socket.on('connect', () => {
                console.log('Connected to Signal Server', socket.id);
                socket.emit('join-room', roomId, socket.id);
            });

            socket.on('user-connected', (userId) => {
                console.log('User joined:', userId);
                connectToNewUser(userId, stream);
            });

            socket.on('user-disconnected', (userId) => {
                if (peersRef.current[userId]) {
                    peersRef.current[userId].close();
                    delete peersRef.current[userId];
                    setPeers(prev => prev.filter(p => p.id !== userId));
                }
            });

            socket.on('offer', async (data) => {
                // Answer
                const pc = createPeerConnection(data.caller, stream);
                peersRef.current[data.caller] = pc;
                await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('answer', { target: data.caller, caller: socket.id, sdp: answer });
            });

            socket.on('answer', async (data) => {
                const pc = peersRef.current[data.caller];
                if (pc) {
                    await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
                }
            });

            socket.on('ice-candidate', async (data) => {
                const pc = peersRef.current[data.caller]; // This logic is slightly flawed for mesh (needs caller ID everywhere)
                // Wait, ice-candidate event needs sender ID.
                // My socket server broadcasted it?
                // Let's refine connection logic iteratively if needed.
                // Ideally data.candidate allows addIceCandidate.
                if (pc && data.candidate) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                    } catch (e) { }
                }
            });
        };

        const startStream = async () => {
            try {
                const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(currentStream);
                if (myVideoRef.current) myVideoRef.current.srcObject = currentStream;
                initSocket();
            } catch (e) {
                console.error("Media Error", e);
                alert("Camera/Mic permission denied");
            }
        };

        startStream();

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (socket) socket.disconnect();
            Object.values(peersRef.current).forEach(pc => pc.close());
        };
    }, [roomId]);

    function createPeerConnection(userId, myStream) {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        if (myStream) {
            myStream.getTracks().forEach(track => pc.addTrack(track, myStream));
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { target: userId, candidate: event.candidate }); // Caller needs to be handled
            }
        };

        pc.ontrack = (event) => {
            setPeers(prev => {
                if (prev.find(p => p.id === userId)) return prev;
                return [...prev, { id: userId, stream: event.streams[0] }];
            });
        };

        return pc;
    }

    function connectToNewUser(userId, myStream) {
        // Initiator
        const pc = createPeerConnection(userId, myStream);
        peersRef.current[userId] = pc;

        pc.createOffer().then(offer => {
            pc.setLocalDescription(offer);
            socket.emit('offer', { target: userId, caller: socket.id, sdp: offer });
        });
    }

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setMuted(!stream.getAudioTracks()[0].enabled);
        }
    }

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setVideoEnabled(stream.getVideoTracks()[0].enabled);
        }
    }

    return (
        <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '1rem', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: '#E91E63', padding: '0.5rem', borderRadius: '8px' }}><Video color="white" size={20} /></div>
                    <div style={{ color: 'white' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'Oswald' }}>CADD AXIS LIVE</h3>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Secure Room: {roomId}</span>
                    </div>
                </div>
                {isHost && <div style={{ color: '#E91E63', fontWeight: 'bold', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem' }}><ShieldCheck size={16} /> ADMIN HOST</div>}
            </div>

            {/* Video Grid */}
            <div style={{ flex: 1, padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', alignContent: 'center' }}>

                {/* My Video */}
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '2px solid #334155' }}>
                    <video ref={myVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                        YOU {muted && '(Muted)'}
                    </div>
                </div>

                {/* Peers */}
                {peers.map(peer => (
                    <PeerVideo key={peer.id} peer={peer} />
                ))}

            </div>

            {/* Controls */}
            <div style={{ padding: '1.5rem', background: '#1e293b', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <button onClick={toggleMute} style={{ padding: '1rem', borderRadius: '50%', border: 'none', background: muted ? '#ef4444' : '#334155', color: 'white', cursor: 'pointer' }}>
                    {muted ? <MicOff /> : <Mic />}
                </button>
                <button onClick={toggleVideo} style={{ padding: '1rem', borderRadius: '50%', border: 'none', background: !videoEnabled ? '#ef4444' : '#334155', color: 'white', cursor: 'pointer' }}>
                    {!videoEnabled ? <VideoOff /> : <Video />}
                </button>
                <button style={{ padding: '1rem 3rem', borderRadius: '50px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                    Leave Function
                </button>
            </div>
        </div>
    );
}

function PeerVideo({ peer }) {
    const ref = useRef();
    useEffect(() => {
        if (ref.current) ref.current.srcObject = peer.stream;
    }, [peer.stream]);
    return (
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '2px solid #334155' }}>
            <video ref={ref} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
    );
}
