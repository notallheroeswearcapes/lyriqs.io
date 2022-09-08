import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Lyrics } from './models/lyrics.interface';
import { LyriqsService } from './services/lyriqs.service';
import { Song } from './models/song.interface';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displayedColumns: string[] = ['title', 'artist', 'album'];
  query = "";
  songResults: Song[] = [];
  chosenSong: Song | undefined;
  songLyrics: Lyrics | undefined;
  counter = 0;
  posCol = "#5E8C69"
  negCol = "#D76865"
  neuCol = "#EDCD9A"
  sentimentChipLabel = ""
  sentimentChipIcon = ''
  sentimentChipColor = ""

  constructor(public lyriqsService: LyriqsService) { }

  ngOnInit() {
    this.lyriqsService.getCounter().subscribe(res => {
      this.counter = +res;
    });
  }

  searchForSongs() {
    this.songResults = [];
    this.songLyrics = undefined;
    this.lyriqsService.searchForSongByQuery(this.query).subscribe(res => {
      const parsedSongs = JSON.parse(res);
      Object.keys(parsedSongs).forEach(property => {
        const element = parsedSongs[property].track;
        const song: Song = {
          id: element.track_id,
          commontrack_id: element.commontrack_id,
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
    this.lyriqsService.fetchAndAnalyzeSongLyricsById(song).subscribe(res => {
      this.songLyrics = res;
      this.drawSentimentChart(res);
      this.setLyricsLabelIcon(res);
    });
  }

  drawSentimentChart(lyrics: Lyrics) {
    const sentimentData: ChartData = {
      labels: ["Positive", "Negative"],
      datasets: [{
        label: `${this.chosenSong?.title}`,
        data: [+lyrics.sentiment.positive.toPrecision(3), +lyrics.sentiment.negative.toPrecision(3)],
        backgroundColor: [
          this.posCol,
          this.negCol
        ]
      }]
    };

    const neutralData: ChartData = {
      labels: ["Positive", "Negative", "Neutral"],
      datasets: [{
        label: '',
        data: [
          +lyrics.sentiment.positive.toPrecision(3),
          +lyrics.sentiment.negative.toPrecision(3),
          +lyrics.sentiment.neutral.toPrecision(3)
        ],
        backgroundColor: [
          this.posCol,
          this.negCol,
          this.neuCol
        ]
      }]
    };

    const sentimentConfig: ChartConfiguration = {
      type: 'doughnut',
      data: sentimentData,
      options: {}
    };

    const neutralTickOptions: Chart.NestedTickOptions = {
      beginAtZero: true,
      max: 1.0
    };
    const yAxes: Chart.ChartYAxe = {
      ticks: neutralTickOptions
    };
    const neutralConfig: ChartConfiguration = {
      type: 'bar',
      data: neutralData,
      options: {
        scales: {
          yAxes: [yAxes]
        },
        legend: {
          display: false
        },
      }
    };

    const sentimentChart = new Chart(
      'sentimentChart',
      sentimentConfig
    );
    const neutralChart = new Chart(
      'neutralChart',
      neutralConfig
    );
  }

  setLyricsLabelIcon(lyrics: Lyrics) {
    if (lyrics.sentiment.label == 'pos') {
      this.sentimentChipLabel = "Positive sentiment";
      this.sentimentChipIcon = 'sentiment_satisfied';
      this.sentimentChipColor = this.posCol;
    } else if (lyrics.sentiment.label == 'neutral') {
      this.sentimentChipLabel = "Neutral sentiment";
      this.sentimentChipIcon = 'sentiment_neutral';
      this.sentimentChipColor = this.neuCol;
    } else if (lyrics.sentiment.label == 'neg') {
      this.sentimentChipLabel = "Negative sentiment";
      this.sentimentChipIcon = 'sentiment_dissatisfied';
      this.sentimentChipColor = this.negCol;
    }
  }
}
