import { Component, OnInit } from '@angular/core';
import { TransactionsService, Transaction } from '../services/transactions.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
})
export class MovementsPage implements OnInit {
  balance = 0;
  txs: Transaction[] = [];

  constructor(
    private txService: TransactionsService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  ionViewWillEnter() {
    this.load();
  }

  load() {
    this.txs = this.txService.getLocal();
    this.balance = this.txs.reduce((acc, t) => acc + (t.amount || 0), 0);
  }

  addDummy() {
    this.txService.addLocal({
      id: Date.now().toString(),
      type: 'DEPOSIT',
      amount: 1000,
      createdAt: new Date().toISOString(),
    });
    this.load();
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
