import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface IConfig {
  tilesPerPage: number,
  projectTitle: string,
  startMessage: string,
  startButtonText: string,
  captchaTitles: string[],
  validateCaptchaButtonText: string,
  endTitle: string,
  endMessage: string,
  restartButtonText: string
}

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {

  projectTitle: string = "Carregando...";
  startMessage: string;
  startButtonText: string;
  validateCaptchaButtonText: string;
  endTitle: string;
  endMessage: string;
  restartButtonText: string;

  started: boolean = false;
  ended: boolean = false;
  configUrl: string = 'assets/config.json';
  titles: string[] = [];
  tiles: number[];
  tilesPerPage: number = 16;
  checkedTiles: boolean[];

  constructor(private http: HttpClient) {
    this.init();
  }

  ngOnInit() {
    this.fetchTitles();
  }

  get numberOfColumns() {
    return Math.ceil(Math.sqrt(this.tilesPerPage));
  }

  get title() {
    var titleIndex = this.tiles[0] / this.tilesPerPage;
    return this.titles[titleIndex];
  }

  fetchTitles() {
    this.http.get<IConfig>(this.configUrl).subscribe(config => {
      this.tilesPerPage = config.tilesPerPage;
      this.titles = config.captchaTitles;

      this.projectTitle = config.projectTitle;
      this.startMessage = config.startMessage;
      this.startButtonText = config.startButtonText;
      this.validateCaptchaButtonText = config.validateCaptchaButtonText;
      this.endTitle = config.endTitle;
      this.endMessage = config.endMessage;
      this.restartButtonText = config.restartButtonText;

      this.init();
    });
  }

  start() {
    if (this.started) return;
    setTimeout(() => {
      this.started = true;
    }, 500);
  }

  reset() {
    setTimeout(() => {
      this.started = false;
      this.ended = false;
      this.init();
    });
  }

  init() {
    this.tiles = Array(this.tilesPerPage).fill(0).map((el, i) => i);
    this.checkedTiles = Array(this.tilesPerPage).fill(false);
  }

  next() {
    var page = this.tiles[0] / this.tilesPerPage + 1;
    if (page >= this.titles.length) {
      this.ended = true;
    } else {
      this.tiles = this.tiles.map(el => el + this.tilesPerPage);
      this.checkedTiles.fill(false);
    }
  }

  toggle(tile: number) {
    const index = tile % this.tilesPerPage;
    this.checkedTiles[index] = !this.checkedTiles[index];
  }

  isChecked(tile: number) {
    const index = tile % this.tilesPerPage;
    return this.checkedTiles[index];
  }

  validate() {
    this.next();
  }

}
