import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  bootstrapX,
  bootstrapGrid,
  bootstrapHouse,
  bootstrapPerson,
  bootstrapTrophy,
  bootstrapBriefcase,
  bootstrapImage,
  bootstrapMailbox,
} from '@ng-icons/bootstrap-icons';
import { INavLink } from '../../core/interfaces/nav-links';
import { navLinks } from '../../core/constants/navLinks';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  imports: [NgIcon, RouterLink, CommonModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  viewProviders: [
    provideIcons({
      bootstrapX,
      bootstrapGrid,
      bootstrapHouse,
      bootstrapPerson,
      bootstrapTrophy,
      bootstrapBriefcase,
      bootstrapImage,
      bootstrapMailbox,
    }),
  ],
})
export class HeaderComponent {
  showMenu: boolean = false;
  navLinksArray: INavLink[] = navLinks;
  activeLink: string = 'home';

  @ViewChild('scrollHeader') scrollHeader!: ElementRef<HTMLElement>;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  setActiveLink(currentLink: string) {
    this.activeLink = currentLink;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY >= 80)
      this.scrollHeader.nativeElement.classList.add('scroll-header');
    else this.scrollHeader.nativeElement.classList.remove('scroll-header');
  }
}
