# express-microservice

Node JS Express Microservice Starter Template

## Features

* Node JS, Express, Typescript base
* Backpack (webpack) based - build , development , packaging
* Swagger Enabled - Express swagger middleware
* Externalized Configuration - DotEnv
* Tests - Jasmine , SuperTest
* Code Coverage - Istanbul
* Code Quality - tslint
* Container support - Docker
* Prometheus integration
* API Response Logging
* Reactive Extensions support - RxJS
* CORS, JSONObject Limit
* Documentation - TypeDocs
* API Exception Handling Utilities
* Standard HTTP Codes for cleaner code
* Sample APIs, Patterns for reference
* VSCode Debug Launch Configuration

## Pre-requisites

Install npm and nodeJS

npm version >= 3.x
node version >= 6.x

## Install It

```
npm install
```

## Run It
#### Run in *development* mode:

```
npm run dev
```

#### Run in *production* mode:

```
npm run compile
npm start
```

#### Run in *VS Code debug* mode:

```
npm run compile
Press F5
```

#### Runs tests:

```
npm run test
```
#### Runs tests with code coverage:

```
npm run test:coverage
```

#### Build Docker image

```
./build-docker.sh
```

### Try It
* Point you're browser to [http://localhost:3000](http://localhost:3000)
* Invoke the example REST endpoints directly or via swagger `http://localhost:3000/api`
* Invoke the prometheus metrics using the endpoint `curl http://localhost:3000/metrics`
   
### FAQ

* tslint appearing in VSCode IDE
```
// Configure glob patterns of file paths to exclude from linting
"tslint.exclude": "**/node_modules/**/*.ts"
```

### License
MIT

