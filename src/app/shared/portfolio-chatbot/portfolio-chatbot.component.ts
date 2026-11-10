import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GeminiChatService,
  GeminiChatTurn,
} from '../../core/services/gemini-chat.service';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { faSolidRobot } from '@ng-icons/font-awesome/solid';

export interface ChatMessage {
  author: 'assistant' | 'visitor';
  text: string;
}

@Component({
  selector: 'app-portfolio-chatbot',
  imports: [CommonModule, FormsModule, NgIconComponent],
  templateUrl: './portfolio-chatbot.component.html',
  styleUrl: './portfolio-chatbot.component.scss',
  viewProviders: [
    provideIcons({
      faSolidRobot
    }),
  ],
})
export class PortfolioChatbotComponent implements AfterViewChecked {
  readonly whatsappUrl =
    'https://wa.me/201123242977?text=Hi%20Ihab%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20talk%20about%20a%20project.';
  readonly githubUrl = 'https://github.com/EHAB3x';
  readonly linkedinUrl = 'https://www.linkedin.com/in/ihabmahmoud1/';

  isOpen = false;
  isPanelVisible = false;
  draft = '';
  isLoading = false;
  errorMessage = '';
  showWhatsAppCard = false;
  private shouldScrollToBottom = false;
  readonly quickPrompts = [
    'What does Ihab do?',
    'What can we build together?',
    'How can I hire him?',
  ];
  messages: ChatMessage[] = [
    {
      author: 'assistant',
      text: 'Hi! I’m Ihab’s portfolio assistant. Ask me about his work, skills, services, or how to get in touch.',
    },
  ];

  @ViewChild('messageList')
  private readonly messageList?: ElementRef<HTMLElement>;

  constructor(private readonly geminiChatService: GeminiChatService) {}

  toggle(): void {
    if (this.isOpen) {
      this.isOpen = false;
      window.setTimeout(() => {
        this.isPanelVisible = false;
      }, 220);
      return;
    }

    this.isPanelVisible = true;
    requestAnimationFrame(() => (this.isOpen = true));
  }

  ngAfterViewChecked(): void {
    if (!this.shouldScrollToBottom || !this.messageList) {
      return;
    }

    this.messageList.nativeElement.scrollTo({
      top: this.messageList.nativeElement.scrollHeight,
      behavior: 'smooth',
    });
    this.shouldScrollToBottom = false;
  }

  ask(prompt: string): void {
    const question = prompt.trim();

    if (!question || this.isLoading) {
      return;
    }

    const history = this.getHistory();
    this.messages = [...this.messages, { author: 'visitor', text: question }];
    this.shouldScrollToBottom = true;
    this.draft = '';
    this.errorMessage = '';
    this.isLoading = true;

    this.geminiChatService.ask(question, history).subscribe({
      next: (answer) => {
        this.messages = [
          ...this.messages,
          { author: 'assistant', text: answer },
        ];
        this.showWhatsAppCard =
          this.showWhatsAppCard ||
          /hire|contact|reach|talk|whatsapp|available|project|work together|freelance/i.test(
            question,
          );
        this.shouldScrollToBottom = true;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  private getHistory(): GeminiChatTurn[] {
    return this.messages.slice(-8).map((message) => ({
      role: message.author === 'visitor' ? 'user' : 'model',
      text: message.text,
    }));
  }

  trackMessage(index: number, message: ChatMessage): string {
    return `${message.author}-${index}-${message.text}`;
  }
}
