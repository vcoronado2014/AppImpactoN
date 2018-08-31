import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public api: Api) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      let retorno = res;
      if (retorno != null){
        this._loggedIn(retorno);
      }
      else{
        console.error('ERROR no autentificado');
      }
      /*
      if (res.status == 'success') {
        this._loggedIn(res);
      } else {
      }
      */
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    sessionStorage.setItem('USU_ID', resp.AutentificacionUsuario.Id);
    sessionStorage.setItem('ROL_ID', resp.Rol.Id);
    sessionStorage.setItem('ROL_NOMBRE', resp.Rol.Nombre);
    sessionStorage.setItem('INST_ID', resp.Institucion.Id);
    sessionStorage.setItem('INSTITUCION_NOMBRE', resp.Institucion.Nombre);
    sessionStorage.setItem('PERSONA_NOMBRE', resp.Persona.Nombres + ' ' + resp.Persona.ApellidoPaterno + ' ' + resp.Persona.ApellidoMaterno);
    sessionStorage.setItem('REG_ID', resp.Region.Id);
    sessionStorage.setItem('REG_NOMBRE', resp.Region.Nombre);
    sessionStorage.setItem('COM_ID', resp.Comuna.Id);
    sessionStorage.setItem('COM_NOMBRE', resp.Comuna.Nombre);
    sessionStorage.setItem('ROL_NOMBRE_INSTITUCION', resp.RolInstitucion.Nombre);
    sessionStorage.setItem('ROL_ID_INSTITUCION', resp.RolInstitucion.IdOriginal);
    //this._user = resp.user;
    this._user = resp.AutentificacionUsuario.NombreUsuario;
  }
}
