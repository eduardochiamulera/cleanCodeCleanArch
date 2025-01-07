export default interface PaymentGateway {
    execute(input: Input): Promise<Output>;
}

export class ExternalPaymetGateway implements PaymentGateway {
    
    async execute(input: Input): Promise<Output> {
        console.log("value", input.value);
        
        return {
            success: true,
            message: "Payment completed"
        }
    }

}

type Input = {
    value: number,
    creditCard: {
        ccv: number,
        name: string,
        date: string
    }
}

type Output = {
    success: boolean,
    message: string
}