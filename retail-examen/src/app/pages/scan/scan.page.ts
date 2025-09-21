import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
})
export class ScanPage implements OnInit {
  displayedCode = '000000';
  inputCode = '';
  qrUrl = '';
  next = '/home';
  ok = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private scanner: BarcodeScanner) {}

  ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    const code = qp.get('code') || this.generateCode();
    const storedNext = localStorage.getItem('postLoginNext') || undefined;
    this.next = qp.get('next') || storedNext || '/home';
    this.displayedCode = code;
    this.qrUrl = this.buildQrUrl(`retailoff:${code}`);
  }

  private generateCode(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private buildQrUrl(data: string): string {
    const encoded = encodeURIComponent(data);
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}`;
  }

  async scan() {
    this.error = null;
    try {
      const res = await this.scanner.scan();
      const text = (res?.text || '').trim();
      const code = text.startsWith('retailoff:') ? text.replace('retailoff:', '') : text;
      this.inputCode = code.slice(0, 6);
    } catch {
      this.error = 'No se pudo escanear el código.';
    }
  }

  validateCode() {
    this.error = null;
    if ((this.inputCode || '').trim() === this.displayedCode) {
      this.ok = true;
      // Limpia el destino guardado para evitar redirecciones posteriores no deseadas
      try { localStorage.removeItem('postLoginNext'); } catch {}
      this.router.navigateByUrl(this.next || '/retail');
    } else {
      this.ok = false;
      this.error = 'Código incorrecto. Vuelve a intentarlo.';
    }
  }
}
