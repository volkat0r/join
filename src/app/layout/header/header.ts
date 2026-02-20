import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menuOpen = false;

  constructor(private router: Router) { }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
    document.addEventListener('click', this.handleOutsideClick);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.menuOpen = false;
      });
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const clickedInsideProfile = target.closest('.userProfile');
    const clickedInsideMenu = target.closest('.userMenu');

    if (!clickedInsideProfile && !clickedInsideMenu) {
      this.menuOpen = false;
    }
  };
}
