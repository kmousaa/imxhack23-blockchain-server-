
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// detect json payload 
app.use(express.json())
app.use(express.urlencoded( {extended :  false} ));

app.get('/', (req , res ) => {
  res.send('HELLO WORLD');
});

// TO : DO return the public key of the owner of the seed
app.get('/Owner/:seed', (req, res) => {
    const seed = req.params.seed
    if (!seed){
        return res.status(403).send( {'success': false} )
    }
    else if (typeof seed !== 'string'){
        return res.status(403).send( {'success': false} )
    }
    else{
        return res.status(201).send( {'success': true} )
    }
})


// TO : DO return the list of all seeds ownded by owner
app.get('/Seeds/:key', (req, res) => {
    const key = req.params.key
    if (!key){
        return res.status(403).send( {'success': false} )
    }
    else if (typeof key !== 'string'){
        return res.status(403).send( {'success': false} )
    }
    else{
        return  res.status(201).send( {'success': true} )
    }
})

app.post('/mintSeed', (req, res ) => {
    
    const { tokenID , bluePrint , publicKey  } = req.body;

    if (!tokenID ||  !bluePrint || !publicKey){
        return res.status(403).send( {'success': false} )
    }
    else if (typeof tokenID !== 'string' || typeof bluePrint !== 'string' || typeof publicKey  !== 'string'){
        return res.status(403).send( {'success': false} )
    }
    else {
        console.log(tokenID, bluePrint, publicKey);
        return res.status(201).send( {'success': true} )
    }
});



app.listen(PORT, () => console.log(`started and listening on port ${PORT}.`));