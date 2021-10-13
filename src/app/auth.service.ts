import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt from 'jsonwebtoken';
import { BackendMethod, Remult, UserInfo } from 'remult';
import { Roles } from './users/roles';
import { Users } from './users/users';

const AUTH_TOKEN_KEY = "authToken";
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private remult: Remult) {
        let token = AuthService.fromStorage();
        if (token) {
            this.setAuthToken(token);
        }
    }

    async signIn(username: string, password: string) {
        this.setAuthToken(await AuthService.signIn(username, password));
    }
    @BackendMethod({ allowed: true })
    static async signIn(user: string, password: string, remult?: Remult) {
        let result: UserInfo;
        let u = await remult!.repo(Users).findFirst(h => h.name.isEqualTo(user));
        if (u)
            if (await u.passwordMatches(password)) {
                result = {
                    id: u.id,
                    roles: [],
                    name: u.name
                };
                if (u.admin) {
                    result.roles.push(Roles.admin);
                }
            }

        if (result!) {
            return (jwt.sign(result, getJwtTokenSignKey()));
        }
        throw new Error("משתמש או סיסמה לא מוכרים");
    }
    setAuthToken(token: string) {
        this.remult.setUser(new JwtHelperService().decodeToken(token));
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    static fromStorage(): string {
        return sessionStorage.getItem(AUTH_TOKEN_KEY)!;
    }

    signOut() {
        this.remult.setUser(undefined!);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
}

export function getJwtTokenSignKey() {
    if (process.env.NODE_ENV === "production")
        return process.env.TOKEN_SIGN_KEY!;
    return "my secret key";
}
