/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

let API_LOCAL = 'http://localhost:3000',
    API_PRODUCTION = 'https://cycle-planet-backend.herokuapp.com'

// Configuration for your app
// https://v2.quasar.dev/quasar-cli/quasar-conf-js
// const path = require("path");
// const SitemapPlugin = require('sitemap-webpack-plugin').default

// const paths = [
//   { path: '/countries' },
//   { path: '/country' },
//   { path: '/country/Angola' },
//   { path: '/country/Togo' },
//   { path: '/about' },
//   { path: '/contact' },

// ]
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const { configure } = require('quasar/wrappers');

module.exports = configure(function (ctx) {
  return {
    // https://v2.quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://v2.quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli/boot-files
    boot: [
      'axios',
    ],

    // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.scss',
      'app.sass',
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      'fontawesome-v5',
      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      env:{
        // API: API_LOCAL // API_LOCAL | API_PRODUCTION
        API: ctx.dev
        ?API_LOCAL
        :API_PRODUCTION
      },
      vueRouterMode: 'history', // available values: 'history', 'history'

      chainWebpack (chain) {
        const nodePolyfillWebpackPlugin = require('node-polyfill-webpack-plugin')
        chain.plugin('node-polyfill').use(nodePolyfillWebpackPlugin)
      }

      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://v2.quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://v2.quasar.dev/quasar-cli/handling-webpack
      // extendWebpack(cfg, { isServer, isClient }) {
      //   cfg.resolve.alias = {
      //     ...cfg.resolve.alias, // This adds the existing alias
      //     // Add your own alias like this
      //     utils: path.resolve(__dirname, "./src/utils"),
      //   };
      //   cfg.plugins.push(
      //     new SitemapPlugin({
      //       base: 'https://cycleplanet.org/',
      //       paths,
      //       options: {
      //         filename: 'sitemap.xml',
      //         lastmod: true,
      //         changefreq: 'weekly',
      //       }
      //     })
      //   ),
      //   cfg.plugins.push(
      //     new CopyWebpackPlugin([{ context: `${__dirname}/src/assets`, from: `*.*` }])
      //   )
      // }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 7080,
      open: true, // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'en-US', // Quasar language pack
      // config: {
      //   brand:{
      //     primary: '#FCBA03',
      //     secondary: '#89aab4',
      //     accent: '#823dba',
      //   }
      // },

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'Dialog',
        'LocalStorage',
        'SessionStorage',
        'Notify',
        'Meta',
        'Loading',
      ]
    },

    animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://v2.quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'InjectManifest', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: `Cycle Planet`,
        short_name: `Cycle Planet`,
        description: `The Bike Touring Platform`,
        display: 'standalone', // standalone || browser || minimal-ui ||
        orientation: 'portrait',
        background_color: '#FCBA03',
        theme_color: '#FCBA03',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'cpq'
      },

      extendWebpack (/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      }
    }
  }
});
