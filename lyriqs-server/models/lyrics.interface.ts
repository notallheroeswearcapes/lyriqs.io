import { Sentiment } from "./sentiment.interface";

export interface Lyrics {
    lyrics_id: number,
    track_id: number,
    content: string,
    language: string,
    sentiment: Sentiment
}