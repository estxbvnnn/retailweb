import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retail',
  templateUrl: './retail.page.html',
})
export class RetailPage implements OnInit {
  nombre = '';
  email = '';
  saving = false;
  msg: string | null = null;
  err: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const u = this.auth.getCurrentUser();
    if (u) {
      this.email = u.email || '';
      this.nombre = (u as any).nombre || (this.email.split('@')[0] || '');
    }
  }

  async save() {
    this.saving = true;
    this.msg = this.err = null;
    try {
      const res = await this.auth.updateUserProfile(this.nombre, this.email);
      this.msg = 'Datos actualizados correctamente.';
    } catch (e: any) {
      this.err = e?.message || 'No se pudo actualizar.';
    } finally {
      this.saving = false;
    }
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/home'], { replaceUrl: true }); // reemplaza historial
  }
}
