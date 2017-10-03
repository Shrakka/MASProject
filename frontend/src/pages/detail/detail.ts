import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  firstname: string;
  lastname: string;
  picture: string;
  shortDescription: string;
  longDescription: string;
  lessons: string[];
  comment: string = '';
  askmessage: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.firstname = this.navParams.get('firstname');
    this.lastname = this.navParams.get('lastname');
    this.picture = this.navParams.get('picture');
    this.shortDescription = this.navParams.get('shortDescription');
    this.lessons = this.navParams.get('lessons');
    this.longDescription = this.navParams.get('longDescription');
    this.askmessage = this.navParams.get('askmessage');
  }

  ionViewDidLoad() {
  }

  sendMessage() {
    const alert = this.alertCtrl.create({
      title: 'Message sent',
      message: this.firstname + ' will certainly contact you soon. You will be notified.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('OK clicked');
          }
        }],
    })
    alert.present();
  }

}