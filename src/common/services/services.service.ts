import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { SMSSendREsponse } from '../types/sms.type';
import * as dotenv from "dotenv"
dotenv.config()
@Injectable()
export class SmsService {
    private readonly TOKEN = process.env.SMS_TOKEN;
    private readonly $from = process.env.SMS_FROM;
    private readonly URL = process.env.SMS_URL;
    private readonly USERNAME = process.env.SMS_USERNAME;
    private readonly CALLBACK_URL = process.env.CALLBACK_URL

    private $axios = axios.create(
        {
            baseURL: this.URL
        }
    );

    public async sendSMS(message: string, to : string) {
        try{
            const { data } = await this.$axios.post<{ data : {token: string} }>('/auth/login', 
                {
                    email : this.USERNAME,
                    password: this.TOKEN
                }
            );
            console.log(data)
            await this.$axios.post<SMSSendREsponse>('/message/sms/send',
                {
                    from : this.$from,
                    message,
                    mobile_phone: to.replace(/[\\s+]/g, ''),
                    callback_url: this.CALLBACK_URL,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + data.data.token
                    }
                }
            );
            return true;

        } catch(error) {
            throw new HttpException(
                'SMS Service: ' + error.response.statusText,
                error.response.status || HttpStatus.BAD_REQUEST
            )
        }
    }
}
