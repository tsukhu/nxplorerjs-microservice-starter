# express-microservice

Node JS Express Reactive Microservice Starter Template
This project provides complete Node JS based microservices template with all that will be needed features for production deployment , monitoring , debugging , logging , security. Reactive extensions based samples are added as well to demonstrate how this can be used for building a microservice API edge-service or use it as a base for building any kind of microservice.

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
* API Response Logging , Express Server Logging , UUID propogation - Bunyan
* Reactive Extensions support - RxJS
* CORS, JSONObject Limit , Helmet - Express Security
* Documentation - TypeDocs
* API Exception Handling Utilities
* Standard HTTP Codes for cleaner code
* Sample APIs, Patterns for reference
* APIs
   - examples - Basic examples with a search by ID example from the jsonplaceholder API (/examples/:id)
   - shop     - Example of how to use Reactive Extensions for API orchestration (FlatMap) (/shop/priceByOptionId/:id)
   - starwars - Example of how to use Reactive Extensions for API orchestration (ForkJoin) (/starwars/people/:id)
   - Use swagger UI for the complete list of sample APIs
   - metrics  - Prometheus based metrics added for all APIs
* VSCode Debug Launch Configuration (Preconfigured Debug Launcher added)

## Pre-requisites

Install npm and nodeJS

npm version >= 3.x
node version >= 6.x

## Install It

```
npm install
```
## Setup *external environment*

* Edit the .env file
* Update the LOG_DIRECTORY with absolute path of the log directory
* In the case of container deployment this could be a mounted drive as well

```
...
LOG_DIRECTORY=E:/workspace/express-microservice-starter/logs/

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

* tslint error appearing in VSCode IDE for node_modules
```
// Configure glob patterns of file paths to exclude from linting
"tslint.exclude": "**/node_modules/**/*.ts"
```
### Credits

* The initial base project was generated using [generator-express-no-stress-typescript project](https://github.com/cdimascio/generator-express-no-stress-typescript) 

### License

MIT

