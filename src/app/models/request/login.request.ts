export class LoginRequest {
  username: string;
  password: string;
  // tslint:disable-next-line:variable-name
  grant_type: string;

  // tslint:disable-next-line:variable-name
  constructor(username: string, password: string, grant_type: string) {
    this.username = username,
    this.password = password,
    this.grant_type = grant_type;
  }
}
