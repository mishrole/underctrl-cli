// import { User } from "../user";

export class LoginResponse {
    access_token?: string;
    refresh_token: any;
    email?: string;
    firstname?: string;
    lastname?: string;
    roles: any;
    expires_in?: number;
    jti?: string;
    scope?: string;
    token_type?: string;
    // user?: User;
}