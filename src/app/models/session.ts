import { User } from './user';

export class Session {
  authenticated = false;
  user?: User;
  // tslint:disable-next-line:variable-name
  access_token?: string;
  // tslint:disable-next-line:variable-name
  refresh_token?: string;

  // token_type: string;
  // scope: string;
  // expires_in: number;
  // jti: string;

  // tslint:disable-next-line:variable-name
  constructor(access_token?: string, refresh_token?: string, user?: User) {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.user = user;
  }
}
