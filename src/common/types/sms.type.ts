export interface SMSPayload {
    mobile_phone: string
    message: string
    from: string
    callback_url: string
}

export  interface SMSSendREsponse {
    id: string
    status: string
    message: string;
}