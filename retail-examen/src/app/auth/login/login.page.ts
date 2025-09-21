import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.loading = true;
    this.error = null;
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigateByUrl('/movements', { replaceUrl: true });
    } catch (e: any) {
      this.error = e?.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
