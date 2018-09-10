import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, Platform } from 'ionic-angular';
import { WelcomePage } from '../../pages/welcome/welcome'
import { User } from '../../providers';
import { Api } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
//descargas
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { PhotoViewer } from '@ionic-native/photo-viewer';

declare var cordova: any;
import * as dl from '../../../node_modules/cordova-plugin-android-downloadmanager';

/**
 * Generated class for the ListaDocumentosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-lista-documentos',
  templateUrl: 'lista-documentos.html',
})
export class ListaDocumentosPage {
  documentos: any[];

  constructor(public navCtrl: NavController, public user: User, public api: Api, public toastCtrl: ToastController,
    public translateService: TranslateService, public loading: LoadingController,
    private document: DocumentViewer, private file: File, private transfer: FileTransfer, private platform: Platform,
    private photoViewer: PhotoViewer) {
      //this.ionViewDidLoad();
      //this.descargar('item');

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaDocumentosPage');
    let loader = this.loading.create({
      content: 'Obteniendo los elementos, espera un momento por favor...',
    });

    loader.present().then(() => {
      this.obtenerDocumentos(loader, null);

    });
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      //this.obtenerDocumentosRefresh(refresher);
      this.obtenerDocumentos(null, refresher);
      //refresher.complete();
    }, 2000);
  }
  obtenerDocumentos(loader, refresher){
    /*
Id
:
1
MostrarItem1:false
NombreCompleto:"calendario_1.PNG"
NombreUsuario:"03-12-2017"
OtroCinco:""
OtroCuatro:null
OtroDiez:null
OtroDoce:null
OtroDos:"http://docs.google.com/viewer?url=http://apps.asambleas.cl/Repositorio/calendario_1.PNG &embedded=true"
OtroNueve:null
OtroOcho:null
OtroOnce:null
OtroSeis:null
OtroSiete:null
OtroTres:".PNG"
OtroUno:"15 Kb"
QuorumMinimo:null
Rol:null
TotalUsuarios:null
Url:"http://apps.asambleas.cl/Repositorio/calendario_1.PNG"
    */
    var instId = sessionStorage.getItem("INST_ID");
    var usuId = sessionStorage.getItem("USU_ID");
    let dataGet = { InstId: instId, UsuId: usuId };
    let seq = this.api.post('FileDocumento', dataGet).share();
    this.documentos = [];

    seq.subscribe((res: any) => {
      let retorno = res;
      if (retorno != null){
        for(var i=0; i<retorno.proposals.length; i++){
          var doc = retorno.proposals[i].OtroTres;
          var icono = 'document';
          switch (doc.toUpperCase()){
            case '.PNG':
            case '.JPG':
            case '.GIF':
              icono = 'image'
              break;
          }
          
          var entidad = {
            Icono: icono,
            NombreDocumento: retorno.proposals[i].NombreCompleto,
            Fecha: retorno.proposals[i].NombreUsuario,
            Tamano: retorno.proposals[i].OtroUno,
            UrlGoogle: retorno.proposals[i].OtroDos,
            UrlDescarga: retorno.proposals[i].Url,
            OtroTres: retorno.proposals[i].OtroTres
          };
          this.documentos.push(entidad);

        }
        
        if(loader)
          loader.dismiss();
        if(refresher)
          refresher.complete();
      }
      else {
        if (loader)
          loader.dismiss();
        if (refresher)
          refresher.complete();
      }

    }, err => {
      console.error('ERROR', err);
      if (loader)
        loader.dismiss();
      if (refresher)
        refresher.complete();
    });

    return seq;
  }
  
  descargar(item){
    var titulo = 'Descarga';
    var descripcion = 'archivo asambleas';
    var mime = 'application/zip';
    var uri = item.Url;

    if (item.OtroTres == '.JPG' || item.OtroTres == '.jpg'){
      mime = 'image/jpeg';
      this.openPhoto(item);
    }
    else if (item.OtroTres == '.PNG' || item.OtroTres == '.png'){
      mime = 'image/bmp';
      this.openPhoto(item);
    }
    else if (item.OtroTres == '.PDF' || item.OtroTres == '.pdf'){
      mime = 'application/pdf';
      this.downloadOpenPdf(item.UrlDescarga, mime, 'archivo.pdf');
    }


    
    /*
    let filet = this.transfer.create();
    //var fileTransfer: FileTransferObject = this.transfer.create();
    //UrlDescarga
    const url =item.UrlDescarga;
    filet.download(url, cordova.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
    });
    */

  }
  openPhoto(item){
    var options = {
      share: true, // default is false
      closeButton: true, // default is true
      copyToReference: true // default is false
  };
  
    this.photoViewer.show(item.UrlDescarga, 'Optional Title', options);
  }
  openLocalPdf(item) {
    try {
      const options: DocumentViewerOptions = {
        title: 'My PDF'
      }
      this.document.viewDocument(item.UrlDescarga, 'application/pdf', options);
    }
    catch (error) {
      this.mostrarMensaje(error, 3000);
    }
  }
  downloadAndOpenPdf(item) {
    try {
      let path = null;

      if (this.platform.is('ios')) {
        path = this.file.documentsDirectory;
      } else if (this.platform.is('android')) {
        path = this.file.dataDirectory;
      }

      const transfer = this.transfer.create();
      transfer.download(item.UrlDescarga, path + 'myfile.pdf').then(entry => {
        let url = entry.toURL();
        this.document.viewDocument(url, 'application/pdf', {});
      });
    }
    catch (error) {
      this.mostrarMensaje(error, 3000);
    }
  }
  downloadOpenPdf(urlDescarga, mime, name) {
    try {
      let path = null;

      if (this.platform.is('ios')) {
        path = this.file.documentsDirectory;
      } else if (this.platform.is('android')) {
        path = this.file.dataDirectory;
      }

      const transfer = this.transfer.create();
      transfer.download(urlDescarga, path + name).then(entry => {
        let url = entry.toURL();
        this.document.viewDocument(url, mime, {});
      });
    }
    catch (error) {
      this.mostrarMensaje(error, 3000);
    }
  }

}
