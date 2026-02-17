import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navi',
  imports: [RouterLink, RouterModule],
  templateUrl: './navi.html',
  styleUrl: './navi.scss',
})
export class Navi {}
