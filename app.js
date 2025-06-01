const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Add CORS support for Arduino HTTP POSTs
const cors = require('cors');
app.use(cors());

// SignalR integration
const { AzureSignalR } = require('@azure/azure-signalr');
// Load connection string from environment variable (Azure App Service convention)
const signalRConnectionString = process.env.ConnectionStrings__signalRConnectionString;
if (!signalRConnectionString) {
  throw new Error("SignalR connection string not found in environment variables.");
}
const signalR = new AzureSignalR(signalRConnectionString);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let deviceData = {
  ip: 'Not connected',
  timestamp: 'N/A'
};

app.get('/', (req, res) => {
  res.render('index', { deviceData });
});

// Endpoint for SignalR client to get negotiate info
app.get('/negotiate', async (req, res) => {
  const negotiatePayload = await signalR.getClientAccessToken({ userId: "webclient" });
  res.json({
    url: `https://msftlabs-ard-sigr.service.signalr.net/client/?hub=deviceupdates`,
    accessToken: negotiatePayload
  });
});

app.post('/update', async (req, res) => {
  const { ip, timestamp } = req.body;
  if (ip && timestamp) {
    deviceData = { ip, timestamp };
    // Broadcast to SignalR clients
    await signalR.sendToAll("deviceupdates", "update", deviceData);
    res.status(200).send('Data updated');
  } else {
    res.status(400).send('Invalid data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
