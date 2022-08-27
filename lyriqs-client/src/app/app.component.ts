import { Component } from '@angular/core';
import { LyriqsService } from './lyriqs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lyriqs-client';

  value = "";
  result = "";
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
}
