import { Currency } from "./currency";
import { Record } from "./record";
import { User } from "./user";

export class Account {
	id: number;
	name: string;
	owner: User;
	currency: Currency;
	records: Record[];
	createdAt: Date;
	updatedAt: Date;
	deleted: boolean;
	total: number;
	income: number;
	expense: number;
}