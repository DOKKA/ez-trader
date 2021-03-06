
import { Injectable } from '@angular/core';
import * as Binance from 'binance-api-node';
import * as _ from 'lodash';

/*
  Generated class for the BinanceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

interface Balance{
  baseCurrency: number;
  tradeCurrency: number;
}

@Injectable()
export class BinanceProvider {

  client: any;
  closeFn: any;

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

  getBalances(baseCurrency: string, tradeCurrency:string):Promise<Balance>{
    return this.client.accountInfo().then((info)=>{
      var trade = _.find(info.balances,{asset: tradeCurrency});
      var base = _.find(info.balances,{asset: baseCurrency});
      return {
        baseCurrency: parseFloat(base.free),
        tradeCurrency: parseFloat(trade.free)
      };
    });
  }

  getPrice(baseCurrency:string, tradeCurrency:string):Promise<number>{
    return this.client.dailyStats({ symbol:  tradeCurrency + baseCurrency }).then((data)=>{
      return parseFloat(data.lastPrice);
    });
  }

  getPrecision(baseCurrency:string, tradeCurrency: string):Promise<number>{
    return this.client.exchangeInfo().then((exchangeInfo)=>{ 
      var symbol = _.find(exchangeInfo.symbols, {symbol: tradeCurrency+baseCurrency});
      var lotSize = _.find(symbol.filters, {filterType: 'LOT_SIZE'});
      return Math.log10(parseFloat(lotSize.minQty))*(-1);
    });
  }

  createBuy(baseCurrency: string, tradeCurrency: string, amount: number, price: number):Promise<any>{
    return this.client.order({
      symbol: tradeCurrency+baseCurrency,
      side: 'BUY',
      quantity: amount,
      price: price
    });
  }

  createSell(baseCurrency: string, tradeCurrency: string, amount: number, price: number):Promise<any>{
    return this.client.order({
      symbol: tradeCurrency+baseCurrency,
      side: 'SELL',
      quantity: amount,
      price: price
    });
  }

  ticker(baseCurrency: string, tradeCurrency: string, cb:any){
    var currencyPair = (tradeCurrency + baseCurrency).toLowerCase();
    var socket = new WebSocket(`wss://stream.binance.com:9443/ws/${currencyPair}@ticker`);
    socket.onmessage = (event) =>{
      var data = JSON.parse(event.data)
      if(data.e === '24hrTicker'){
        cb(data)
      }
    }
    return function(){
      if(socket.readyState !== socket.CLOSED){
        socket.close();
      }
      
    }
  }

}
