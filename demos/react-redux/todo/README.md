A simple Todo app with **Parse Lite**, **React**, and **Redux**

### Try it yourself

You can set this app to point to your Parse Server, and run it yourself.

1. Run `npm install` from this directory to install the development dependencies.

2. Put your Parse Server info into `./redux/Actions.js`. At the top, you'll find a line that initializes a new `App` object. Within its options parameter, set `host` to be the path to your Parse Server, and set `applicationId` to be the id of your app.
  ```js
  // INITIALIZE HERE
  const app = new App({
    host: 'my.parse.server/path',
    applicationId: 'abc123',
  });
  ```

3. Run `npm run build` to compile your app. You'll need to run this whenever you make changes.

4. Open `index.html` in this directory. Your simple Todo app should load up and point to your Parse Server. Any changes you make should be persisted when you refresh the app.
