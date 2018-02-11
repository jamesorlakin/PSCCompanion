# PSC Companion
A React Native based application for interfacing with [data.psc.ac.uk](https://data.psc.ac.uk), among others.

----

You're currently looking at the source code repository. After the app? It's available at [Google Play](https://play.google.com/store/apps/details?id=com.psccompanion) for Android or [Expo](https://expo.io/@jamesorlakin/psc-companion-expo) as a workaround for iOS.

## Structure

Latest changes are on the master branch. Currently released versions are on the deployGooglePlay and iOSExpo branches. Development and releases are usually very close, so there won't be much difference between them.

Relevant JS files are stored in `app/`. Screens seen in the app are stored in `app/screens/`, though a notable exception is the login screen. Additionally, screens may define more than one React component, but I'm intending to split this up further.

## Development

Any native code changes require a new app package to be compiled (which means having hefty SDKs installed). However, this is usually rare as almost all functionality is composed in JavaScript. Assuming you have a development build installed on your mobile device, all you need is to `npm install && npm start` to install dependencies and run the packager.

If you want a development APK, ping me a message and I'll more than happily provide one.

If you have any changes you wish to merge upstream, feel free to open a pull request on my Gogs system.

#### A small to-do list:

- Tests! (not necessarily everything, but the hacky timetable calculations could do with a few)
- Prettier UI
- Improved session management for attendance scraping
- A good tidy up...

## License

This project is currently unlicensed, but I request that you don't publish versions without making it obvious that your's isn't the official version. Also make a credit to me as the original author.
