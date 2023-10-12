import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';
import https from 'https';
import fs from 'fs';

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

  const client = new MongoClient(process.env.MONGO_CONNECT);
  await client.connect();
  const db = client.db("bicycle-store");

  const data = await db.collection("bikes").find({}).toArray();
  console.log(data);
  res.json(data);
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


const httpsServer = https.createServer({
	key: fs.readFileSync('/etc/letsencrypt/live/bicyclecollection.xyz/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/bicyclecollection.xyz/fullchain.pem')}, app);

httpsServer.listen(443, ()=> {
	console.log('HTTPS Server running on port 443')
});
/*
app.listen(port, () => {

  console.log(`Example app listening on port ${port}`)
})*/
