import { Account } from "./account";
import { Category } from "./category";
import { Type } from "./type";

export class Record {
	id: number;
	name: string;
	concept: string;
	account: Account;
	category: Category;
	type: Type;
	recordDate: string;
	createdAt: Date;
	updatedAt: Date;
	amount: number;
	deleted: boolean;
}