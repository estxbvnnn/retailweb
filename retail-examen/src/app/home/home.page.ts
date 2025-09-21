import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Si ya hay sesión, enviamos al flujo correcto
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw) {
        const next = localStorage.getItem('postLoginNext') || '/retail';
        const code = String(Math.floor(100000 + Math.random() * 900000));
        // Si hay next guardado (post login), retomamos en /scan; si no, vamos a /retail
        if (localStorage.getItem('postLoginNext')) {
          this.router.navigate(['/scan'], { queryParams: { code, next }, replaceUrl: true });
        } else {
          this.router.navigate(['/retail'], { replaceUrl: true });
        }
      }
    } catch {
      // ignore
    }
  }
}
