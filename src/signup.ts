import express, { Request, Response } from "express";
import GetByEmail from "./getByEmail";
import SaveAccount from "./saveAccount";
import { AccountRepositoryDatabase } from "./accountRepository";
import GetByCode from "./getByCode";

const app = express();
app.use(express.json());

const accountRepository = new AccountRepositoryDatabase();
const getbyEmail = new GetByEmail(accountRepository);
const saveAccount = new SaveAccount(accountRepository);
const getbyCode = new GetByCode(accountRepository);

app.post("/signup", async function (req: Request, res: Response) {
    try {
        const input = req.body;
        const accountExists = await getbyEmail.executeAsync(input.email);
        if (accountExists) {
            res.status(422).json({ message: "Email already in use" });  
            return;
        } 
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
    } catch (error: any) {
        res.status(422).json({ message: error.message });
    }
});

app.get("/accounts/:accountId", async function (req: Request, res: Response) {
	const accountId = req.params.accountId;
    const output = await getbyCode.executeAsync(accountId);
    res.json(output);  
});

app.listen(3000);