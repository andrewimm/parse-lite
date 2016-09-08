# ListItemDemo: A Parse Lite + React Native Demo

This demo uses Parse Lite to populate a ListView in React Native.

### Try it yourself

You can set this app to point to your Parse Server, and run it yourself.

1. Run `npm install` from this directory to install the development dependencies.

2. Put your Parse Server info into `./src/RemoteData.js`. At the top, you'll find a line that initializes a new `App` object. Within its options parameter, set `host` to be the path to your Parse Server, and set `applicationId` to be the id of your app.
  ```js
  // INITIALIZE HERE
  const app = new App({
    host: 'my.parse.server/path',
    applicationId: 'abc123',
  });
  ```

3. Open `./ios/ListViewDemo.xcodeproj` with XCode, and build the app.

4. Run the app in the Simulator. Your app should load up and point to your Parse Server. Any changes you make should be persisted when you refresh the app.
