import axios from "axios";

export default class PaymentGateway {

    async payment (input: any): Promise<any> {
		const response = await axios.post("http://localhost:3001/transaction", input);
		return response.data;
	}

	async getTransactionById (transactionId: string) {
		const response = await axios.get(`http://localhost:3001/transactions/${transactionId}`);
		return response.data;
	}
}