/*
    dependencies
*/

const express = require('express')
const admin = require('firebase-admin');
let inspect = require('util').inspect
let Busboy = require('busboy');
let path = require('path')
let os = require('os')
let fs = require('fs')
let UUID = require('uuid-v4')

/*
    config -express
*/
const app = express()
const port = 3000

/*
    config -firebase
*/

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "cycle-planet-292f5.appspot.com"
});

const db = admin.firestore();
let bucket = admin.storage().bucket();

/*
    endpoint - getPost
*/

// app.get('/posts', (request, response) => {
//     response.set('Access-Control-Allow-Origin', '*')
//     let posts=[]
//     db.collection('Posts').get().then(snapshot=>{
//         snapshot.forEach((doc) => {
//             console.log(doc.id, '=>', doc.data());
//             posts.push(doc.data())
//             });
//     response.send(posts)
//     })
// })
// app.get('/countries', (request, response) => {
//     response.set('Access-Control-Allow-Origin', '*')
//     let countries=[]
//     db.collection('countries').get().then(snapshot=>{
//         snapshot.forEach((doc) => {
//             console.log(doc.id, '=>', doc.data());
//             countries.push(doc.data())
//             });
//     response.send(countries)
//     })
// })
app.get('/markers', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
  let markers={}
  db.collection('Markers').get().then(snapshot=>{
    snapshot.forEach((doc) => {
    markers[doc.id]=doc.data()
  });
  console.log('backend', markers)
  response.send(markers)
  })
})

/*
    endpoint - getPost
*/
app.post('/createPost', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
  
    let uuid = UUID()
  
    var busboy = new Busboy({ headers: request.headers });
  
    let fields = {}
    let fileData = {}
  
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      // /tmp/4564564-234234.png
      let filepath = path.join(os.tmpdir(), filename)
      file.pipe(fs.createWriteStream(filepath))
      fileData = { filepath, mimetype }
    });
  
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      fields[fieldname] = val
    });
  
    busboy.on('finish', function() {
      
      bucket.upload(
        fileData.filepath,
        {
          uploadType: 'media',
          metadata: {
            metadata: {
              contentType: fileData.mimetype,
              firebaseStorageDownloadTokens: uuid
            }
          }
        },
        (err, uploadedFile) => {
          if (!err) {
            createDocument(uploadedFile)
          }
        }
      )
  
      function createDocument(uploadedFile) {
        db.collection('Posts').doc(fields.id).set({
          id: fields.id,
          caption: fields.caption,
          location: fields.location,
          date: parseInt(fields.date),
        //   imageUrl: `https://firebasestorage.googleapis.com/v0/b/${ bucket.name }/o/${ uploadedFile.name }?alt=media&token=${ uuid }`
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${ bucket.name }/o/${ uploadedFile.name }?alt=media&token=${ uuid }`
        }).then(() => {
          response.send('Post added: ' + fields.id)
        })
      }
    });
  
    request.pipe(busboy)
  })


/*
    listen
*/
app.listen(process.env.PORT||3000)

// npm start
// http://localhost:3000/posts
