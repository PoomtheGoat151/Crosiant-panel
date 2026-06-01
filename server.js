const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// !!! CHANGE THIS TO A SECRET PASSWORD !!!
const CROISSANT_API_KEY = "MySuperSecretCroissantPassword123";

app.use(express.json());

// Temporary store for players online
let onlinePlayers = [];

// API Endpoint that Roblox connects to
app.post('/api/croissant', (req, res) => {
    // Check if the request has the correct security key
    const clientApiKey = req.headers['x-api-key'];

    if (!clientApiKey || clientApiKey !== CROISSANT_API_KEY) {
        console.log("⚠️ Unauthorized connection attempt blocked!");
        return res.status(401).json({ success: false, message: "Invalid API Key" });
    }

    const { action, payload, gameId } = req.body;
    console.log(`🥐 Secure action [${action}] received from Game ID: ${gameId}`);

    if (action === "PlayerJoin") {
        if (!onlinePlayers.some(p => p.userId === payload.userId)) {
            onlinePlayers.push({
                username: payload.username,
                userId: payload.userId,
                joinedAt: new Date().toLocaleTimeString()
            });
        }
    }

    res.status(200).json({ success: true, message: "Data received securely!" });
});

// The Public Web Dashboard HTML View
app.get('/', (req, res) => {
    let playerRows = onlinePlayers.map(p => `
        <tr>
            <td><b>${p.username}</b></td>
            <td>${p.userId}</td>
            <td>${p.joinedAt}</td>
        </tr>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Croissant Panel</title>
            <style>
                body { font-family: sans-serif; background: #1a1a1a; color: #fff; padding: 40px; text-align: center; }
                .panel { background: #2a2a2a; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
                h1 { color: #ffb84d; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 12px; border-bottom: 1px solid #444; text-align: left; }
                th { background: #ffb84d; color: #1a1a1a; }
            </style>
        </head>
        <body>
            <div class="panel">
                <h1>🥐 Croissant Web Panel</h1>
                <p>Live Secure Roblox Server Activity</p>
                <table>
                    <tr>
                        <th>Username</th>
                        <th>User ID</th>
                        <th>Join Time</th>
                    </tr>
                    ${playerRows || '<tr><td colspan="3" style="text-align:center;">No players active online.</td></tr>'}
                </table>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🥐 Croissant Server running securely on port ${PORT}`);
});
