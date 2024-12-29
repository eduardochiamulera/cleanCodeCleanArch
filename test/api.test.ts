import axios from "axios";

axios.defaults.validateStatus = function(){
    return true;
}

test("Deve criar a conta de um passageiro", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    const response = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = response.data;
    expect(outputSignup.accountId).toBeDefined();

    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`); 
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    //expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Não Deve criar a conta de um passageiro com nome inválido", async function(){
    const input = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    const response = await axios.post("http://localhost:3000/signup", input);
    expect(response.status).toBe(422);    
    expect(response.data.message).toBe("Invalid name");
});

test("Não Deve criar a conta de um passageiro com email inválido", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    const response = await axios.post("http://localhost:3000/signup", input);
    expect(response.status).toBe(422);
    expect(response.data.message).toBe("Invalid email");
});

test("Não Deve criar a conta de um passageiro com cpf inválido", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "11111111111",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    const response = await axios.post("http://localhost:3000/signup", input);
    expect(response.status).toBe(422);
    expect(response.data.message).toBe("Invalid cpf");
});

test("Não Deve criar a conta de um passageiro duplicado", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: true,
        isDriver: false,
    };
    await axios.post("http://localhost:3000/signup", input);
    const response = await axios.post("http://localhost:3000/signup", input);
    expect(response.status).toBe(422);
    expect(response.data.message).toBe('Duplicated account');
});

test("Não Deve criar a conta de um motorista com placa invalida", async function(){
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "71428793860",
        password: "123456",
        isPassenger: false,
        isDriver: true,
        carPlate: "AAA999"
    };
    await axios.post("http://localhost:3000/signup", input);
    const response = await axios.post("http://localhost:3000/signup", input);
    expect(response.status).toBe(422);
    expect(response.data.message).toBe("Invalid car plate");
});