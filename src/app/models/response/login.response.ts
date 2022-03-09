import { User } from "../user";

export class LoginResponse {
    accessToken?: string;
    refreshToken: any;
    user?: User;
}