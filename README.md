# Cycle Planet App [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is the repo for the official [Cycle Planet](https://cycleplanet.org/) platform. The platform is (soon) open source and free to use, which can be used to:
- Host bicycle tourers, or get hosted during your trip
- Find relevant information for on the road, such as visas and border crossings
- Plan your trip
- Find WhatsApp groups for the continent your going to cycle at
- Share your trips and stories

The platform is written in [Vue.js](https://vuejs.org/), and makes use of the [Quasar](https://quasar.dev/) framwork. By making use of [Cordova](https://cordova.apache.org/), an [Android](https://play.google.com/store/apps/details?id=com.cycleplanet.cycleplanet&hl=en&gl=US) app and [iOS](https://apps.apple.com/tt/app/cycle-planet/id1547132334) app built. For persistent storage and user account management, it uses Google's Firebase backend-as-a-service.

Problems, feedback or questions are welcome in [issues](https://github.com/bidsinga/cycle-planet/issues) or on our [Slack](https://join.slack.com/t/cycle-planet/shared_invite/zt-qloxugog-OOzaXfyO79vxalGAoFbHlA)


## Prerequisites

- [Node](https://nodejs.org/en/download/) version >=10 installed
- This project uses the [Npm](https://www.npmjs.com/) package manager
- A Google account to set up your Firebase project under

## Get started developing

Download or clone this repo, and then run the following command to install all dependencies:
```
npm install
```

Copy `src/boot/firebase.example.js` to `src/boot/firebase.js`.

Go to the [Firebase console](https://console.firebase.google.com/) to set up a Firebase project.

Once you have completed the wizard to set up the Firebase wizard, click the `</>` button to add a web app. Copy the `var firebaseConfig = ...` definition in the code snippet it gives you into `src/boot/firebase.js` from this repo, replacing the placeholder in there.

Start the app in development mode:
```
quasar d
```
or
```
quasar dev -m pwa
```

To be able to register and log in to your own development instance of CyclePlanet, enable the "Auth", "Database" and "Firestore" functionalities under "Build" in the menu on the left in the Firebase console.

Run on Android (cordova) - debug mode:
```
cd src-cordova
quasar dev -m cordova -T android
```
Run on iOS (cordova) - debug mode:
```
cd src-cordova
quasar build -m cordova -T ios
```
Run on Android (cordova) - build mode:
```
cd src-cordova
quasar build -m cordova -T android
```
## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
