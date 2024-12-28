import AccountRepository from "./AccountRepository";

export default class GetByEmail{
    constructor(readonly accountRepository: AccountRepository){

    }

    async executeAsync(input: string) {
        const account = await this.accountRepository.getByEmail(input);

        return {
            accountId: account?.accountId,
            name: account?.name,
            email: account?.email,
            cpf: account?.cpf,
            carPlate: account?.carPlate,
            password: account?.password,
            isPassenger: account?.isPassenger,
            isDriver: account?.isDriver,
        };
    }
}