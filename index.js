const Translate = require('@google-cloud/translate');
require('./config');

// Your Google Cloud Platform project ID
const { projectId } = process.env;

// Instantiates a client
const translate = new Translate({ projectId });

let languages = '';
let target = '';
const text = 'Hello, world!';

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
      target = languages[2].code;
      detectAndTranslateLanguages();
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}

listLanguages();
