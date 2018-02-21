import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-keys',
  templateUrl: 'keys.html',
})
export class KeysPage {

  apiKey: string;
  apiSecret: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.apiKey = localStorage.getItem('apiKey') || '';
    this.apiSecret = localStorage.getItem('apiSecret') || '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KeysPage');
  }

  saveKeys =() => {
    localStorage.setItem('apiKey', this.apiKey);
    localStorage.setItem('apiSecret', this.apiSecret);
  }

}
