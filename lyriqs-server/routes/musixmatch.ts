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

router.get('/search', (req, res) => {
    console.log("Received request to /songs/search.");
    const query = req.query['song'];
    const options = createSongSearchOptions(query);
    const url = `http://${musixmatch.host}${options.path}`;

    axios.get(url)
        .then(rsp => {
            res.json(rsp.data.message.body.track_list);
        })
        .catch(error => {
            console.error(error);
        });
});

router.get('/lyrics', (req, res) => {
    const id = req.query['id']!;
    const options = createLyricsOptions(id);
    const url = `http://${musixmatch.host}${options.path}`;

    axios.get(url)
        .then(rsp => {
            const lyricsRes = rsp.data.message.body.lyrics;
            const lyrics = cleanLyrics(lyricsRes.lyrics_body);
            const sentimentFormData = new FormData();
            sentimentFormData.append('text', lyrics);

            const sentimentCall = setupSentimentCall(lyrics);
            axios({
                method: 'post',
                url: sentimentCall,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Content-Length": lyrics.length
                },
                data: sentimentFormData
            })
                .then(sRsp => {
                    const sentiment: Sentiment = {
                        label: sRsp.data.label,
                        negative: sRsp.data.probability.neg,
                        neutral: sRsp.data.probability.neutral,
                        positive: sRsp.data.probability.pos
                    }
                    const mashupResponse: Lyrics = {
                        lyrics_id: lyricsRes.lyrics_id,
                        track_id: +id,
                        content: lyrics,
                        language: lyricsRes.lyrics_language,
                        sentiment: sentiment
                    }
                    console.log(mashupResponse);
                    res.json(mashupResponse);
                })
                .catch(error => {
                    console.error(error);
                });
            //res.json(rsp.data.message.body.lyrics);
        })
        .catch(error => {
            console.error(error);
        });
});

function setupSentimentCall(lyrics: string) {
    const options = createSentimentOptions(lyrics);
    const url = `http://${sentiment.host}${options.path}`;
    return url;
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

function cleanLyrics(lyrics_body: string): string {
    return lyrics_body.replace(/\*{7}(.*)/g, '').replace(/\([0-9]{13}\)/g, '').trim();
}

export default router;