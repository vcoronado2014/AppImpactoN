import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';

import { WelcomePage } from '../../pages/welcome/welcome'
import { User } from '../../providers';
import { Api } from '../../providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any[];

  constructor(public navCtrl: NavController, public user: User, public api: Api, public toastCtrl: ToastController,
    public translateService: TranslateService, public loading: LoadingController) {

      this.ionViewLoaded();
    //this.obtenerInicio();
/*
    this.cardItems = [
      {
        user: {
          avatar: 'assets/img/marty-avatar.png',
          name: 'Marty McFly'
        },
        date: 'November 5, 1955',
        image: 'assets/img/advance-card-bttf.png',
        content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
      },
      {
        user: {
          avatar: 'assets/img/sarah-avatar.png.jpeg',
          name: 'Sarah Connor'
        },
        date: 'May 12, 1984',
        image: 'assets/img/advance-card-tmntr.jpg',
        content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
      },
      {
        user: {
          avatar: 'assets/img/ian-avatar.png',
          name: 'Dr. Ian Malcolm'
        },
        date: 'June 28, 1990',
        image: 'assets/img/advance-card-jp.jpg',
        content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
      }
    ];
*/
  }
  ionViewLoaded() {
    let loader = this.loading.create({
      content: 'Obteniendo los elementos, espera un momento por favor...',
    });
  
    loader.present().then(() => {
      this.obtenerInicio(loader);
      this.cardItems = [
        {
          user: {
            avatar: 'assets/img/marty-avatar.png',
            name: 'Marty McFly'
          },
          date: 'November 5, 1955',
          image: 'assets/img/advance-card-bttf.png',
          content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
        },
        {
          user: {
            avatar: 'assets/img/sarah-avatar.png.jpeg',
            name: 'Sarah Connor'
          },
          date: 'May 12, 1984',
          image: 'assets/img/advance-card-tmntr.jpg',
          content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
        },
        {
          user: {
            avatar: 'assets/img/ian-avatar.png',
            name: 'Dr. Ian Malcolm'
          },
          date: 'June 28, 1990',
          image: 'assets/img/advance-card-jp.jpg',
          content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
        }
      ];
    });
  }

  obtenerInicio(loader) {
    var instId = sessionStorage.getItem("INST_ID");
    var rolId = sessionStorage.getItem("ROL_ID");
    let dataGet = { InstId: instId, RolId: rolId, UsuId: 0, Tipo: '1' };
    let seq = this.api.post('Inicio', dataGet).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      let retorno = res;
      if (retorno != null){
        //this._loggedIn(retorno);
        //ahora procesamos los datos
        loader.dismiss();
      }
      else{
        console.error('ERROR al obtener listado');
        let mensaje = this.mostrarMensaje("Error al obtener Inio", 3000);
        loader.dismiss();
      }
    }, err => {
      console.error('ERROR', err);
      loader.dismiss();
    });

    return seq;
  }
  mostrarMensaje(mensaje, duracion){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: duracion,
      position: 'top'
    });
    toast.present();
  }

  doLogout(){
    this.user.logout();
    sessionStorage.clear();
    this.navCtrl.setRoot(WelcomePage);
  }
}
