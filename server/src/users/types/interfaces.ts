import { Request } from 'express';

export interface RequestPassport extends Request {
	//TODO типизировать 
	user: any;
	session: any;
}