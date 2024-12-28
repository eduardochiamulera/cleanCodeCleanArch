import AccountRepository from "./accountRepository";

export default class GetByEmail{
    constructor(readonly accountRepository: AccountRepository){

    }

    async executeAsync(input: string) {
        
        const account = await this.accountRepository.getByEmail(input);
        
        if(!account) return undefined;

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