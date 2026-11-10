import { Component, AfterViewInit } from '@angular/core';
import * as AOS from 'aos';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeroSectionComponent } from './sections/hero-section/hero-section.component';
import { AboutSectionComponent } from './sections/about-section/about-section.component';
import { SkillsSectionComponent } from './sections/skills-section/skills-section.component';
import { ServicesSectionComponent } from "./sections/services-section/services-section.component";
import { QualificationsComponent } from "./sections/qualifications/qualifications.component";
import { ProjectsSectionComponent } from "./sections/projects-section/projects-section.component";
import { ContactSectionComponent } from "./sections/contact-section/contact-section.component";
import { ThemeToggleComponent } from "./shared/theme-toggle/theme-toggle.component";
import { AnalyticsService } from './core/services/analytics.service';
import { PortfolioChatbotComponent } from './shared/portfolio-chatbot/portfolio-chatbot.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    SkillsSectionComponent,
    ServicesSectionComponent,
    QualificationsComponent,
    ProjectsSectionComponent,
    ContactSectionComponent,
    ThemeToggleComponent,
    PortfolioChatbotComponent
],
})
export class AppComponent implements AfterViewInit {
  title = 'portfolio';

  constructor(private readonly analyticsService: AnalyticsService) {}

  ngAfterViewInit(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const interactiveElement = target.closest('a, button');

    if (interactiveElement instanceof HTMLElement) {
      this.analyticsService.trackClick(interactiveElement);
    }
  }
}
