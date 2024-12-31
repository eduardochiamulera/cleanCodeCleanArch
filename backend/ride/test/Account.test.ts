import Account from "../src/domain/entity/Account";

test("Deve criar uma conta", function(){
    const account = Account.create("John Doe","johndoe@gmail.com","97456321558","","123456",true,false);
    expect(account).toBeDefined();
})

test("Não deve criar uma conta com nome invalido", function(){
    expect(() => Account.create("John","johndoe@gmail.com","97456321558","","123456",true,false)).toThrow(new Error("Invalid name"));
})

test("Não deve criar uma conta com email invalido", function(){
    expect(() => Account.create("John Doe","johndoe","97456321558","","123456",true,false)).toThrow(new Error("Invalid email"));
})

test("Não deve criar uma conta com cpf invalido", function(){
    expect(() => Account.create("John Doe","johndoe@gmail.com","12345678901","","123456",true,false)).toThrow(new Error("Invalid cpf"));
})

test("Não deve criar uma conta com placa do carro invalido", function(){
    expect(() => Account.create("John Doe","johndoe@gmail.com","97456321558","","123456",false,true)).toThrow(new Error("Invalid car plate"));
})
