import { Component } from '@angular/core';
import { map } from 'rxjs';
import { LyriqsService } from './lyriqs.service';
import { Song } from './song';

const TEST_SONG_DATA = [
  { id: "1", title: "A Rush Of Blood To The Head", artist: "Coldplay", album: "A Rush Of Blood To The Head" },
  { id: "2", title: "Exit Sign", artist: "Hilltop Hoods", album: "The Great Expanse" },
  { id: "3", title: "in the wake of your leave", artist: "Gang of Youths", album: "angel in realtime." }
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lyriqs-client';

  displayedColumns: string[] = ['title', 'artist', 'album'];
  query = "";
  result = ""
  songResults: Song[] = [];
  chosenSong: Song | undefined;
  songLyrics = "";
  counter = 0;

  constructor(private lyriqsService: LyriqsService) { }

  getTest() {
    console.log("Button click event received successfully.")
    this.lyriqsService.getTest().subscribe(res => {
      this.result = res;
    });
    console.log(this.result);
    this.counter++;
  }

  searchForSongs() {
    //this.songResult = TEST_SONG_DATA;
    this.lyriqsService.searchForSongByQuery(this.query).subscribe(res => {
      const parsedSongs = JSON.parse(res);
      Object.keys(parsedSongs).forEach(property => {
        const element = parsedSongs[property].track;
        const song: Song = {
          id: element.track_id,
          title: element.track_name,
          artist: element.artist_name,
          album: element.album_name
        };
        this.songResults.push(song);
      });
    });
  }

  fetchSongLyrics(song: Song) {
    this.chosenSong = song;
    this.lyriqsService.fetchSongLyricsById(song.id).subscribe(data => {
      console.log(data);
    });
    this.songLyrics = "Now and then I think of when we were together\r\n...Like when you said you felt so happy you could die"
  }


}
