export enum EverificationTypes {
    REGISTER='register',
    RESET_PASSWORD='reset_password',
    EDIT_PHONE='edit_phone'
}

export interface ICheckOtp {
    type: EverificationTypes
    phone: string
    otp: string;
}