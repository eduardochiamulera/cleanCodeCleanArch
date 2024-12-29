export default interface MailerGateway {
    send(receipt: string, subject: string, message: string): Promise<void>;
}

export default class MailerGatewayMemory implements MailerGateway {
    
    async send(receipt: string, subject: string, message: string): Promise<void>{
        console.log(receipt, subject, message);
    }
}