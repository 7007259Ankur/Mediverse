const WebSocket = require('ws');
const Record = require('./models/Record');
const User = require('./models/User');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('🔌 New WebSocket connection established.');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);

        switch (data.action || data.type) {
          case 'addNote':
            if (!data.recordId || !data.userId || !data.content) {
              console.warn('❗ Missing fields in addNote');
              return;
            }

            const updatedRecord = await Record.findByIdAndUpdate(
              data.recordId,
              {
                $push: {
                  doctorNotes: {
                    doctorId: data.userId,
                    note: data.content,
                  },
                },
              },
              { new: true }
            ).populate('doctorNotes.doctorId', 'name email');

            const newNote = updatedRecord?.doctorNotes?.slice(-1)[0];

            // Broadcast new note to all connected clients
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'noteAdded',
                  recordId: data.recordId,
                  note: newNote,
                }));
              }
            });
            break;

          // Uncomment these when you're ready to support WebRTC signaling again
          /*
          case 'join-room':
            ws.roomId = data.roomId;
            console.log(`📺 Client joined room: ${ws.roomId}`);
            break;

          case 'webrtc-signal':
            wss.clients.forEach((client) => {
              if (
                client !== ws &&
                client.readyState === WebSocket.OPEN &&
                client.roomId === data.roomId
              ) {
                client.send(JSON.stringify({
                  type: 'webrtc-signal',
                  signal: data.signal,
                }));
              }
            });
            break;
          */

          default:
            console.warn('❗ Unknown action or type:', data.action || data.type);
        }

      } catch (err) {
        console.error('💥 Error handling WebSocket message:', err.message);
      }
    });

    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected.');
    });

    ws.on('error', (err) => {
      console.error('💥 WebSocket error:', err.message);
    });
  });

  return wss;
}

module.exports = setupWebSocket;
