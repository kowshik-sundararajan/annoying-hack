const Translate = require('@google-cloud/translate');
const express = require('express');

// Your Google Cloud Platform project ID
const { projectId } = require('./config.js');
// Instantiates a client
const translate = new Translate({ projectId });
const text = 'Hello, world!';
const app = express();
const port = 3000;

let languages = '';
let target = '';
let translatedText = '';

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

        console.log('Detections:');
        detections.forEach((detection) => {
          console.log(`${detection.input} => ${detection.language}`);
          translate
            .translate(text, target)
            .then((response) => {
              const translation = response[0];
              console.log(`Text: ${text}`);
              console.log(`Translation: ${translation}`);

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
          resolve();
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

app.listen(port, () => console.log(`app started on port ${port}`));
