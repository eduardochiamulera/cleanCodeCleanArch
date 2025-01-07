import Account from "../../domain/entity/Account";
import Transaction from "../../domain/entity/Transaction";
import { DatabaseConnection } from "../database/DatabaseConnection";
import { inject } from "../di/DI";

// Port
export default interface TransactionRepository {
	getTransactionById (transactionId: string): Promise<Transaction>;
	getTransactionByRideId (rideId: string): Promise<Transaction>;
	saveTransaction (transaction: Transaction): Promise<void>;
}

// Adapter
export class TransactionRepositoryDatabase implements TransactionRepository {
	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async saveTransaction (transaction: Transaction) {
		console.log("saveTransaction", transaction);
		await this.connection?.query(`insert into ccca.transaction (transaction_id, ride_id, amount, date, status) 
			values ($1, $2, $3, $4, $5)`, [transaction.getTransactionId(), transaction.getRideId(), transaction.getAmount(), transaction.getDate(), transaction.getStatus()]);
	}
	
	async getTransactionById (transactionId: string) {
		const [transactionData] = await this.connection?.query("select * from ccca.transaction where transaction_id = $1", [transactionId]);
		if(!transactionData) throw new Error("");
		return new Transaction(transactionData.transaction_id, transactionData.ride_id, parseFloat(transactionData.amount), transactionData.date, transactionData.status);
	}

	async getTransactionByRideId (rideId: string) {
		const [transactionData] = await this.connection?.query("select * from ccca.transaction where ride_id = $1", [rideId]);
		if(!transactionData) throw new Error("");
		return new Transaction(transactionData.transaction_id, transactionData.ride_id, parseFloat(transactionData.amount), transactionData.date, transactionData.status);
	}
}
