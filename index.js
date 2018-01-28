const Translate = require('@google-cloud/translate');
const express = require('express');
const bodyParser = require('body-parser');

// Your Google Cloud Platform project ID
const { projectId } = require('./config.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let text = '';
let languages = '';
let target = '';
let translatedText = '';

// Instantiates a client
const translate = new Translate({ projectId });

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function detectAndTranslateLanguages() {
  return new Promise((resolve, reject) => {
    translate
      .detect(text)
      .then((results) => {
        let detections = results[0];
        detections = Array.isArray(detections) ? detections : [detections];
        detections.forEach(() => {
          translate
            .translate(text, target)
            .then((response) => {
              const translation = response[0];
              resolve(translation);
            })
            .catch((err) => {
              console.error('ERROR:', err);
              reject(err);
            });
        });
      })
      .catch((err) => {
        console.error('ERROR:', err);
        reject(err);
      });
  });
}

// Lists available translation language with their names in English (the default).
function listLanguages() {
  return new Promise((resolve, reject) => {
    translate
      .getLanguages()
      .then((results) => {
        [languages] = results;
        const randomNumber = getRandomInt(languages.length);
        target = languages[randomNumber].code;
        detectAndTranslateLanguages().then((response) => {
          translatedText = response;
          resolve(languages[randomNumber].name);
        });
      })
      .catch((err) => {
        console.error('ERROR:', err);
        reject();
      });
  });
}

app.get('/', (req, res) => {
  listLanguages().then(() => {
    res.send(translatedText);
  })
    .catch((err) => {
      console.error(err);
      res.send('There was an error!');
    });
});

app.post('/', (req, res) => {
  text = req.body.text.substring(1, 5000);
  listLanguages().then((targetLanguage) => {
    res.send({ translatedText, targetLanguage });
  })
    .catch((err) => {
      console.error(err);
      res.send('There was an error!');
    });
});

app.listen(port, () => console.log(`app started on port ${port}`));
