import GetTransaction from "../../application/usecase/GetTransaction";
import ProcessPayment from "../../application/usecase/ProcessPayment";
import { inject } from "../di/DI";
import HttpServer from "../http/HttpServer";

export default class PaymentController {
    @inject("httpServer")
    httpServer?: HttpServer;
    @inject("processPayment")
    processPayment!: ProcessPayment;
    @inject("getTransaction")
    getTransaction!: GetTransaction;

    constructor(){
        this.httpServer?.register("post", "/transaction", async (params: any, body: any) => {
            const input = body;
            const output = await this.processPayment?.execute(input);
            return output;
        });
        
        this.httpServer?.register("get","/transactions/:transactionId", async (params: any, body: any) => {
            const output = await this.getTransaction?.execute(params.transactionId);
            return output;
        });
    }
}