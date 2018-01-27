const Translate = require('@google-cloud/translate');
const express = require('express');
require('./config');

// Your Google Cloud Platform project ID
const { projectId } = process.env;
// Instantiates a client
const translate = new Translate({ projectId });
const text = 'Hello, world!';
const app = express();
const port = 3000;

let languages = '';
let target = '';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function detectAndTranslateLanguages() {
  translate
    .detect(text)
    .then((results) => {
      let detections = results[0];
      detections = Array.isArray(detections) ? detections : [detections];

      console.log('Detections:');
      detections.forEach((detection) => {
        console.log(`${detection.input} => ${detection.language}`);
        translate
          .translate(text, target)
          .then((response) => {
            const translation = response[0];

            console.log(`Text: ${text}`);
            console.log(`Translation: ${translation}`);
          })
          .catch((err) => {
            console.error('ERROR:', err);
          });
      });
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}

// Lists available translation language with their names in English (the default).
function listLanguages() {
  translate
    .getLanguages()
    .then((results) => {
      [languages] = results;
      const randomNumber = getRandomInt(languages.length);
      target = languages[randomNumber].code;
      detectAndTranslateLanguages();
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}

app.get('/', (req, res) => {
  listLanguages();
  res.send('Hello world!');
});

app.listen(port, () => console.log(`app started on port ${port}`));
