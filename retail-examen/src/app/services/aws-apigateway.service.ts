import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwsApigatewayService {
  private base = environment.awsApi?.baseUrl || '';

  async getUsers(): Promise<any[]> {
    if (!this.base || this.base.includes('YOUR_API_GATEWAY_BASE')) return [];
    const res = await fetch(`${this.base}/users`);
    if (!res.ok) throw new Error('AWS getUsers error');
    return res.json();
  }

  async postUser(nombre: string, email: string): Promise<any> {
    if (!this.base || this.base.includes('YOUR_API_GATEWAY_BASE')) return { ok: false, reason: 'Configurar awsApi.baseUrl' };
    const res = await fetch(`${this.base}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email }),
    });
    if (!res.ok) throw new Error('AWS postUser error');
    return res.json();
  }
}
