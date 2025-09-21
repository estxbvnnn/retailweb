import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  db, doc, setDoc, serverTimestamp,
  updateEmail, updateProfile,
  onAuthStateChanged,
  setPersistence, browserLocalPersistence
} from '../firebase';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private localKey = 'auth_user';
  private baseUrl = environment.awsApi.baseUrl;
  private endpoints = environment.awsApi.endpoints;

  constructor(private http: HttpClient, private router: Router) {
    // Persistencia local para evitar perder sesión
    try {
      const auth = getAuth();
      setPersistence(auth, browserLocalPersistence).catch(() => {});
      onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const cached = this.getCurrentUser();
          if (!cached || cached.uid !== fbUser.uid) {
            const user = { uid: fbUser.uid, email: fbUser.email || '' };
            localStorage.setItem(this.localKey, JSON.stringify(user));
          }
        } else {
          localStorage.removeItem(this.localKey);
        }
      });
    } catch {
      // ignore
    }
  }

  private url(ep: string) {
    return `${this.baseUrl}${ep}`;
  }

  private buildJsonHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiKey = (environment as any)?.awsApi?.apiKey;
    if (apiKey) headers = headers.set('x-api-key', apiKey);
    return headers;
  }

  private parseApiResponse(res: any) {
    if (res && typeof res === 'object' && 'statusCode' in res && 'body' in res) {
      try {
        return typeof (res as any).body === 'string' ? JSON.parse((res as any).body) : (res as any).body;
      } catch {
        return (res as any).body;
      }
    }
    return res;
  }

  private formatHttpError(context: string, err: any): Error {
    const status = err?.status ?? 0;
    const likelyCors = status === 0;
    const hint = likelyCors
      ? 'Posible CORS. Habilita CORS en API Gateway (OPTIONS/POST/GET) y agrega Access-Control-Allow-Origin en la respuesta de Lambda.'
      : '';
    console.error(`[AuthService] ${context} error`, { status, err });
    return new Error(`${context} falló. status=${status}. ${hint}`);
  }

  private async postNoCors(url: string, payload: any): Promise<void> {
    const body = JSON.stringify(payload);
    const headers: Record<string, string> = { 'Content-Type': 'text/plain' };
    const apiKey = (environment as any)?.awsApi?.apiKey;
    if (apiKey) headers['x-api-key'] = apiKey;
    await fetch(url, { method: 'POST', mode: 'no-cors', headers, body });
  }

  private generateScanCode(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private require(value: string | undefined | null, field: string) {
    if (!value || !String(value).trim()) {
      throw new Error(`El campo ${field} es obligatorio.`);
    }
  }

  // Mapeo de errores de Firebase Auth a mensajes claros (evita confundir con CORS)
  private formatAuthError(err: any): Error {
    const code = err?.code || '';
    const map: Record<string, string> = {
      'auth/invalid-email': 'Correo inválido.',
      'auth/user-disabled': 'El usuario está deshabilitado.',
      'auth/user-not-found': 'Usuario no encontrado.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
      'auth/network-request-failed': 'Fallo de red. Verifica tu conexión a Internet.',
      'auth/invalid-credential': 'Credenciales inválidas.'
    };
    const msg = map[code] || err?.message || 'No se pudo iniciar sesión.';
    return new Error(msg);
  }

  // Cambia firma para compatibilidad: (email, password) o (email, nombre, password)
  async register(email: string, nombreOrPassword: string, passwordOpt?: string) {
    // Normaliza parámetros
    const hasNombre = typeof passwordOpt === 'string';
    const nombre = hasNombre ? (nombreOrPassword as string) : (email || '').split('@')[0];
    const password = hasNombre ? (passwordOpt as string) : (nombreOrPassword as string);

    // Validaciones cuando vienen los 3 campos desde la UI
    if (hasNombre) {
      this.require(email, 'correo');
      this.require(nombre, 'nombre');
      this.require(password, 'contraseña');
    }

    try {
      // 1) Firebase Auth
      const auth = getAuth();
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const fb = cred.user;
      const user = { uid: fb.uid, email: fb.email || email, nombre };

      // 2) AWS (DynamoDB vía API Gateway)
      const headers = this.buildJsonHeaders();
      const payloadAws = { uid: user.uid, email: user.email, nombre };
      try {
        const rawRes: any = await firstValueFrom(
          this.http.post(this.url(this.endpoints.registerUser), payloadAws, { headers })
        );
        this.parseApiResponse(rawRes);
      } catch (e: any) {
        if ((e?.status ?? 0) === 0 && (environment as any).useNoCorsFallback) {
          await this.postNoCors(this.url(this.endpoints.registerUser), payloadAws);
        } else {
          console.warn('[AuthService] Persistencia en AWS falló (continuando solo con Firebase).', e);
        }
      }

      // 3) Firestore: usuarios/{uid}
      const scanCode = this.generateScanCode();
      try {
        await setDoc(
          doc(db, 'usuarios', user.uid),
          { ...user, scanCode, createdAt: serverTimestamp(), provider: 'firebase' },
          { merge: true }
        );
      } catch (fsErr) {
        console.warn('[AuthService] Firestore save falló (continuando).', fsErr);
      }

      // 4) Sesión local y navegación a scan -> retail
      localStorage.setItem(this.localKey, JSON.stringify(user));
      localStorage.setItem('postLoginNext', '/retail');
      // Usa replaceUrl para evitar volver al Home por historial/redirecciones
      this.router.navigate(['/scan'], { queryParams: { code: scanCode, next: '/retail' }, replaceUrl: true });
      return user;
    } catch (fbErr) {
      // Fallback si Firebase falla: intenta AWS puro
      try {
        const headers = this.buildJsonHeaders();
        const payloadAws = { email, nombre, password };
        const rawRes: any = await firstValueFrom(
          this.http.post(this.url(this.endpoints.registerUser), payloadAws, { headers })
        );
        const data = this.parseApiResponse(rawRes);
        const user = {
          uid: data?.id || data?.userId || data?.uid || `api-${Date.now()}`,
          email,
          nombre
        };
        // Firestore best-effort
        const scanCode = this.generateScanCode();
        try {
          await setDoc(doc(db, 'usuarios', user.uid), { ...user, scanCode, createdAt: serverTimestamp(), provider: 'aws' }, { merge: true });
        } catch { /* ignore */ }
        localStorage.setItem(this.localKey, JSON.stringify(user));
        localStorage.setItem('postLoginNext', '/retail');
        this.router.navigate(['/scan'], { queryParams: { code: scanCode, next: '/retail' }, replaceUrl: true });
        return user;
      } catch (e: any) {
        if ((e?.status ?? 0) === 0 && (environment as any).useNoCorsFallback) {
          await this.postNoCors(this.url(this.endpoints.registerUser), { email, nombre, password });
          const user = { uid: 'local-' + Date.now(), email, nombre };
          localStorage.setItem(this.localKey, JSON.stringify(user));
          localStorage.setItem('postLoginNext', '/retail');
          this.router.navigate(['/scan'], { queryParams: { code: '000000', next: '/retail' }, replaceUrl: true });
          return user;
        }
        throw this.formatHttpError('Registro', e);
      }
    }
  }

  async login(email: string, password: string) {
    // 1) Login en Firebase
    try {
      const auth = getAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const fb = cred.user;
      const user = { uid: fb.uid, email: fb.email || email };

      localStorage.setItem(this.localKey, JSON.stringify(user));
      localStorage.setItem('postLoginNext', '/retail');
      const scanCode = this.generateScanCode();
      // Usa replaceUrl para evitar cualquier retorno inmediato a Home
      this.router.navigate(['/scan'], { queryParams: { code: scanCode, next: '/retail' }, replaceUrl: true });
      return user;
    } catch (fbErr) {
      // Evita mostrar “Posible CORS” para errores de Firebase Auth
      throw this.formatAuthError(fbErr);
    }
  }

  // Panel de usuario: actualizar nombre | correo en Firebase, Firestore y AWS
  async updateUserProfile(nombre: string, email?: string) {
    const auth = getAuth();
    const current = auth.currentUser;
    if (!current) throw new Error('No hay sesión activa.');

    // Firebase Auth (displayName y email)
    try { await updateProfile(current, { displayName: nombre }); } catch { /* ignore */ }
    if (email && email !== current.email) { await updateEmail(current, email); }

    const uid = current.uid;
    const finalEmail = email || current.email || '';

    // Firestore
    await setDoc(doc(db, 'usuarios', uid), { uid, nombre, email: finalEmail, updatedAt: serverTimestamp() }, { merge: true });

    // AWS (opcional)
    try {
      const headers = this.buildJsonHeaders();
      await firstValueFrom(this.http.post(this.url(this.endpoints.registerUser), { uid, nombre, email: finalEmail, action: 'update' }, { headers }));
    } catch (e) { console.warn('[AuthService] Actualización en AWS falló.', e); }

    // Sesión local
    localStorage.setItem(this.localKey, JSON.stringify({ uid, email: finalEmail, nombre }));
    return { uid, email: finalEmail, nombre };
  }

  async logout() {
    try { const auth = getAuth(); await signOut(auth); } catch { /* ignore */ }
    localStorage.removeItem(this.localKey);
    localStorage.removeItem('postLoginNext');
  }

  getCurrentUser(): { uid: string; email: string; nombre?: string } | null {
    const raw = localStorage.getItem(this.localKey);
    return raw ? JSON.parse(raw) : null;
  }
}