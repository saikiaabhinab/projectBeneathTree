const express = require('express');
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer'); // Import the correct function



const app = express();
const port = 3000;


const dotenv = require('dotenv');
dotenv.config()

let signedUrl;

app.get('/get-signed-url', (req, res) => {

  if (!signedUrl || Date.now() > signedUrl.lastTime) {
    const url = getSignedUrl({
      url: "https://d2tedsjy9sw39b.cloudfront.net/img.png",
      dateLessThan: new Date(Date.now() + 1000 * 60),
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID
    })
    console.log(url)
    signedUrl = {
      url: url,
      lastTime: url.match(/Expires=(\d+)/)[1] * 1000
    }

  }


  const imgtag = `<img src="${signedUrl.url}"></img>`

  if (new Date() > signedUrl.lastTime) {
    return res.status(403).send('Access Denied'); // Expired, send "Access Denied" response
  }

  res.send(imgtag);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

1691695742729
1691695713000
