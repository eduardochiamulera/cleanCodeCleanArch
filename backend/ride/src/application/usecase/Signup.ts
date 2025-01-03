import Account from "../../domain/entity/Account";
import { inject } from "../../infra/di/DI";
import MailerGateway from "../../infra/gateway/MailerGateway";
import AccountRepository from "../../infra/repository/AccountRepository";

//Use Case
export default class Signup {

	//Dependency Inversion Principle - Dependency Injection
	// constructor (readonly accountRepository: AccountRepository, readonly mailerGateway: MailerGateway) {
	// }

	@inject("accountRepository")
	accountRepository?: AccountRepository;

	@inject("mailerGateway")
	mailerGateway?: MailerGateway;

	async execute (input: any) {
		//orquestrar entidades - orquestrate the dance of the entities
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver, input.passwordType || "textplain");
		//orquestrando recursos
		const accountData = await this.accountRepository?.getAccountByEmail(input.email);
		if (accountData) throw new Error("Duplicated account");
		await this.accountRepository?.saveAccount(account);
		await this.mailerGateway?.send(account.getEmail(), "Welcome!", "...");
		return {
			accountId: account.getAccountId()
		};
	}
}
