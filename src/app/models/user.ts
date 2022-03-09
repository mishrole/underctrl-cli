import { Account } from "./account";
import { Role } from "./role";

export class User {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	birthday: Date;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	deleted: boolean;
	roles: Role[];
	accounts: Account[];

}