export class User {
    public user_id: number;
    public token: string;
    public email: string;
    public username: string;
    public birthday: string;
    public password: string;
    public premium: boolean
    public active: boolean;
    public admin: boolean;
    public moderator: boolean;
    public achievement: any[];
    public timezone: string;
    public image: string;
    public birthdayDate?: Date;
}