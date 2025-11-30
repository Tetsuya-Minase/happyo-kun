import { Injectable, signal, WritableSignal } from '@angular/core';
import { SlideMetadata } from '../models/slide.model';
import slideData from '../config/slide.json';

@Injectable({
  providedIn: 'root'
})
export class SlideService {
  // 実際のプロジェクトでは、APIからデータを取得するか、
  // ビルド時に生成されたJSONファイルから読み込むことになります
  private readonly slides: WritableSignal<SlideMetadata[]>;

  constructor() {
    if (!this.#validateSlideData(slideData)) {
      throw new Error(`slide data is invalid format.(${JSON.stringify(slideData)})`);
    }
    this.slides = signal<SlideMetadata[]>(slideData.slides)
  }

  getSlides() {
    return this.slides.asReadonly();
  }

  #validateSlideData(data: any): data is { slides: SlideMetadata[] } {
    if (data == null || typeof data !== 'object' || !('slides' in data) || !Array.isArray(data.slides)) {
      return false;
    }
    return data.slides.every((s:unknown) => {
      if (s == null || typeof s !== 'object' || !('title' in s) || !('description' in s) || !('dirName' in s)) {
        return false;
      }
      return typeof s.title === 'string' || typeof s.description === 'string' || typeof s.dirName === 'string';
    });
  }
}
