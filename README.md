# Parse Lite - The universal JS library for Parse Server
[![Build Status][build-status-svg]][build-status-link]
[![License][license-svg]][license-link]

Parse Lite is a lightweight SDK for
[Parse Server](https://github.com/ParsePlatform/Parse-Server). It handles all of
the complexities of authentication and interchange, leaving you with the
freedom to build your app as you see fit. The best part? It's completely
unopinionated about your environment. The same code will run the same way in the
browser, in Node JS, or on React Native, because it does not produce any side
effects in the global environment. Functionality like offline storage or user
persistence is left for add-on packages, because we believe in a core SDK that
provides straightforward server communication and does only what you ask of it.

Parse Lite takes a functional approach to creating, modifying, and retrieving
data from your Parse Server. Each query, mutation, and fetch generates a new
immutable instance, so you can be sure that your application isn't plagued by
unintended side effects.

This is great for building server applications where keeping mutable objects
in shared memory can have dangerous implications. Modifying an object ensures
that the original copy remains unviolated in all other contexts where it might
be used.

This also makes it easy to build reactive applications using tools like React
and Redux. If two objects are equal in memory, you know no change has occurred.
If they're not equal, you know it's necessary to trigger an update or re-render
part of the UI. [See a demo app](demos/react-redux/).

## Creating an object

In this library, objects on your Parse server are implemented as simple
key-value maps. This means creating an object is simple:

```js
let player = { name: 'Andrew', score: 0 };
// That's it!
```

Want to reference an already-existing object? Include the `objectId` field.

You'll notice that the class name is not a property of the object. That's
intentional – the class name determines *where* to put the object, it is not a
property of the object. You'll see how class names are used to direct saves
and fetches later on.

## Modifying an object

Objects are modified through `Ops`. These operations provide basic access to
setting and unsetting properties, as well as atomic operations like incrementing
or decrementing counts, or modification of array fields.

### Set operations

Set operations establish the value of fields on your object. They overwrite any
prior value.

```js
import {Ops} from 'parse-lite';

// Assuming player was already created somewhere in the application
let updatedPlayer = Ops.set(player, { verified: true });
// updatedPlayer.verified is now true
```

Earlier, we initialized an object with a few fields. For an unsaved object, this
is the equivalent of setting those fields on an initially-empty object.

```js
// The following two operations are the same:
let player1 = { name: 'Andrew', score: 0 };
let player2 = Ops.set({}, { name: 'Andrew', score: 0 });
```

### Unset operations

Want to remove a field from an object? `Ops.unset` will handle that.

```js
// Remove the 'verified' field from player
let updatedPlayer = Ops.unset(player, 'verified');
```

### Increment operations

Numeric fields can be atomically incremented by any amount. When the request
hits the server, the operation will be made on the current value of the
database, allowing transactions to take place without knowing the initial value.

`Ops.increment` takes the object to be updated, as well as the field that will
be modified. It can take an optional third argument that specifies the numeric
amount to increment by (negative and float values are supported).

```js
// By default, increments the score by 1
let plusOne = Ops.increment(player, 'score');

// Increments the score by 10
let plusTen = Ops.increment(player, 'score', 10);

// Decrements the score by 5
let minusFive = Ops.increment(player, 'score', -5);

// Increments the score by 0.5
let plusHalf = Ops.increment(player, 'score', 0.5);
```

### Add-to-array operations

Array fields have a number of possible atomic operations. The first is
`Ops.add`, which adds the provided value to the end of the array without needing
to know its initial value.

```js
// Add the string '#latergram' to the 'tags' field
let updated = Ops.add(photo, 'tags', '#latergram');
```

### Remove-from-array operations

Similarly, values can be atomically removed from array fields. `Ops.remove` will
remove all instances of a value from an array field.

```js
// Remove all instances of the string '#latergram' from the 'tags' field
let updated = Ops.remove(photo, 'tags', '#latergram');
```

### Add-unique-to-array operations

Sometimes you want to only add a value to an array if it's not already there.
`Ops.addUnique` handles this behavior.

```js
// Adds '#tbt' to the 'tags' field IF it's not already contained
let updated = Ops.addUnique(photo, 'tags', '#tbt');
```

## Establishing a connection with a server

All of these modifications are useless if we can't persist them to the server.
Saves and queries require first establishing to a specific application and
server. This is done by creating an `App`.

`App` takes a number of options at creation. Not all of them may be necessary
for your particular application. At the very least, you will need to include
a Server URL and an Application ID.

```js
import {App} from 'parse-lite';

let app = new App({
  host: 'my.parse.server/path', // Required
  applicationId: 'MyAppId', // Required

  masterKey: 's3cret!', // Only for servers that need universal data access
});
```

This `App` object will be used to make all network requests to the server.
Having multiple `App` objects lets you communicate with multiple Parse apps from
the same program, if that's something you want to do.

Under the hood, `App` uses [I-Beam](https://github.com/andrewimm/ibeam) to
communicate with your server, and it supports all of the options that I-Beam
Clients support. If you're using Parse Lite in a Node environment, you'll need
to configure your `App` to use I-Beam's HTTP Controller, like so:

```js
import {App} from 'parse-lite';
import HttpController from 'ibeam/http-node';

let app = new App({
  host: 'my.parse.server/path',
  applicationId: 'MyAppId',
  httpController: HttpController, // <--
  masterKey: 's3cret!',
});
```

This may change in the future, but for now Parse Lite embraces a philosophy of
letting developers be explicit about exactly what they want.

## Saving an object

The `Save` method allows you to store or update an object, as long as you
provide information on where it's stored. This is an `App` object specifying the
server data, and a class name determining which table the object is placed in.

```js
// Creates an object with a 'count' field set to 5
// Stores it in the 'MyClass' table associated with `app`
Save(app, 'MyClass', { count: 5 })
```

Saving is an asynchronous process, and calls to `Save` will return a JavaScript
`Promise` that is resolved when the server responds. If the process was
successful, the `Promise` will be resolved with an updated version of the object
that was saved. If an error occurred, the `Promise` will be rejected. Because
this library is focused on functional objects that don't share mutable state,
the object returned is completely different from the object that was originally
saved. Modifying one will not modify the other. This way, each object can
represent the state of that data at different points in time.

```js
let obj = Ops.Increment({}, 'count');
Save(app, 'MyClass', obj).then((result) => {
  // result is the saved version of obj
  // It has the latest server state of all modified fields
  console.log('The count is now', result.count);
}, (err) => {
  console.log('An error occurred:', err);
});
```

## Fetching objects from the server

Once objects have been saved to the server, you'll want a way to retrieve them.
The `Query` module provides functionality to fetch objects, either directly or
through database queries.

### Getting a specific object

Fetching an object by its `objectId` is simple, and can be done with the
`Query.get` method. Provided an `App`, a class name, and an object id, `get`
will return a `Promise` that is resolved with the object, should it be found.
If an error occurs, or the object is not found, the `Promise` will be rejected
with the error.

```js
import {Query} from 'parse-lite';

// Fetch the Item with objectId 'abc123'
Query.get(app, 'Item', 'abc123').then((result) => {
  // `result` is the object
  // Now you can do something with it!
}, (err) => {
  console.log('An error occurred:', err);
});
```

### Querying for multiple objects

Queries are constructed in a similar method to object mutations. At a basic
level, they are simply JSON payloads that implement the Parse Server query
format. The `Query` module provides developer-friendly ways to create these
objects and refine them. Just like an object mutation, each new query mutation
generates a new query object, so that you can build off of queries in a
non-destructive manner.

`Query.find` takes an `App`, a class name, and a query representation object.
It returns a `Promise` that is resolved with an array of objects matching the
query constraints. If an error occurs, the `Promise` will be rejected with the
error.

```js
// fetch the first 10 objects from the Item class
Query.find(app, 'Item', {limit: 10}).then((objects) => {
  // objects is an array of Item results
}, (err) => {
  console.log('An error occurred:', err);
});
```

### Querying with no filters or constraints

The most basic query retrieves objects with no filtering, and the server's
default constraints. With no options, this query can be represented as an empty
JS Object.

```js
let q = {}; // No constraints
Query.find(app, 'Item', q);
```

You can also use a query object that has been initialized to the default values.
This is constructed by calling `Query.emptyQuery()`.

### Finding objects with specific values

`Query.equalTo` adds a constraint to fetch objects where a field matches a
specific value. It takes a query object, a field, and the value to match.

```js
// Filter for objects where 'flagged' equals true
let q1 = Query.equalTo({}, 'flagged', true);
// Also filter for objects where 'draft' equals false
let q2 = Query.equalTo(q1, 'draft', false);
```

`equalTo` is also used to return rows where an array field contains a specific
value.

```js
// Filter for objects where 'tags' contains "hot"
let q3 = Query.equalTo(q2, 'tags', 'hot');
```

If you need to locate array fields than contain more than one specific value,
you can use `Query.containsAll`. Similar to using `equalTo` on an array field,
it takes a query object, a field, and an array of values to match.

```js
// Fetch objects that have all three tags
let q = Query.containsAll({}, 'tags', ['new', 'local', 'promoted']);
```

You can also locate objects where a field is *not* equal to a specific value.
`Query.notEqualTo` takes similar arguments: a query object, a field, and the
value you do not want to match.

```js
// Filter where 'color' is not "red"
let notRed = Query.notEqualTo({}, 'color', 'red');
```

> Developer note: databases typically cannot optimize queries that look for
> fields that are not equal to something. This type of query suggests that
> you're matching nearly all possible values, which can involve scanning the
> entire table. Use this type of query sparingly, and consider improving your
> server performance by rewriting your query to avoid "not equals" expressions.

### Matching multiple values

If you want to fetch objects that match anything in a set of values, you can
do so without running multiple queries. `Query.containedIn` takes a query
object, a field, and an array of values you want to match.

```js
// Fetch only rows with primary colors
let primary = Query.containedIn({}, 'color', ['red', 'yellow', 'blue']);
```

You can also fetch objects that don't match a group of values.
`Query.notContainedIn` takes a query object, a field, and an array of values to
not match. The same concerns about inequality performance exist for this query.

### Inequality queries

Fields that are directly comparable – `number`s, `string`s, and `Date`s – can be
fetched with inequality constraints. Queries support `lessThan`,
`lessThanOrEqualTo`, `greaterThan`, and `greaterThanOrEqualTo` filters. Each one
takes a query object, a field, and the value you want to compare to.

```js
// Fetch all ratings between 2 and 4, inclusive
let midrange = Query.greaterThanOrEqualTo({}, 'rating', 2);
midrange = Query.lessThanOrEqualTo(midrange, 'rating', 4);
```

### Fetching where fields are set (or unset)

`Query.exists` and `Query.doesNotExist` allow matching objects where a field is
set or unset. They both take a query object and a field.

```js
// Fetch all players with a nickname
let haveNick = Query.exists({}, 'nickname');

// Fetch all players without a nickname
let noNick = Query.doesNotExist({}, 'nickname');
```

### String matching

You can match fields that contain a specific substring with `Query.contains`,
`Query.startsWith`, and `Query.endsWith`. Each takes a query object, a field,
and the substring you want to match.

```js
// Extract paths that begin with "https://" and end with ".js"
let resources = Query.startsWith({}, 'path', 'https://');
resources = Query.endsWith(resources, 'path', '.js');
```

### Filtering with GeoPoints

`GeoPoint` fields support querying by distance. You can search for points within
a geographic rectangle, or within some radius of a single point.
`Query.withinRadians` takes a query object, a field, a `GeoPoint` to begin
searching from, and a maximum search distance (in radians). Similarly, you can
filter using `Query.withinMiles` or `Query.withinKilometers`, which take the
same arguments.

```js
// Search for restaurants within 5 miles of userLocation
let nearby = Query.withinMiles({}, 'location', userLocation, 5);
```

Parse Server also supports fetching objects contained within the rectangle
formed by two `GeoPoint`s. `Query.withinGeoBox` takes a query object, a field,
and two `GeoPoint`s representing the corners of the box to search within.

```js
// Where southwest and northeast are two GeoPoints
let withinBox = Query.withinGeoBox({}, 'location', southwest, northeast);
```

## Destroying an object

The `Destroy` method allows you to destroy an object on the server. Provided an
`App`, a class name, and a reference to the object, `Destroy` will return a
`Promise` that is resolved when the object is destroyed. If an error occurs,
the `Promise` will be rejected with the error.

```js
// Destroy the Item with objectId 'abc123'
Destroy(app, 'Item', 'abc123').then((result) => {
  // the object was destroyed
}, (err) => {
  console.log('An error occurred:', err);
});
```

Additionally, passing a local copy of the object will work.
```js
let obj = { objectId: 'abc124' };
Destroy(app, 'Item', obj).then((result) => {
  // the object was destroyed
}, (err) => {
  console.log('An error occurred:', err);
});
```

[build-status-svg]: https://travis-ci.org/andrewimm/parse-lite.svg?branch=master
[build-status-link]: https://travis-ci.org/andrewimm/parse-lite
[license-svg]: https://img.shields.io/badge/license-BSD-lightgrey.svg
[license-link]: https://github.com/andrewimm/parse-lite/blob/master/LICENSE
