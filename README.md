# express-microservice-starter
[![Build Status](https://travis-ci.org/tsukhu/express-microservice-starter.svg?branch=master)](https://travis-ci.org/tsukhu/express-microservice-starter)
---

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
* Container support - Docker , Kubernetes Clusters
* Prometheus integration
* API Response Logging , Express Server Logging , UUID propogation - Bunyan
* Reactive Extensions support - RxJS
* CORS, JSONObject Limit , Helmet - Express Security
* Documentation - TypeDocs
* API Exception Handling Utilities
* Standard HTTP Codes for cleaner code
* Sample APIs, Patterns for reference
* Sonar Qube integration
* APIs
   - examples - Basic examples with a search by ID example from the jsonplaceholder API (/examples/:id)
   - shop     - Example of how to use Reactive Extensions for API orchestration (FlatMap) (/shop/priceByOptionId/:id)
   - starwars - Example of how to use Reactive Extensions for API orchestration (ForkJoin) (/starwars/people/:id)
   - Use swagger UI for the complete list of sample APIs
   - metrics  - Prometheus based metrics added for all APIs (/metrics)
   - API Partial JSON response support 
```
    curl http://localhost:3000/api/v1/starwars/people/1
```
- Response
```
    {
        name: "Luke Skywalker",
        height: "172",
        mass: "77",
        hair_color: "blond",
        skin_color: "fair",
        eye_color: "blue",
        birth_year: "19BBY",
        gender: "male",
        homeworld: {
        name: "Tatooine",
        rotation_period: "23",
        orbital_period: "304",
        diameter: "10465",
        climate: "arid",
        gravity: "1 standard",
        terrain: "desert",
        surface_water: "1",
        population: "200000",
        residents: [
        "http://swapi.co/api/people/1/",
        "http://swapi.co/api/people/2/",
        "http://swapi.co/api/people/4/",
        "http://swapi.co/api/people/6/",
        "http://swapi.co/api/people/7/",
        "http://swapi.co/api/people/8/",
        "http://swapi.co/api/people/9/",
        "http://swapi.co/api/people/11/",
        "http://swapi.co/api/people/43/",
        "http://swapi.co/api/people/62/"
        ],
        films: [
        "http://swapi.co/api/films/5/",
        "http://swapi.co/api/films/4/",
        "http://swapi.co/api/films/6/",
        "http://swapi.co/api/films/3/",
        "http://swapi.co/api/films/1/"
        ],
        created: "2014-12-09T13:50:49.641000Z",
        edited: "2014-12-21T20:48:04.175778Z",
        url: "http://swapi.co/api/planets/1/"
        },
        films: [
        "http://swapi.co/api/films/2/",
        "http://swapi.co/api/films/6/",
        "http://swapi.co/api/films/3/",
        "http://swapi.co/api/films/1/",
        "http://swapi.co/api/films/7/"
        ],
        species: [
        "http://swapi.co/api/species/1/"
        ],
        vehicles: [
        "http://swapi.co/api/vehicles/14/",
        "http://swapi.co/api/vehicles/30/"
        ],
        starships: [
        "http://swapi.co/api/starships/12/",
        "http://swapi.co/api/starships/22/"
        ],
        created: "2014-12-09T13:50:51.644000Z",
        edited: "2014-12-20T21:17:56.891000Z",
        url: "http://swapi.co/api/people/1/"
        }
```
---
```
    curl http://localhost:3000/api/v1/starwars/people/1?fields=name,gender,homeworld(gravity,population)
```
- Response
```
    {
        name: "Luke Skywalker",
        gender: "male",
        homeworld: {
        gravity: "1 standard",
        population: "200000"
        }
    }
```
* VSCode Debug Launch Configuration (Preconfigured Debug Launcher added)
* Node Dashboard view added for telemetry during development process

## Pre-requisites

Install npm and nodeJS

npm version >= 3.x
node version >= 6.x

* To use the node dashboard view , install node dashboard at the global level 

```
npm install -g nodejs-dashboard

```
## Install It

```
npm install
```
## Setup *external environment*

* Edit the .env file
* Optionally update the LOG_DIRECTORY with absolute path of the log directory
* In the case of container deployment this could be a mounted drive as well

```
...
LOG_DIRECTORY=./logs/

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

#### k8s deployment
* Currently the setEnv.sh has been configured for minikube

```
cd k8s
. ./setEnv.sh
./k8s-deploy.sh
minikube service --url=true express-microservice
```
#### Using node dashboard view (Development Only)
* To use the node dashboard view

```
npm run compile
npm run dash
```
* This will start up the application with the node dashboard attached providing details of the memory , cpu and logs

### Try It

* Point you're browser to [http://localhost:3000](http://localhost:3000)
* Invoke the example REST endpoints directly or via swagger `http://localhost:3000/api`
* Invoke the prometheus metrics using the endpoint `curl http://localhost:3000/metrics`
   
### integrate with SonarCube (for continous code quality)
Assuming you have SonarCube 5.5.6 (LTS) installed
* Setup SonarCube with the [Sonar Typescript plugin](https://github.com/Pablissimo/SonarTsPlugin#installation)
* Install sonar-scanner globally (`npm install --global sonar-scanner`)
* Update [`sonar-project.properties`](sonar-project.properties) file for the property `sonar.host.url` to point to your SonarCube server. By default this assumes that the SonarCube server is running locally using the default port
* Run the unit tests
```bash
npm run test
```
* Push results to SonarCube
```bash
npm run sonar-scanner
``` 

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

