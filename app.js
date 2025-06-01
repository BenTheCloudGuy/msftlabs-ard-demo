const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

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

app.post('/update', (req, res) => {
  const { ip, timestamp } = req.body;
  if (ip && timestamp) {
    deviceData = { ip, timestamp };
    res.status(200).send('Data updated');
  } else {
    res.status(400).send('Invalid data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
