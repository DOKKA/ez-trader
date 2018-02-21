import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { BinanceProvider } from '../../providers/binance/binance';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  price: number;
  amount: number;
  limitPercentage: number;

  baseBalance: number;
  tradeBalance: number;

  baseData: Array<string>;
  coinData: Array<string>;
  baseCurrency: string;
  tradeCurrency: string;
  mode: boolean;
  coinList;
  client;

  constructor(public navCtrl: NavController,private http: HTTP, private binanceProvider: BinanceProvider) {
    this.baseData = ['BNB','BTC','ETH','USDT'];
    this.coinData = [];
    this.baseCurrency = 'BTC';
    this.tradeCurrency = 'XLM';
    this.price = .003;
    this.coinList = {};
    this.binanceProvider.getCoinList().then((coins)=>{
      this.coinList = coins;
    });
  }

  getLimitPrice =() => {
    let percentage = this.limitPercentage/100+1;
    return parseFloat((percentage * this.price).toFixed(8));
  }

  button1 =(e) => {
    
  }

  onBaseSelect =(e)=>{
    this.coinData = this.coinList[this.baseCurrency];
  }

  onCoinSelect = (e) =>{
    this.binanceProvider.getBalances(this.baseCurrency,this.tradeCurrency).then((balance)=>{
      this.baseBalance = balance.baseCurrency;
      this.tradeBalance = balance.tradeCurrency;
    });
    this.binanceProvider.client.dailyStats({ symbol:  this.tradeCurrency+this.baseCurrency }).then((data)=>{
      this.price = parseFloat(data.askPrice);
    });
  }

}
