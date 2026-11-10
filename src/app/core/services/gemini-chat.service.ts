import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export interface GeminiChatTurn {
  role: 'user' | 'model';
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeminiChatService {
  private readonly profileContext = `
You are the portfolio assistant for Ihab Mahmoud, a frontend developer.
Answer using only the profile context below and the conversation. Never invent
employers, projects, years, qualifications, prices, or personal information.
If the answer is not in the context, say that you do not have that detail and
suggest contacting Ihab directly.

Profile context:
- Ihab builds modern, responsive, user-friendly web applications.
- His portfolio uses Angular, TypeScript, JavaScript, responsive UI, reusable
  components, APIs, and modern web tooling.
- He can help with responsive websites, Angular interfaces, frontend
  improvements, and polished digital experiences.
- GitHub: https://github.com/EHAB3x
- LinkedIn: https://www.linkedin.com/in/ihabmahmoud1/
- WhatsApp contact: https://wa.me/201123242977
- Keep answers concise, friendly, and professional.
- Do not include the WhatsApp URL or phone number in your answer; the interface
  provides a dedicated contact card when the visitor wants to reach Ihab.
`;

  constructor(private readonly http: HttpClient) {}

  ask(question: string, history: GeminiChatTurn[]): Observable<string> {
    const apiKey = environment.geminiApiKey.trim();

    if (!apiKey) {
      return throwError(
        () =>
          new Error(
            'Gemini is not configured yet. Add the API key through a secure backend before enabling the assistant.'
          )
      );
    }

    const contents = history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    }));

    contents.push({
      role: 'user',
      parts: [{ text: question }],
    });

    return this.http
      .post<GeminiResponse>(
        `https://generativelanguage.googleapis.com/v1beta/models/${environment.geminiModel}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          systemInstruction: {
            parts: [{ text: this.profileContext }],
          },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 220,
          },
        }
      )
      .pipe(
        timeout(20000),
        map((response) => {
          const text = response.candidates?.[0]?.content?.parts
            ?.map((part) => part.text ?? '')
            .join('')
            .trim();

          if (!text) {
            throw new Error('Gemini returned an empty response.');
          }

          return text;
        }),
        catchError((error: unknown) =>
          throwError(
            () =>
              error instanceof Error
                ? error
                : new Error('The assistant could not answer right now.')
          )
        )
      );
  }
}
