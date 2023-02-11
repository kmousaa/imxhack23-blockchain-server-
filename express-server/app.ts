
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req , res ) => {
  res.send('HELLO WORLD');
});

app.listen(PORT, () => console.log(`started and listening on port ${PORT}.`));