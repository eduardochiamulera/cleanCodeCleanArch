import pgp from "pg-promise";
import Account from "./account";

export default interface AccountRepository {
	save (account: Account): Promise<void>;
	getByCode (code: string): Promise<Account>;
	getByEmail (email: string): Promise<Account | undefined>;
}

export class AccountRepositoryDatabase implements AccountRepository {
    async getByEmail(email: string): Promise<Account | undefined> {
        const connection = pgp()("postgres://postgres:123456@localhost:5434/app");
		const [accountData] = await connection.query("select * from ccca.account where email = $1", [email]);
		await connection.$pool.end();
        if(!accountData) return;
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.password,
            accountData.is_passenger, accountData.is_driver);
    }

	async save(account: Account): Promise<void> {
		console.log("Account", account);
		const connection = pgp()("postgres://postgres:123456@localhost:5434/app");
		await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, password, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, account.password, account.isPassenger, account.isDriver]);
		await connection.$pool.end();
	}

	async getByCode(code: string): Promise<Account> {
		const connection = pgp()("postgres://postgres:123456@localhost:5434/app");
		const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [code]);
		await connection.$pool.end();
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.password,
            accountData.is_passenger, accountData.is_driver);
	}

}