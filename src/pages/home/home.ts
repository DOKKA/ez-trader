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
  basePriceUSDT: number;
  balancePercentage: number;
  limitPercentage: number;

  baseBalance: number;
  tradeBalance: number;

  baseData: Array<string>;
  coinData: Array<string>;
  baseCurrency: string;
  tradeCurrency: string;
  isBuyMode: boolean;
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
    this.isBuyMode = true;
    this.setBalances();
    this.binanceProvider.getCoinList().then((coins)=>{
      this.coinList = coins;
    });
  }

  getLimitPrice =() => {
    if(this.isBuyMode){
      let percentage = 1-this.limitPercentage/100;
      return parseFloat((percentage * this.tradePrice).toFixed(8));
    } else {
      let percentage = (this.limitPercentage/100)+1;
      return parseFloat((percentage * this.tradePrice).toFixed(8));
    }

  }

  getBaseAmount = () => {
    if(this.isBuyMode){
      return parseFloat(((this.balancePercentage/100)*this.baseBalance).toFixed(8));
    } else {
      return parseFloat(((this.balancePercentage/100)*this.tradeBalance).toFixed(8));
    }
  }

  getTradeAmount = () => {
    if(this.isBuyMode){
      return parseFloat((this.getBaseAmount()/this.getLimitPrice()).toFixed(8));
    } else{
      return parseFloat((this.getBaseAmount()*this.getLimitPrice()).toFixed(8));
    }
  }

  getBaseAmountUSDT = () => {
    if(this.isBuyMode){
      return (this.getBaseAmount()*this.basePriceUSDT).toFixed(2);
    } else {
      return (this.getTradeAmount()*this.basePriceUSDT).toFixed(2);
    }
    
  }

  getTradePriceUSDT = () => {
    return (this.getLimitPrice()*this.basePriceUSDT).toFixed(2);
  }

  getBaseBalanceUSDT = () => {
    return (this.baseBalance*this.basePriceUSDT).toFixed(2);
  }

  getTradeBalanceUSDT = () => {
    return (this.tradePrice*this.basePriceUSDT*this.tradeBalance).toFixed(2);
  }

  getMode = () => {
    return this.isBuyMode === true ? 'buy' : 'sell';
  }

  getButton2Text = () => {
    return this.isBuyMode === true ? 'FOMO Buy' : 'Panic Sell'; 
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
    if(this.baseCurrency === 'USDT'){
      this.basePriceUSDT = 1;
    } else {
      this.binanceProvider.getPrice('USDT',this.baseCurrency).then((price)=>{
        this.basePriceUSDT = price;
      });
    }

  }

  setBalances =() =>{
    this.binanceProvider.getBalances(this.baseCurrency,this.tradeCurrency).then((balance)=>{
      this.baseBalance = balance.baseCurrency;
      this.tradeBalance = balance.tradeCurrency;
    });
  }

}
