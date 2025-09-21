import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export type Transaction = {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | string;
  amount: number;
  createdAt: string;
  notes?: string;
};

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private key = 'transactions';

  getLocal(): Transaction[] {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  }

  setLocal(list: Transaction[]) {
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  addLocal(tx: Transaction) {
    const list = this.getLocal();
    list.unshift(tx);
    this.setLocal(list);
  }

  async saveToAws(tx: Transaction) {
    const url = environment.awsApi.baseUrl + environment.awsApi.endpoints.saveTransaction;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx),
    });
    if (!res.ok) throw new Error('AWS save error');
    return res.json();
  }

  async listFromAws() {
    const url = environment.awsApi.baseUrl + environment.awsApi.endpoints.listTransactions;
    const res = await fetch(url);
    if (!res.ok) throw new Error('AWS list error');
    return res.json() as Promise<Transaction[]>;
  }
}
