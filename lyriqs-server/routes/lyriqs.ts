import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';
import FormData from 'form-data';
import { Lyrics } from '../models/lyrics.interface';
import { Sentiment } from '../models/sentiment.interface';

const router = express.Router();
dotenv.config();


const musixmatch = {
    apiKey: process.env.MUSIXMATCH_API_KEY,
    host: "api.musixmatch.com/ws/1.1"
}

const sentiment = {
    host: "text-processing.com/api"
}

const wordcloud = {
    host: "quickchart.io"
}

router.get('/search', (req, res) => {
    console.log("⚡️ Received request to /songs/search");
    const query = req.query['song'];
    const options = createSongSearchOptions(query);
    const url = `http://${musixmatch.host}${options.path}`;

    axios.get(url)
        .then(rsp => {
            const searchResult = rsp.data.message.body.track_list
            console.log(`✅ Found ${searchResult.length} tracks`)
            res.json(searchResult);
        })
        .catch(error => {
            console.error(`❌ Error during request to /songs/search: ${error}`);
        });
});

router.get('/lyrics', (req, res) => {
    console.log("⚡️ Received request to /lyrics");
    const id = req.query['id']!;
    const options = createLyricsOptions(id);
    const url = `http://${musixmatch.host}${options.path}`;

    axios.get(url)
        .then(rsp => {
            const lyricsRes = rsp.data.message.body.lyrics;
            const lyrics = cleanLyrics(lyricsRes.lyrics_body);
            const cleanedLyrics = cleanupLineBreaks(lyrics);

            const sentimentCall = axios(setupSentimentCall(cleanedLyrics));
            const wordcloudCall = axios(setupWordcloudCall(cleanedLyrics));

            axios.all([sentimentCall, wordcloudCall])
                .then(axios.spread((...responses) => {  
                    const sentimentRes = responses[0];
                    const wordcloudRes = responses[1];
                    const sentiment: Sentiment = {
                        label: sentimentRes.data.label,
                        negative: sentimentRes.data.probability.neg,
                        neutral: sentimentRes.data.probability.neutral,
                        positive: sentimentRes.data.probability.pos
                    };
                    const mashupResponse: Lyrics = {
                        lyrics_id: lyricsRes.lyrics_id,
                        track_id: +id,
                        content: lyrics,
                        language: lyricsRes.lyrics_language,
                        sentiment: sentiment,
                        wordcloud: wordcloudRes.data
                    };
                    console.log(`✅ Created mashup response containing lyrics, sentiment values, and a wordcloud image`)
                    res.json(mashupResponse);
                }))
                .catch(error => {
                    console.error(`❌ Error during request to retrieve sentiments or wordcloud: ${error}`);
                });
        })
        .catch(error => {
            console.error(`❌ Error during request to retrieve lyrics, sentiments or wordcloud: ${error}`);
        });
});

function setupSentimentCall(lyrics: string) {
    const sentimentFormData = new FormData();
    sentimentFormData.append('text', lyrics);
    const options = createSentimentOptions(lyrics);
    const url = `http://${sentiment.host}${options.path}`;
    const call = {
        method: 'post',
        url: url,
        headers: {
            "Content-Type": "multipart/form-data",
            "Content-Length": lyrics.length
        },
        data: sentimentFormData
    };
    return call;
}

function setupWordcloudCall(lyrics: string) {
    const options = createWordcloudOptions(lyrics);
    const url = `http://${wordcloud.host}${options.path}`;
    const call = {
        method: 'get',
        url: url
    };
    return call;
}

function createSongSearchOptions(query: any) {
    const options = {
        path: "/track.search?"
    };
    const queryString = `apikey=${musixmatch.apiKey}` +
        `&q_track=${query}` +
        '&s_track_rating=desc' +
        '&f_has_lyrics=true';
    options.path += queryString;
    return options;
}

function createLyricsOptions(id: any) {
    const options = {
        path: "/track.lyrics.get?"
    };
    const queryString = `apikey=${musixmatch.apiKey}` +
        `&track_id=${id}`;
    options.path += queryString;
    return options;
}

function createSentimentOptions(lyrics: string) {
    const options = {
        path: "/sentiment/"
    };
    return options;
}

function createWordcloudOptions(lyrics: string) {
    const options = {
        path: "/wordcloud?"
    };
    const queryString = `text=${lyrics}&width=400&height=400&removeStopwords=true`
    options.path += queryString;
    return options;
}

function cleanLyrics(lyrics_body: string): string {
    return lyrics_body.replace(/\*{7}(.*)/g, '').replace(/\([0-9]{13}\)/g, '').trim();
}

function cleanupLineBreaks(lyrics: string): string {
    return lyrics.replace( /[\n\r]/g, ' ');
}

export default router;