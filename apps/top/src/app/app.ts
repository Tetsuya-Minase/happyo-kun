import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { SlideService } from './services/slide.service';
import { Feature } from './models/slide.model';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly slideService = inject(SlideService);

  // スライド一覧を取得
  protected readonly slides = this.slideService.getSlides();

  // 主な機能一覧
  protected readonly features = signal<Feature[]>([
    {
      icon: '🎨',
      title: 'リアルタイムCSS編集',
      description: 'スライド内でCSSを直接編集し、結果を即座に確認'
    },
    {
      icon: '🚀',
      title: 'API統合',
      description: 'Cloudflare Pages Functionsを活用したサーバーレス機能'
    },
    {
      icon: '📱',
      title: 'レスポンシブデザイン',
      description: 'あらゆるデバイスで最適な表示'
    },
    {
      icon: '⚙️',
      title: '自動デプロイ',
      description: 'GitHub ActionsによるCI/CD自動化'
    }
  ]);
}
