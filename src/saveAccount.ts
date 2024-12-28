import Account from "./account";
import AccountRepository from "./accountRepository";

export default class SaveAccount {

	constructor (readonly accountRepository: AccountRepository) {
	}

	async executeAsync (input: Input): Promise<void> {
		const account = Account.Create(input.name, input.email, input.cpf, input.carPlate, input.password, input.isPassenger, input.isDriver);
		await this.accountRepository.save(account);		
	}
}

type Input = {
	name: string,
	email: string,
	cpf: string,
	carPlate: string,
    password: string,
    isPassenger: boolean,
    isDriver: boolean,
}