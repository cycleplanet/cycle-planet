const functions = require('firebase-functions');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceaccount.json');
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();

const countryConstants = require('./shared/src/country-constants');
const axios = require('axios');
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

exports.computeCountryMarkerCounts = functions.pubsub.schedule('* */12 * * *').onRun((context) => {
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

exports.basTestFunction = functions.pubsub.schedule('every 100 minutes').onRun((context) => {
  let d = new Date().toISOString();
  let d1 = d.split('T')
  let d2 = d1[0]
  console.log('basTestFunction 1',d);
  console.log('basTestFunction 2',d2);
  const db = admin.database()
  const fs = admin.firestore()

  db.ref(`Statistics/test1`)
  .set(d)
  .catch((err) => console.error('Could not write POI count for country', err));

  db.ref(`Statistics/test2`)
  .set(d2)
  .catch((err) => console.error('Could not write POI count for country', err));

  const users={}
  const markers={}
  const type_of_users={}
  const type_of_markers={}
  const users_in_country={}

  function getCountryKey(lat,lng) {
    if (!lat || !lng) return;

    var config = {
      method: 'get',
      url: `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=7e3d1a2445de4208acce012cfce88cab`,
      headers: { }
    };
    
    axios(config)
    .then(function (response) {
      console.log('axios 1',response.data);
      console.log('axios 2',result.data.features[0].properties);
      console.log('axios 3',result.data.features[0].properties.country_code);
      if(!users_in_country[result.data.features[0].properties.country_code]){
        users_in_country[result.data.features[0].properties.country_code]=1
      }else{
        users_in_country[result.data.features[0].properties.country_code]++
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  db.ref('Users/').on('child_added', snapshot => {
    let userDetails = snapshot.val()
    let userId = snapshot.key 
    users[userId]=userDetails
    if(userDetails.hosting.status){
      if(!type_of_users[userDetails.hosting.status]){
        type_of_users[userDetails.hosting.status]=1
      }else{
        type_of_users[userDetails.hosting.status]++
      }
    }
    console.log('userDetails ',userDetails);
    if(userDetails.coordinates){
      console.log('userDetails.coordinates ',userDetails.coordinates);
      getCountryKey(userDetails.coordinates.lat,userDetails.coordinates.lng)
      console.log(' result getCountryKey',);
  }

  })
  
  fs.collection("Markers").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const itemDetails = doc.data();
      const itemId=doc.id
      
      markers[itemId]=itemDetails
      
      if(!type_of_markers[itemDetails.refKey]){
        type_of_markers[itemDetails.refKey]=1
      }else{
        type_of_markers[itemDetails.refKey]++
      }

    });
  });

  const totalUsers=Object.keys(users).length
  const totalMarkers=Object.keys(markers).length

  db.ref('Statistics/total_users').set(totalUsers)
  db.ref('Statistics/total_markers').set(totalMarkers)
  db.ref('Statistics/users_per_day_sum/'+d2).set(totalUsers)
  db.ref('Statistics/markers_per_day_sum/'+d2).set(totalMarkers)
  db.ref('Statistics/type_of_users').set(type_of_users)
  db.ref('Statistics/type_of_markers').set(type_of_markers)
  db.ref('Statistics/users_in_country_test').set(users_in_country)

  

  return null;
});

exports.basTestFunction2 = functions.pubsub.schedule('* */12 * * *').onRun((context) => {
  

  return null;
  
});
