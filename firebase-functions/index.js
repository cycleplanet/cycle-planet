const functions = require('firebase-functions');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceaccount.json');
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();

const countryConstants = require('./shared/src/country-constants');

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
adminConfig.databaseURL = 'https://cycle-planet-292f5.firebaseio.com';

admin.initializeApp(adminConfig);

const db = admin.database();

exports.sendNotification = functions.https.onRequest((req, res) => {
  functions.logger.log("sendNotification req1", req);
  functions.logger.log("sendNotification req1", req.query);
  functions.logger.log("sendNotification res1", res);


  let registrationToken;
  functions.logger.log("req.query", req.query);

  const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  const ref = db.ref('Users/' + req.query.otheruserid);

  ref.once('value', function (snapshot) {
    let userRecord = snapshot.val();
    functions.logger.log("user data snapshot", snapshot.val());
    functions.logger.log("userRecord.token", userRecord.token);

    if (userRecord.token) {
      functions.logger.log('token exists');
      registrationToken = userRecord.token;
      functions.logger.log("req.query user data email registrationToken", registrationToken);
      const message_notification = {
        notification: {
          title: req.query.from,
          body: req.query.text,
        }
      };

      notifyUser(message_notification, registrationToken, res);
    } else {
      res.status(200).send('No Token Found');
    }


  });

});

function notifyUser(message_notification, registrationToken, res) {
  res.set('Access-Control-Allow-Origin', '*');
  admin
    .messaging()
    .sendToDevice(registrationToken, message_notification)
    .then((response) => {
      functions.logger.log('response:', response);
      res.status(200).send('Notification sent successfully');
    })
    .catch((error) => {
      res.status(400).send(error);
    });
}

// Replace BUCKET_NAME
const bucket = 'gs://cycle-planet-292f5';
exports.scheduledFirestoreExport = functions.pubsub
                                            .schedule('0 0 23 * *')
                                            .onRun((context) => {

  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const databaseName = 
    client.databasePath(projectId, '(default)');

  return client.exportDocuments({
    name: databaseName,
    outputUriPrefix: bucket,
    // Leave collectionIds empty to export all collections
    // or set to a list of collection IDs to export,
    // collectionIds: ['users', 'posts']
    collectionIds: []
    })
  .then(responses => {
    const response = responses[0];
    console.log(`Operation Name: ${response['name']}`);
  })
  .catch(err => {
    console.error(err);
    throw new Error('Export operation failed');
  });
});

exports.computeCountryMarkerCounts = functions.pubsub.schedule('*/1 * * * *').onRun((context) => {
  console.log('Running marker count aggregation per country');
  const countryMarkerCounts = {};
  const fs = admin.firestore()

  Object.values(countryConstants.countryCodes_rev).forEach(cc => {
    countryMarkerCounts[cc] = {
      poi: 0
    }
  });

  function countMarker(countryName) {
    if (!countryName) return;

    const cc = countryConstants.countryCodes_rev[countryName];
    if (!cc) return;

    countryMarkerCounts[cc].poi++;
  }

  return fs.collection("Markers").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const itemDetails = doc.data();
      if (itemDetails.refKey === 'Border_item') {
        countMarker(itemDetails.country1.country);
        countMarker(itemDetails.country2.country);
      } else {
        countMarker(itemDetails.countryKey);
      }
    });
    
    const countryCodes = Object.keys(countryMarkerCounts);
    console.log(`Got counts for ${countryCodes.length} countries`);
    countryCodes.forEach(cc => {
      db.ref(`CountryMarkerCounts/${cc}/poi`)
        .set(countryMarkerCounts[cc].poi)
        .catch((err) => console.error('Could not write POI count for country', err));
    });

    console.log('wrote POI counts');
    return null;
  }).catch(err => {
    console.error('Could not compute marker counts per country', err);
  });
});
