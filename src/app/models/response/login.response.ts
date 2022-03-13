export class LoginResponse {
  // tslint:disable-next-line:variable-name
  access_token?: string;
  // tslint:disable-next-line:variable-name
  refresh_token: any;
  email?: string;
  firstname?: string;
  lastname?: string;
  roles: any;
  id: number;
  // tslint:disable-next-line:variable-name
  expires_in?: number;
  jti?: string;
  scope?: string;
  // tslint:disable-next-line:variable-name
  token_type?: string;
}
