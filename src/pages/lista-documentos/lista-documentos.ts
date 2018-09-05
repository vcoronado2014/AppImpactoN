import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { WelcomePage } from '../../pages/welcome/welcome'
import { User } from '../../providers';
import { Api } from '../../providers';
import { TranslateService } from '@ngx-translate/core';
//descargas
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
declare var cordova: any;

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
    private transfer: FileTransfer, private file: File) {
      //this.ionViewDidLoad();

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
            UrlDescarga: retorno.proposals[i].Url
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
    let filet = this.transfer.create();
    //var fileTransfer: FileTransferObject = this.transfer.create();
    //UrlDescarga
    const url =item.UrlDescarga;
    filet.download(url, cordova.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
    });
  }

}
