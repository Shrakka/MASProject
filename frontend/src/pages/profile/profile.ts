import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, AlertController, PopoverController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { EditProfilePage } from '../profile/editprofile/editprofile';
import { TranslateService } from 'ng2-translate'; 

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';


declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public bannerURL;

  constructor(public navCtrl: NavController,public modalCtrl: ModalController, public navParams: NavParams, public userProvider: UserProvider,public popoverCtrl: PopoverController, public alertCtrl: AlertController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public translate: TranslateService) {
    }

  ionViewDidLoad() {
    this.bannerURL = 'assets/img/orange.jpg';
  }

  modifyprofile(myEvent){
    let fieldname = myEvent.currentTarget.children[0].innerText;
    if(fieldname=="Looking for?" || fieldname=="Que recherches-tu ?"
    || fieldname=="Introduce yourself!" || fieldname=="Présente-toi"){
       const editModal = this.modalCtrl.create(EditProfilePage, {field:fieldname});
      editModal.onDidDismiss(data => {
      // this.takeForm.topics = data.map(obj => obj.key);
      // this.topicsDisplay = data.map(obj => obj.name);
      // console.log(this.takeForm.topics);
    })
    editModal.present();
    }else{
    	let popover = this.popoverCtrl.create(EditProfilePage, {field:fieldname});
      popover.present({
        ev: myEvent
      });
    }
  }

  photoEdit() {
    // const alert = this.alertCtrl.create({
    //   title: 'Login',
    //   inputs: [
    //     {
    //       name: 'url',
    //       placeholder: 'New URL'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Set',
    //       handler: data => {
    //         this.userProvider.user.public.picture = 'assets/img/' + data.url + '.png';
    //         this.userProvider.updateUser();
    //       }
    //     },
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     }
    //   ]

    // });
    // alert.present();
    this.presentActionSheet();


  }

  coverEdit() {
    const alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'url',
          placeholder: 'New URL',
          type: 'textarea'
        },
      ],
      buttons: [
        {
          text: 'Set',
          handler: data => {
            this.bannerURL = 'assets/img/' + data.url;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]

    });
    alert.present();
  }

  logout() {
    this.userProvider.isAuth = false;
    this.navCtrl.push('LoginPage');
  }

  // ------------------------- FILE UPLOAD -------------------------
  loading: Loading;

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: (this.translate.get("PROFILE_SOURCE") as any).value,
      buttons: [
        {
          text: (this.translate.get("PROFILE_LIBRARY") as any).value,
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: (this.translate.get("PROFILE_CAMERA") as any).value,
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: (this.translate.get("PROFILE_CANCEL") as any).value,
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            let fileName = this.createFileName();
            this.copyAndSend(correctPath, currentName, fileName);
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        let fileName = this.createFileName();
        this.copyAndSend(correctPath, currentName, fileName);
      }
    }, (err) => {
      this.presentToast((this.translate.get("PROFILE_ERROR") as any).value);
    });
  }

  // Create a new name for the image
private createFileName() {
  return Date.now() + '.jpg';
}
 
// Copy the image to a local folder and send to backend.
private copyAndSend(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.sendPhoto(newFileName);
  }, error => {
    this.presentToast((this.translate.get("PROFILE_ERROR") as any).value);
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

  public sendPhoto(fileName) {
    var url = this.userProvider.getPostPhotoURL(this.userProvider.user.id);
    var targetPath = this.pathForImage(fileName);
    var options = {
      fileKey: "photo",
      fileName: fileName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {'fileName': fileName}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loading = this.loadingCtrl.create({
      content: "Uploading photo..."
    });
    this.loading.present();

    fileTransfer.upload(targetPath, url, options).then(data => {
      let response = JSON.parse(data.response);
      console.log(response);
      this.userProvider.user.public = response;
      this.loading.dismissAll()
      this.presentToast((this.translate.get("PROFILE_SUCCESS") as any).value);
    }, err => {
      console.log(err);
      this.loading.dismissAll()
      this.presentToast((this.translate.get("PROFILE_ERROR") as any).value);
    });
  }



}
