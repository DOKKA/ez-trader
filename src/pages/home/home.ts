import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import * as Binance from 'binance-api-node';


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
  coinList;
  client;

  constructor(public navCtrl: NavController,private http: HTTP) {
    this.baseData = ['BNB','BTC','ETH','USDT'];
    this.coinData = ['STRAT','ETH','ICO','XRB','XLM'];
    this.base = 'BTC';
    this.coin = 'XLM';
    this.price = .003;
    this.coinList = {};
    this.client = Binance.default({
      apiKey: localStorage.getItem('apiKey') || '',
      apiSecret: localStorage.getItem('apiSecret') || '' 
    });
    this.client.exchangeInfo().then((exchangeInfo)=>{
      exchangeInfo.symbols.forEach((symbol)=>{
        var baseCurrency = symbol.quoteAsset;
        var tradeCurrency = symbol.baseAsset;
        if (this.coinList[baseCurrency]) {
            this.coinList[baseCurrency].push(tradeCurrency)
        } else {
            this.coinList[baseCurrency] = [tradeCurrency];
        }
      });
    });

  }

  getLimitPrice =() => {
    let percentage = this.limitPercentage/100+1;
    return parseFloat((percentage * this.price).toFixed(8));
  }

  button1 =(e) => {
    
  }

  onBaseSelect =(e)=>{
    this.coinData = this.coinList[this.base];
  }
  onCoinSelect = (e) =>{
    this.client.dailyStats({ symbol:  this.coin+this.base }).then((data)=>{
      this.price = parseFloat(data.askPrice);
    });
  }

}
