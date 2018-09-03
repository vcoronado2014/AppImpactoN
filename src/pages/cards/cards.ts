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
  documentos: any[];
  establecimientos: any[];
  eventos: any[];
  proyectos: any[];
  rendiciones: any [];
  usuarios: any[];
  votaciones: any[];
  muro: any[];

  constructor(public navCtrl: NavController, public user: User, public api: Api, public toastCtrl: ToastController,
    public translateService: TranslateService, public loading: LoadingController) {

      this.ionViewLoaded();
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.obtenerInicioRefresh(refresher);
      //refresher.complete();
    }, 2000);
  }
  ionViewLoaded() {
    let loader = this.loading.create({
      content: 'Obteniendo los elementos, espera un momento por favor...',
    });
  
    loader.present().then(() => {
      this.obtenerInicio(loader);
    });
  }
  obtenerMuro(loader){
    var instId = sessionStorage.getItem("INST_ID");
    var usuId = sessionStorage.getItem("USU_ID");
    let dataGet = { InstId: instId, UsuId: usuId };
    let seq = this.api.post('Muro', dataGet).share();

    seq.subscribe((res: any) => {
      let retorno = res;
      if (retorno != null){
        this.muro = retorno;
        var ultimo = this.muro.pop();
        var card = {
          user: {
            avatar: '',
            name: 'Novedades'
          },
          date: ultimo.FechaCreacion,//poner la ultima fecha
          image: '',
          content: 'Existen ' + (this.muro.length + 1) + ' novedades.',
          icon: 'chatbubbles',
          suma: this.muro.length + 1
        };
        this.cardItems.push(card);
        loader.dismiss();
      }
      else {
        loader.dismiss();
      }

    }, err => {
      console.error('ERROR', err);
      loader.dismiss();
    });

    return seq;
  }

  obtenerMuroRefresh(refresher){
    var instId = sessionStorage.getItem("INST_ID");
    var usuId = sessionStorage.getItem("USU_ID");
    let dataGet = { InstId: instId, UsuId: usuId };
    let seq = this.api.post('Muro', dataGet).share();

    seq.subscribe((res: any) => {
      let retorno = res;
      if (retorno != null){
        this.muro = retorno;
        var ultimo = this.muro.pop();
        var card = {
          user: {
            avatar: '',
            name: 'Novedades'
          },
          date: ultimo.FechaCreacion,//poner la ultima fecha
          image: '',
          content: 'Existen ' + (this.muro.length + 1) + ' novedades.',
          icon: 'chatbubbles',
          suma: this.muro.length + 1
        };
        this.cardItems.push(card);
        refresher.complete();
      }
      else {
        refresher.complete();
      }

    }, err => {
      console.error('ERROR', err);
      refresher.complete();
    });

    return seq;
  }

  obtenerInicio(loader) {
    var instId = sessionStorage.getItem("INST_ID");
    var rolId = sessionStorage.getItem("ROL_ID");
    let dataGet = { InstId: instId, RolId: rolId, UsuId: 0, Tipo: '1' };
    let seq = this.api.post('Inicio', dataGet).share();
    this.cardItems = [];

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      let retorno = res;
      if (retorno != null){
        //this._loggedIn(retorno);
        //ahora procesamos los datos
        if (retorno.Documentos){
          if (retorno.Documentos.proposals){
            this.documentos = retorno.Documentos.proposals;
            var ultimo = this.documentos.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Documentos'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.documentos.length + 1) + ' documentos creados.',
              icon: 'document',
              suma: this.documentos.length + 1
            };
            this.cardItems.push(card);

          }
        }
        if (retorno.Establecimientos){
          if (retorno.Establecimientos.proposals){
            this.establecimientos = retorno.Establecimientos.proposals;
            var ultimo = this.establecimientos.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Establecimientos'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.establecimientos.length + 1) + ' establecimientos creados.',
              icon: 'home',
              suma: this.establecimientos.length + 1
            };
            this.cardItems.push(card);

          }
        }
        if (retorno.Eventos){
            this.eventos = retorno.Eventos;
            var ultimo = this.eventos.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Eventos'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.eventos.length + 1) + ' eventos creados.',
              icon: 'calendar',
              suma: this.eventos.length + 1
            };
            this.cardItems.push(card);
        }
        if (retorno.Proyectos){
          if (retorno.Proyectos.proposals){
            this.proyectos = retorno.Proyectos.proposals;
            var ultimo = this.proyectos.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Proyectos'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.proyectos.length + 1) + ' establecimientos creados.',
              icon: 'albums',
              suma: this.proyectos.length + 1
            };
            this.cardItems.push(card);

          }
        }
        if (retorno.Rendiciones){
          if (retorno.Rendiciones.proposals){
            this.rendiciones = retorno.Rendiciones.proposals;
            var ultimo = this.rendiciones.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Rendiciones'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.rendiciones.length + 1) + ' Rendiciones creadas.',
              icon: 'logo-usd',
              suma: this.rendiciones.length + 1
            };
            this.cardItems.push(card);

          }
        }
        if (retorno.Usuarios){
            this.usuarios = retorno.Usuarios;
            var ultimo = this.usuarios.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Usuarios'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.usuarios.length + 1) + ' creados.',
              icon: 'contact',
              suma: this.usuarios.length + 1
            };
            this.cardItems.push(card);
        }
        this.obtenerMuro(loader);
        //loader.dismiss();
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
  obtenerInicioRefresh(refresher) {
    var instId = sessionStorage.getItem("INST_ID");
    var rolId = sessionStorage.getItem("ROL_ID");
    let dataGet = { InstId: instId, RolId: rolId, UsuId: 0, Tipo: '1' };
    let seq = this.api.post('Inicio', dataGet).share();
    this.cardItems = [];

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      let retorno = res;
      if (retorno != null){
        //this._loggedIn(retorno);
        //ahora procesamos los datos
        if (retorno.Documentos){
          if (retorno.Documentos.proposals){
            this.documentos = retorno.Documentos.proposals;
            var ultimo = this.documentos.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Documentos'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.documentos.length + 1) + ' documentos creados.',
              icon: 'document',
              suma: this.documentos.length + 1
            };
            this.cardItems.push(card);

          }
        }
        if (retorno.Establecimientos){
          if (retorno.Establecimientos.proposals){
            this.establecimientos = retorno.Establecimientos.proposals;
            var ultimo = this.establecimientos.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Establecimientos'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.establecimientos.length + 1) + ' establecimientos creados.',
              icon: 'home',
              suma: this.establecimientos.length + 1
            };
            this.cardItems.push(card);

          }
        }
        if (retorno.Eventos){
            this.eventos = retorno.Eventos;
            var ultimo = this.eventos.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Eventos'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.eventos.length + 1) + ' eventos creados.',
              icon: 'calendar',
              suma: this.eventos.length + 1
            };
            this.cardItems.push(card);
        }
        if (retorno.Proyectos){
          if (retorno.Proyectos.proposals){
            this.proyectos = retorno.Proyectos.proposals;
            var ultimo = this.proyectos.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Proyectos'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.proyectos.length + 1) + ' establecimientos creados.',
              icon: 'albums',
              suma: this.proyectos.length + 1
            };
            this.cardItems.push(card);

          }
        }
        if (retorno.Rendiciones){
          if (retorno.Rendiciones.proposals){
            this.rendiciones = retorno.Rendiciones.proposals;
            var ultimo = this.rendiciones.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Rendiciones'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.rendiciones.length + 1) + ' Rendiciones creadas.',
              icon: 'logo-usd',
              suma: this.rendiciones.length + 1
            };
            this.cardItems.push(card);

          }
        }
        if (retorno.Usuarios){
            this.usuarios = retorno.Usuarios;
            var ultimo = this.usuarios.pop();
            var card = {
              user: {
                avatar: '',
                name: 'Usuarios'
              },
              date: ultimo.NombreUsuario,//poner la ultima fecha
              image: '',
              content: 'Existen ' + (this.usuarios.length + 1) + ' creados.',
              icon: 'contact',
              suma: this.usuarios.length + 1
            };
            this.cardItems.push(card);
        }
        //refresher.complete();
        this.obtenerMuroRefresh(refresher);
      }
      else{
        console.error('ERROR al obtener listado');
        let mensaje = this.mostrarMensaje("Error al obtener Inio", 3000);
       refresher.complete();
      }
    }, err => {
      console.error('ERROR', err);
      refresher.complete();
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
