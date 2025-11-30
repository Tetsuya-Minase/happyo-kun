import { Injectable, signal } from '@angular/core';
import { SlideMetadata } from '../models/slide.model';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  // 実際のプロジェクトでは、APIからデータを取得するか、
  // ビルド時に生成されたJSONファイルから読み込むことになります
  private readonly slides = signal<SlideMetadata[]>([
    {
      name: 'slide',
      description: 'Slidevを使用したインタラクティブなプレゼンテーション',
      dirName: 'slide'
    }
  ]);

  getSlides() {
    return this.slides.asReadonly();
  }

  // 将来的にAPIから取得する場合のメソッド例
  // async loadSlides(): Promise<void> {
  //   const response = await fetch('/api/slides');
  //   const data = await response.json();
  //   this.slides.set(data);
  // }
}
