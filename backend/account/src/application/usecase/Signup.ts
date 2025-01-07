import Account from "../../domain/entity/Account";
import { inject } from "../../infra/di/DI";
import MailerGateway from "../../infra/gateway/MailerGateway";
import AccountRepository from "../../infra/repository/AccountRepository";

//Use Case
export default class Signup {

	@inject("accountRepository")
	accountRepository?: AccountRepository;

	@inject("mailerGateway")
	mailerGateway?: MailerGateway;

	async execute (input: any) {
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver, input.passwordType || "textplain");
		const accountData = await this.accountRepository?.getAccountByEmail(input.email);
		if (accountData) throw new Error("Duplicated account");
		await this.accountRepository?.saveAccount(account);
		await this.mailerGateway?.send(account.getEmail(), "Welcome!", "...");
		return {
			accountId: account.getAccountId()
		};
	}
}
