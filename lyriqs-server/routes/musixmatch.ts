import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();


const musixmatch = {
    apiKey: process.env.MUSIXMATCH_API_KEY,
    host: "api.musixmatch.com/ws/1.1"
}

router.get('/search', (req, res) => {
    console.log("Received request to /songs.")
    const query = req.query['song'];
    const options = createSongSearchOptions(query);
    const url = `http://${musixmatch.host}${options.path}`;
    console.log(url);

    axios.get(url)
        .then(rsp => {
            res.json(rsp.data.message.body.track_list);
        })
        .catch(error => {
            console.error(error);
        });
});

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

export default router;