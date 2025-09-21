import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
})
export class RegisterPage {
  email = '';
  nombre = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.loading = true;
    this.error = null;
    try {
      await this.auth.register(this.email, this.nombre, this.password);
      // Navegación la realiza AuthService -> /scan?next=/home
      // this.router.navigateByUrl('/movements', { replaceUrl: true });
    } catch (e: any) {
      this.error = e?.message || 'Error al registrar';
    } finally {
      this.loading = false;
    }
  }
}
