
import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
    if (res.socket.server.io) {
        console.log('Socket is already running');
    } else {
        console.log('Socket is initializing');
        const io = new Server(res.socket.server, {
            path: '/api/socket',
            addTrailingSlash: false,
        });
        res.socket.server.io = io;

        io.on('connection', socket => {
            console.log('User Connected', socket.id);

            socket.on('join-room', (roomId, userId) => {
                socket.join(roomId);
                // Broadcast to others in room
                socket.to(roomId).emit('user-connected', userId);

                socket.on('disconnect', () => {
                    socket.to(roomId).emit('user-disconnected', userId);
                });
            });

            // Signaling
            socket.on('offer', (data) => {
                socket.to(data.target).emit('offer', { sdp: data.sdp, caller: data.caller });
            });

            socket.on('answer', (data) => {
                socket.to(data.target).emit('answer', { sdp: data.sdp, caller: data.caller });
            });

            socket.on('ice-candidate', (data) => {
                socket.to(data.target).emit('ice-candidate', { candidate: data.candidate });
            });
        });
    }
    res.end();
}
