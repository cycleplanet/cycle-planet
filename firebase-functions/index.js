const functions = require('firebase-functions');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceaccount.json');
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();
var axios = require('axios');

const countryConstants = require('./shared/src/country-constants');
const geoapify = require('./shared/src/geoapify');

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
adminConfig.databaseURL = 'https://cycle-planet-292f5.firebaseio.com';

admin.initializeApp(adminConfig);

const db = admin.database();
const fs = admin.firestore()

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
  const databaseName = client.databasePath(projectId, '(default)');

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

exports.computeCountryMarkerCounts = functions.pubsub.schedule('0 */12 * * *').onRun(async (context) => {

  console.log('Running marker count aggregation per country');
  const fs = admin.firestore()
  console.log('Firestore inited');

  console.log('geoapify require', geoapify);
  const Geoapify = geoapify.Geoapify;
  const geocoder = new Geoapify(serviceAccount.geoapify_key)
  console.log('Geoapify inited');

  const countryMarkerCounts = {};
  Object.values(countryConstants.countryCodes_rev).forEach(cc => {
    countryMarkerCounts[cc] = {
      poi: 0,
      hosts: 0
    }
  });

  function countMarker(countedField, countryName) {
    if (!countryName) return;

    const cc = countryConstants.countryCodes_rev[countryName];
    if (!cc) return;

    countryMarkerCounts[cc][countedField]++;
  }

  markers = await fs.collection("Markers").get();
  markers.forEach((doc) => {
    const itemDetails = doc.data();
    if (itemDetails.refKey === 'Border_item') {
      countMarker('poi', itemDetails.country1.country);
      countMarker('poi', itemDetails.country2.country);
    } else {
      countMarker('poi', itemDetails.countryKey);
    }
  });

  usersSnapshot = await db.ref("Users").once('value');
  if (!usersSnapshot || !usersSnapshot['val'] || !usersSnapshot.val()) {
    users = [];
  } else {
    users = Object.values(usersSnapshot.val())
  }

  await Promise.all(users.map(async user => {
    if (!user.hosting || !user.hosting.status === 'Available for hosting') {
      console.log(`Skipping user ${user.id} because not a host`);
      return;
    }
    if (!(user.coordinates && user.coordinates.lat && user.coordinates.lng)) {
      console.log(`Skipping user ${user.id} because no coords`);
      return;
    }

    const hostCountryCode = await geocoder.reverseGeocodeToCountryCode(user.coordinates.lat, user.coordinates.lng);

    if (hostCountryCode) {
      countMarker('hosts', countryConstants.countryCodes[hostCountryCode])
      console.log(`Reverse geocoded user to ${countryConstants.countryCodes[hostCountryCode]}`);
    } else {
      console.log(`Skipping user ${user.id} because no country code for coords`)
    }
  }));

  Object.keys(countryMarkerCounts).forEach(cc => {
    db.ref(`CountryMarkerCounts/${cc}/hosts`)
            .set(countryMarkerCounts[cc].hosts)
            .catch((err) => console.error('Could not write host count for country', err));
    db.ref(`CountryMarkerCounts/${cc}/poi`)
            .set(countryMarkerCounts[cc].poi)
            .catch((err) => console.error('Could not write POI count for country', err));
  });

  console.log('Wrote counts');
});


exports.updateUserStats = functions.pubsub.schedule('0 */12 * * *').onRun((context) => {
  console.log('basTestFunction started');
  let d = new Date().toISOString();
  let d1 = d.split('T')
  let d2 = d1[0]
  console.log('basTestFunction 1',d);
  console.log('basTestFunction 2',d2);
 
  let total_users=0
  let type_of_users={}
  let users_in_country={}

  function typeUser(status) {
    if (!status) return;

    if(type_of_users[status]){
      type_of_users[status]++
    }else{
      type_of_users[status]=1
    }
  }

  return db.ref('Users').get().then(snapshot => {
    snapshot.forEach((user) => {
      total_users++
      typeUser(user.hosting.status);

    })
  }).then(_ => {
    console.log('basTestFunction 3rd return started',total_users);

    db.ref('Statistics/total_users').set(total_users)
    db.ref('Statistics/users_per_day_sum/'+d2).set(total_users)
    db.ref('Statistics/type_of_users').set(type_of_users)
    // db.ref('Statistics/users_in_country_test').set(users_in_country)
  })
})

exports.updateMarkerStats = functions.pubsub.schedule('0 */12 * * *').onRun((context) => {
  console.log('basTestFunction started');
  let d = new Date().toISOString();
  let d1 = d.split('T')
  let d2 = d1[0]
  console.log('basTestFunction 1',d);
  console.log('basTestFunction 2',d2);
 
  let total_markers=0
  let type_of_markers={}
  let markers_in_country={}
  
  Object.values(countryConstants.countryCodes_rev).forEach(cc => {
    markers_in_country[cc] = 0
  });

  function typeMarker(refKey) {
    if (!refKey) return;

    if(type_of_markers[refKey]){
        type_of_markers[refKey]++
    }else{
        type_of_markers[refKey]=1
    }
  }

  function countMarker(countryName) {
    if (!countryName) return;

    const cc = countryConstants.countryCodes_rev[countryName];
    if (!cc) return;

    markers_in_country[cc]++;
  }

  return fs.collection("Markers").get().then((markers) => {
    markers.forEach((doc) => {
      total_markers++
      const itemDetails = doc.data();
      typeMarker(itemDetails.refKey);

      if (itemDetails.refKey === 'Border_item') {
        countMarker(itemDetails.country1.country);
        countMarker(itemDetails.country2.country);
      } else {
        countMarker(itemDetails.countryKey);
      }
    });
  }).then(_ => {
    console.log('basTestFunction 3rd return started',total_markers);

    db.ref('Statistics/total_markers').set(total_markers)
    db.ref('Statistics/markers_per_day_sum/'+d2).set(total_markers)
    db.ref('Statistics/type_of_markers').set(type_of_markers)
  })
})
