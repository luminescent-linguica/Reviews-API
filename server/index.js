require('dotenv').config();
const express = require('express');
const reviewRoutes = require('./routes');

const app = express();

app.use(express.json());

app.use('/reviews', reviewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server available on port 3000');
});
