# PSC Companion
A React Native based application for interfacing with [data.psc.ac.uk](https://data.psc.ac.uk), among others.

----

You're currently looking at the source code repository. After the app? It's available at [Google Play](https://play.google.com/store/apps/details?id=com.psccompanion).

## Structure

Latest changes are on the master branch. The currently released version is on the deployGooglePlay branch. Development and releases are usually very close, so there won't be much difference between them. A hacky web port is on the web branch.

Relevant JS files are stored in `app/`. Screens seen in the app are stored in `app/screens/`. Currently, screens may define more than one React component, but I'm intending to split this up further.

## Development

Any native code changes require a new app package to be compiled (which means having hefty SDKs installed). However, this is usually rare as almost all functionality is composed in JavaScript. Assuming you have a development build installed on your mobile device, all you need is to `npm install && npm start` to install dependencies and run the packager.

If you want a development APK, ping me a message and I'll more than happily provide one.

If you have any changes you wish to merge upstream, feel free to open a pull request on my Gogs system.

#### A small to-do list:

- Tests! (not necessarily everything, but the hacky timetable calculations could do with a few)
- Prettier UI
- Improved session management for attendance and printing scraping. Quite honestly, I'm not sure how the Intranet session exists to begin with. It's a mixed bag for each device.
- A good tidy up...
- Some smarter caching (I'm thinking more transparently, load the cache and present to the user while fetching new data)

## License

This project is currently unlicensed, but I request that you don't publish versions without making it obvious that your's isn't the official version. Also make a credit to me as the original author.
