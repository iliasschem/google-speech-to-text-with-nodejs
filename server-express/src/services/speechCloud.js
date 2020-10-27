const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');


async function speechToText() {
  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  const fileName = path.join(__dirname + '/../../audios/file.wav');

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };
  const config = {
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [operation] = await client.longRunningRecognize(request);

  const [response] = await operation.promise();

  const transcription = response.results
  .map(result => result.alternatives[0].transcript)
  .join('\n');
  return transcription;
}
module.exports = speechToText;