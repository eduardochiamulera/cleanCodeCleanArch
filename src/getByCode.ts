import AccountRepository from "./AccountRepository";

export default class GetByCode{
    constructor(readonly accountRepository: AccountRepository){

    }

    async executeAsync(input: string) : Promise<Output> {
        const account = await this.accountRepository.getByCode(input);

        if(!account) throw new Error("Account not found");

        return {
            name: account?.name,
            email: account?.email,
            cpf: account?.cpf,
            carPlate: account?.carPlate,
            isPassenger: account?.isPassenger,
            isDriver: account?.isDriver,
        };
    }
}

type Output = {
    name: string,
	email: string,
	cpf: string,
	carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
}