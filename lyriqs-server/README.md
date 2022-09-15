# lyriqs.io - Server

This is the server side project for `lyriqs.io` - my mashup for the first assignment of the QUT course *CAB432 Cloud Computing*. The server provides an API to search for songs, fetch their lyrics and perform an analysis of the lyrics content. A sentiment analysis is carried out and a wordcloud is generated. The results of the analysis are returned as well as the actual lyrics. 

## Description
The server is written using [TypeScript](https://www.typescriptlang.org/) and consists of a basic [Express](https://expressjs.com/en/starter/installing.html) backend served on a [Node.js](https://nodejs.org/en/) server. The API of the server exposes three endpoints: `/counter`, `/songs/search`, and `/songs/lyrics`.

1. `/counter`

A GET call to this endpoint returns the number of page views with regard to a page counter hosted on AWS S3. The raw number of the page views is returned as text.

2. `/songs/search`

A GET call to this endpoint returns a list of search results for a specific search term supplied as a query parameter `song`. A full request would look like `/songs/search?song=Yesterday`. The server sends a request to the song search endpoint of the Musixmatch API to retrieve the results and then returns the track list as a JSON. The list contains obects of type `track` from Musixmatch (details can be found at the [API documentation](https://developer.musixmatch.com/documentation/api-reference/track)).

3. `/songs/lyrics`

This is the actual mashup endpoint. A GET call with query parameter `id`, which contains the `track_id` of a Musixmatch song entry, will perform several API calls from the server and compile a mashup response object that is returned once all internal calls have concluded. First, the lyrics for the track ID are fetched from Musixmatch. The lyrics are then cleaned and used as the input to calls to the text-processing.com and Quickchart APIs which perform the sentiment analysis and wordcloud generation, respectively. The mashup response is an object of type `models/lyrics.interface.ts`. A full request to the mashup endpoint would look like `/songs/lyrics?id=15953433`.

## APIs
The mashup uses three different APIs to collect data according to the user's requests. Additionally, a page view counter is implemented using an AWS S3 bucket.

1. Musixmatch

The [Musixmatch API](https://developer.musixmatch.com/documentation/api-methods) at `http://api.musixmatch.com/ws/1.1` is used to search for songs and then fetch their lyrics. An API key is required to use this service which needs to be supplied explicitly before starting the server (see section *How to use*). The free plan allows you to return 10 songs for a search request and provides 30% of a song's lyrics. As this is not a full production service, this limitation is deemed acceptable. The endpoints from Musixmatch are GET to `/track.search?` for the song search and GET to `/track.lyrics.get?` for fetching the lyrics for a specific song.

2. text-processing.com

This [text-processing.com API](http://text-processing.com/docs/index.html) at `http://text-processing.com/api` is a simple JSON over HTTP web service for text mining and natural language processing similar to the natural language toolkit (NLTK). It is currently free and open for public use without authentication, but limited to 1k calls per IP per day. The API is used to analyse the sentiment of song lyrics and return the positive/negative/neutral shares of the lyrics content. Before supplying the content to the analysis, the lyrics are cleaned (copyright statement and line breaks are removed). The only endpoint used is POST to `/sentiment`.

3. Quickchart

The [Quickchart API](https://quickchart.io/documentation/) at `http://quickchart.io` is an open-source web service creating charts from Chart.js on a backend and returning them as an image. It also offers an endpoint to create a wordcloud by sending a POST request to `/wordcloud`. The lyrics are supplied as a parameter to this call and the result is a full HTML `<svg>` tag with the wordlcoud as an SVG image ready to be displayed on a web page.

4. AWS S3

A bucket on [AWS S3](https://aws.amazon.com/s3/) contains a JSON file `page_counter.json` with a counter entry that is updated on each visit to the site. Each reload of the client sends a request to the server on the endpoint `/counter`. If the bucket does not exist yet it is created using the provided AWS credentials (see section *How to use*). If the counter object does not exist on startup it is also created with the first request and initialized with the counter set to 0. The name of the S3 bucket can be redefined in the `.env` file or as an environment variable in the `docker run` command. It is set to `cab432-n11378093-lyriqs` as default. 


## How to use
Run the command `npm run start:dev` to start up a development server which will run at port 3000. You can also create a Docker image and start up a container with the following commands: 
```
docker build -t your-registry/lyriqs-image-name:server .
docker run --name server -p 3000:3000 your-registry/lyriqs-image-name:server
```
The server application will then be available at `http://localhost:3000/`. If you wish to run the server locally, the AWS credentials should be supplied in the `credentials` file located in the `.aws` folder in the user's directory. Loading the credentials from this location is facilitated by setting the environment variable `AWS_SDK_LOAD_CONFIG` to 1 in the `.env` file. If the server should be run locally, supply the Musixmatch API key in the `.env` file as well (`MUSIXMATCH_API_KEY=XYZ`). Using Docker to run the server requires you to set the environment variables for the AWS credentials and API key as well. You can either set these as environment variables in the bash shell and source them before conjuring up the container or set them explicitly with the `docker run` command with the `-e` options. A full command to run the container would look like this:

`docker run --name server -p 3000:3000 -e MUSIXMATCH_API_KEY="XYZ" -e AWS_ACCESS_KEY_ID="XYZ" -e AWS_SECRET_ACCESS_KEY="XYZ" -e AWS_SESSION_TOKEN="XYZ" -t your-registry/lyriqs-image-name:server`

Note that `docker compose up` can be used from the root project to run both server and client at once.

## Author

**Name:** Matthias Eder

**Student number:** 11378093

**Email address:** n11378093@qut.edu.au