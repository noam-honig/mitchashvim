export const terms = {
    username: "שם משתמש",
    signIn: "כניסה",
    confirmPassword: "אימות סיסמה",
    signUp: "רישום",
    doesNotMatchPassword: "סיסמה אינה תואמת את האימות",
    password: 'סיסמה',
    updateInfo: "עדכון פרטים אישיים",
    changePassword: "עדכון סיסמה",
    hello: "שלום",
    invalidOperation: "פעולה לא תקינה",
    admin: 'מנהל',
    yes: 'כן',
    no: 'לא',
    ok: 'Ok',
    areYouSureYouWouldLikeToDelete: "האם למחוק",
    cancel: 'בטל',
    home: 'בית',
    userAccounts: 'ניהול משתמשים',
    signOut: 'יציאה'
}

declare module 'remult' {
    export interface Remult {
        adminBypass: boolean
    }
}
