import crypto from "crypto";
import AccountRepository from "./AccountRepository";
import MailerGateway from "./MailerGateway";
import Account from "./Account";
import { inject } from "./DI";

export default class Signup {

	//Dependency Inversion Principle - Dependency Injection
	// constructor (readonly accountRepository: AccountRepository, readonly mailerGateway: MailerGateway) {
	// }

	@inject("accountRepository")
	accountRepository?: AccountRepository;

	@inject("mailerGateway")
	mailerGateway?: MailerGateway;

	async execute (input: any) {
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver);
		const accountData = await this.accountRepository?.getAccountByEmail(input.email);
		if (accountData) throw new Error("Duplicated account");
		await this.accountRepository?.saveAccount(account);
		await this.mailerGateway?.send(account.getEmail(), "Welcome!", "...");
		return {
			accountId: account.getAccountId()
		};
	}
}
