
import { Injectable } from '@angular/core';
import * as Binance from 'binance-api-node';

/*
  Generated class for the BinanceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BinanceProvider {

  client: any;

  constructor() {
    console.log('Hello BinanceProvider Provider');
    this.client = Binance.default({ 
      apiKey: localStorage.getItem('apiKey') || '', 
      apiSecret: localStorage.getItem('apiSecret') || ''  
    });
  }

  getCoinList():Promise<Array<string>>{
    var coinList = [];
    return this.client.exchangeInfo().then((exchangeInfo)=>{
      exchangeInfo.symbols.forEach((symbol)=>{
        var baseCurrency = symbol.quoteAsset;
        var tradeCurrency = symbol.baseAsset;
        if (coinList[baseCurrency]) {
            coinList[baseCurrency].push(tradeCurrency)
        } else {
            coinList[baseCurrency] = [tradeCurrency];
        }
      });
      return coinList;
    });
    
  }

}
