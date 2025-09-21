import { Component, OnInit } from '@angular/core';
import { AwsApigatewayService } from '../../services/aws-apigateway.service';

@Component({
  selector: 'app-aws',
  templateUrl: './aws.page.html',
  styleUrls: ['./aws.page.scss']
})
export class AwsPage implements OnInit {
  nombre: string = '';
  email: string = '';

  loading = false;
  result: any = null;
  error: string | null = null;

  private DEPLOY_URL = 'https://7pgdn5q476.execute-api.us-east-1.amazonaws.com/pmp-video-deploy';

  constructor(private service: AwsApigatewayService) {}

  async ngOnInit() {
    try {
      const users = await this.service.getUsers();
      console.log(users);
    } catch (e) {
      console.warn('No se pudo cargar usuarios (configura awsApi.baseUrl)', e);
    }
  }

  async postUser() {
    try {
      const data = await this.service.postUser(this.nombre, this.email);
      console.log(data);
      this.nombre = '';
      this.email = '';
    } catch (e) {
      console.error(e);
    }
  }

  async triggerDeploy() {
    this.loading = true;
    this.result = null;
    this.error = null;
    try {
      const res = await fetch(this.DEPLOY_URL, { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || 'Error en deploy');
      this.result = json;
    } catch (e: any) {
      this.error = e?.message || 'Error inesperado';
    } finally {
      this.loading = false;
    }
  }
}
