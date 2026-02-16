import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss', '../../public/assets/styles/fonts.scss'],
})
export class App {
  protected readonly title = signal('join');
}
