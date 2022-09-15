# lyriqs.io - Client

This is the client side project for `lyriqs.io` - my mashup for the first assignment of the QUT course *CAB432 Cloud Computing*. The client provides a user interface to search for songs, displays the results and allows users to choose a song. This then fetches song lyrics and displays (a preview of) the content, a mood label as well as the result of the underlying sentiment analysis, and a wordcloud of the lyrics. 

## Description
The client is a SPA created with the frontend framework Angular. It was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.3. Please refer to `package.json` for dependencies and versions. 

### Components
The app consists of a single, default `AppComponent`. It was not necessary to divide the application in additional components as a single HTML page suffices for the use cases of `lyriqs.io`. 

### Services
A single service called `LyriqsService` is responsible for performing HTTP calls to the server API. It is injected into the `AppComponent`.

### Models
* `Song`: Consists of the song data like title, artist, etc.
* `Sentiment`: Contains the results of the sentiment analyis.
* `Lyrics`: The model for the mashup response. Contains the lyrics, sentiment results and wordcloud data.

### Charts
The charts are created with the open-source Javascript library [Chart.js](https://www.chartjs.org/docs/2.9.4/) in version 2.9.4. The charts are created in the frontend based on the results of the sentiment analysis.

### Pipes
The `EscapeHtmlPipe` disables DOM-sanitizing and allows to display HTML content without any interference. This is necessary to display the wordcloud `<svg>` tag directly in the HTML. 

### Interceptors
The `LoadingInterceptor` is an HTTP interceptor to detect the loading state of a web request. It is linked with the `LyriqsService` to provide the state to the progress bar during requests.

### Styling
Normal CSS is used to style components. Additionally, I experimented with the CSS framework [Tailwind](https://tailwindcss.com/docs/installation).

## How to use
Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The requests to the server will be proxied. Please refer to the `proxy.conf.json` file and the configurations which may need to be adapted according to your setup of the server.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

You can also create a Docker image and start up a container with the following commands: 
```
docker build -t your-registry/lyriqs-image-name:client .
docker run --name server -p 4200:80 your-registry/lyriqs-image-name:client
```
The client application will then be available at `http://localhost:4200/`.

The Dockerfile of the client uses a multi-stage build. The first stage builds the Angular application and copies the artifacts. The second stage serves the app on a lightweight [NGINX](https://nginx.org/en/docs/beginners_guide.html) web server. This server also acts as a reverse proxy to redirect requests between client and server in any environment. This setup follows best-practise guidelines for serving Angular applications in a production environment and reduces the size of the Docker image heavily to around 25 MB (serving the app on the development server would have resulted in >2 GB). The configuration of the server was a major challenge.

Note that `docker compose up` can be used from the root project to run both server and client at once.

## Author

**Name:** Matthias Eder

**Student number:** 11378093

**Email address:** n11378093@qut.edu.au