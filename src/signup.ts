import express from "express";
import { AccountRepositoryDatabase } from "./accountRepository";
import GetByEmail from "./getByEmail";
import SaveAccount from "./saveAccount";

const app = express();
app.use(express.json());

const accountRepository = new AccountRepositoryDatabase();
const getbyEmail = new GetByEmail(accountRepository);
const saveAccount = new SaveAccount(accountRepository);

app.post("/signup", async function (req: any, res: any) {
	const input = req.body;
	
    const accountExists = await getbyEmail.executeAsync(input.email);
    if (accountExists) {
        res.status(422).json({ message: "Email already in use" });  
    }else {
        const account = {
            name: input.name,
	        email: input.email,
	        cpf: input.cpf,
	        carPlate: input.carPlate,
            password: input.password,
            isPassenger: input.isPassenger,
            isDriver: input.isDriver,
        };

        await saveAccount.executeAsync(account);
        const insertedAccount = await getbyEmail.executeAsync(input.email);

        res.json({ accountId: insertedAccount?.accountId });  
      }
});

app.listen(3000);