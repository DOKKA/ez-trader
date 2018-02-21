import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { BinanceProvider } from '../../providers/binance/binance';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tradePrice: number;
  balancePercentage: number;
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
    this.tradeCurrency = 'ETH';
    this.tradePrice = 0;
    this.limitPercentage = 0;
    this.balancePercentage = 0;
    this.coinList = {};
    this.setBalances();
    this.binanceProvider.getCoinList().then((coins)=>{
      this.coinList = coins;
    });
  }

  getLimitPrice =() => {
    let percentage = 1-this.limitPercentage/100;
    return parseFloat((percentage * this.tradePrice).toFixed(8));
  }

  getBaseAmount = () => {
    return (this.balancePercentage/100)*this.baseBalance;
  }

  getTradeAmount = () => {
    return parseFloat((this.getBaseAmount()/this.getLimitPrice()).toFixed(8));
  }

  button1 =(e) => {
    
  }

  onBaseSelect =(e)=>{
    this.coinData = this.coinList[this.baseCurrency];
  }

  onCoinSelect = (e) =>{
    this.setBalances();
    this.binanceProvider.getPrice(this.baseCurrency,this.tradeCurrency).then((price)=>{
      this.tradePrice = price;
    });
  }

  setBalances =() =>{
    this.binanceProvider.getBalances(this.baseCurrency,this.tradeCurrency).then((balance)=>{
      this.baseBalance = balance.baseCurrency;
      this.tradeBalance = balance.tradeCurrency;
    });
  }

}
