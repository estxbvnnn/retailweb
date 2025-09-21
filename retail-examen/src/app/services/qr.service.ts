import { Injectable } from '@angular/core';

export interface ScanItem {
  id: string;
  content: string; // URL/texto de oferta
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class QrService {
  private key = 'qr_scans';

  getAll(): ScanItem[] {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  }

  add(content: string) {
    const item: ScanItem = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
    };
    const list = this.getAll();
    list.unshift(item);
    localStorage.setItem(this.key, JSON.stringify(list));
    return item;
  }
}
