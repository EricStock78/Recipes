import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';
import https from 'https';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../build')));

const port = 4000;

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.get('/api/bicycles', async (req, res) => {
  const { authorization } = req.headers;
  console.log(authorization);

  if( authorization == null ) {
    return res.status(400).json({ message: 'Authorization needed' })
  }

  try {
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(400).json({ message: 'Unable to verify token' });

      console.log(decoded);

      //const { id } = decoded




    const client = new MongoClient(process.env.MONGO_CONNECT);
    await client.connect();
    const db = client.db("bicycle-store");

    const data = await db.collection("bikes").find({}).toArray();
    console.log(data);
    res.json(data);
  });
  }
    catch( error ) {
    return res.status(500).json({ message: 'error validating user' });
  }


})

app.post('/api/removeBicycle', async (req, res) => {
  
  const client = new MongoClient(process.env.MONGO_CONNECT);
  await client.connect();
  const db = client.db("bicycle-store");
  const result = await db.collection("bikes").deleteOne({name:req.body.bikename});
  console.log(result.deletedCount);
  
  const data = await db.collection("bikes").find({}).toArray();
  res.json(data);
})

app.get('/api/login', async ( req, res ) => {
  jwt.sign({ "name": "Eric", "accountID": 12 }, process.env.JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
    if (err) {
        res.status(500).json(err);
    }
    res.status(200).json({ token });
  });




})


/*const httpsServer = https.createServer({
	key: fs.readFileSync('/etc/letsencrypt/live/bicyclecollection.xyz/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/bicyclecollection.xyz/fullchain.pem')}, app);

httpsServer.listen(443, ()=> {
	console.log('HTTPS Server running on port 443')
});*/

app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})
