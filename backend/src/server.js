import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';
import https from 'https';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { google} from 'googleapis';

const oauthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:4000/api/google/oauth',
)

const getGoogleOauthURL = () => {
   return oauthClient.generateAuthUrl( {
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]
   })
}

const googleOauthURL = getGoogleOauthURL();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../build')));

const port = 4000;

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
})

const getAccessAndBearerTokenUrl = ({access_token}) =>
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;

//TODO handle processing callback after user authenticates with google
app.get('/api/google/oauth', async (req,res) => {
    console.log("Hit callback route");

    //get code from url parameter
    const { code } = req.query;
    console.log(code);

    const { tokens } = await oauthClient.getToken(code);
    console.log(tokens);

    const url = getAccessAndBearerTokenUrl( tokens );
    console.log(url);

    const myHeaders = new Headers();
    const bearerToken = "Bearer "+tokens.id_token;
    myHeaders.append("Authorization", bearerToken);

   const requestOptions = {
     method: 'GET',
     headers: myHeaders,
     redirect: 'follow'
   };

  fetch(url, requestOptions)
    .then(response => response.json())
    .then(result =>  {
      console.log(result)
      //generate JWT
      jwt.sign({ "email": result.email, "name": result.name }, process.env.JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
        if (err) {
            res.status(500).json(err);
        }
        //redirect the user to the login page with JWT attached
        res.redirect(`http://localhost:4000?token=${token}`)
      });
    })
    .catch(error => {
      console.log('error', error);
      res.status(500).json(err); 
    });
      
  })

app.get('/api/google/oauthURL', (req, res) => {
  res.status(200).json({"url": googleOauthURL});
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
      if (err) 
      {
        return res.status(400).json({ message: 'Unable to verify token' });
      }
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
