import { Sentiment } from "./sentiment.interface";

export interface Lyrics {
    track_id: number,
    lyrics_id: number,
    content: string,
    language: string,
    sentiment: Sentiment
}