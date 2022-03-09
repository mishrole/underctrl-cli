export class BaseResponse<T> {
	title: any;
	detail: any;
    data?: T;
	errors?: any[];
    status?: number;

}