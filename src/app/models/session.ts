import { User } from "./user";

export class Session {
	authenticated: boolean = false;
	user?: User;
	// token_type: string;
	// scope: string;
	access_token?: string;
	refresh_token?: string;
	// expires_in: number;
	// jti: string;

	constructor(access_token?: string, refresh_token?: string, user?: User) {
		this.access_token = access_token;
		this.refresh_token = refresh_token;
		this.user = user;
	}
}