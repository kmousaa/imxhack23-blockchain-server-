
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// detect json payload 
app.use(express.json())
app.use(express.urlencoded( {extended :  false} ));

app.get('/', (req , res ) => {
  res.send('HELLO WORLD');
});


app.post('/mintSeed', (req, res ) => {
    
    console.log(req.body);

    const { tokenID , bluePrint, publicKey } = req.body;

    if (!tokenID ||  !bluePrint || !bluePrint){
        res.status(403).send( {'success': false} )
    }
    else if (tokenID !== 'string' || bluePrint !== 'string' || bluePrint !== 'string'){
        res.status(403).send( {'success': false} )
    }
    else {
        console.log(tokenID, bluePrint, publicKey);
        res.status(201).send( {'success': true} )
    }


});



app.listen(PORT, () => console.log(`started and listening on port ${PORT}.`));