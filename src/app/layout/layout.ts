import { Component } from '@angular/core';
import { Header } from './header/header';
import { Navi } from './navi/navi';

@Component({
  selector: 'app-layout',
  imports: [Header, Navi],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
