import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  price: number;
  amount: number;
  limitPercentage: number;

  baseData: Array<string>;
  coinData: Array<string>;
  base: string;
  coin: string;
  mode: boolean;

  constructor(public navCtrl: NavController) {
    this.baseData = ['BTC','ETH','USDT'];
    this.coinData = ['STRAT','ETH','ICO','XRB','XLM'];
    this.base = 'BTC';
    this.coin = 'XLM';
    this.price = .003;
  }

  getLimitPrice =() => {
    let percentage = this.limitPercentage/100+1;
    return parseFloat((percentage * this.price).toFixed(8));
  }

}
