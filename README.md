
# Georgia Tech Course Surveys

Helping students assess course difficulty and workload ([omscentral.com](https://omscentral.com)).

## Stack

| Where    | Technologies |
|----------|--------------|
| Client   | [Angular](https://angularjs.org), [Angular Material](https://material.angularjs.org), [Fuse Angular Material](fuse-angular-material.withinpixels.com) |
| Server   | [Node](https://nodejs.org) |
| Database | [Firebase](https://firebase.google.com) |

## Environments

| What         | Where |
|--------------|-------|
| Local Client | [http://localhost:3000](http://localhost:3000) |
| Local Server | [http://localhost:5000](http://localhost:5000) |
| Dev Client   | [https://gt-course-surveys-dev.firebaseapp.com](https://gt-course-surveys-dev.firebaseapp.com) |
| Dev Server   | [https://gt-course-surveys-dev.herokuapp.com](https://gt-course-surveys-dev.herokuapp.com) |
| Prd Client   | [https://omscentral.com](https://omscentral.com) |
| Prd Client   | [https://gt-surveyor.firebaseapp.com](https://gt-surveyor.firebaseapp.com) |
| Prd Server   | [https://gt-course-surveys-prd.herokuapp.com](https://gt-course-surveys-prd.herokuapp.com) |

## Getting Started

### Install `npm` and `gulp`

Follow the instructions [here](https://docs.npmjs.com/getting-started/installing-node) to install `npm`.

Once `npm` installed, install `gulp` with the `sudo npm install -g gulp` command.

### Clone Repo

```bash
$ cd ...
$ git clone https://bitbucket.org/mehmetbajin/gt-course-surveys
```

Here, `...` can be any directory of your choice. The ellipses are reused to refer to this directory in the rest of this README.

### Local Server

```bash
$ cd .../gt-course-surveys/server
$ npm install
$ nodemon
```

This starts a local server listening on port 5000. The server is very lightweight and has two responsibilities:

1. Maintain up-to-date course review aggregations.
2. Expose the `GET /aggregation/:id` API for a given course's review aggregation.

### Local Client

```bash
$ cd .../gt-course-surveys/client
$ npm install
$ bower install
$ bash deploy/local-watch.sh
```

This starts a local server listening on port 3000 that serves the static assets for the app.
The assets are served unminified to help with debugging.

## Running Unit Tests

```bash
$ cd .../gt-course-surveys/client
$ gulp test
```

When the tests are done, you can examine the coverage report from `.../gt-course-surveys/client/coverage/Chrome .../index.html`.

Note: Before running the tests, comment out the following modules:

From `.../gt-course-surveys/src/app/main/pages/pages.module.js`:

* app.pages.error-404
* app.pages.error-500

From `.../gt-course-surveys/src/app/index.module.js`:

* app.reviews
* app.grades

TODO: Determine why these modules need to be excluded from the app for the tests to run without errors.

## Running E2E Tests

```bash
$ cd ~/Desktop/gt-course-surveys/client
$ gulp protractor
```

## Deploying

Before submitting the pull request:

1. Run all unit tests (must pass with 100% coverage).
2. Run all E2E tests (must pass).
3. Build and compile the client to make sure there are no errors:

```bash
$ cd .../gt-course-surveys/client
$ bash deploy/local.sh
```

Once the pull request is submitted, the changes will be deployed for you after verification.
