import { Component, OnInit } from '@angular/core';
import { QrService, ScanItem } from '../../services/qr.service';

@Component({
  selector: 'app-history',
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Historial QR</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
  <ion-list>
    <ion-item *ngFor="let s of scans">
      <ion-label>
        <h3>{{ s.content }}</h3>
        <p>{{ s.createdAt | date:'short' }}</p>
      </ion-label>
      <ion-buttons slot="end">
        <ion-button [href]="s.content" target="_blank" rel="noopener">Abrir</ion-button>
      </ion-buttons>
    </ion-item>
  </ion-list>
  <ion-item *ngIf="!scans.length">
    <ion-label>No hay escaneos</ion-label>
  </ion-item>
</ion-content>
`,
})
export class HistoryPage implements OnInit {
  scans: ScanItem[] = [];
  constructor(private qr: QrService) {}
  ngOnInit() {
    this.scans = this.qr.getAll();
  }
}
