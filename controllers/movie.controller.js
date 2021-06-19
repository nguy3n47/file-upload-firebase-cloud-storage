const Movie = require('../models/movie');
const firebase = require('../firebase');

exports.create = (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).send('Error, could not upload file');
      return;
    }
    // Create new blob in the bucket referencing the file
    const blob = firebase.bucket.file(req.file.originalname);

    // Create writable stream and specifying file mimetype
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobWriter.on('error', (err) => next(err));

    blobWriter.on('finish', async () => {
      // Assembling public URL for accessing the file via HTTP
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        firebase.bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`;

      // Save to database
      await Movie.create({ poster: publicUrl });

      // Return the file name and its public URL
      res.status(200).send({ poster: publicUrl });
    });

    // When there is no more data to be consumed from the stream
    blobWriter.end(req.file.buffer);
  } catch (error) {
    res.status(400).send(`Error, could not upload file: ${error}`);
    return;
  }
};
