import { PasswordFactory, TextPlainPassword } from "../src/domain/vo/Password";

test("Deve criar uma senha textplain válida", function() {
    const password = PasswordFactory.create("textplain", "123456");
    expect(password.getValue()).toBe("123456");
});

test("Deve criar uma senha md5 válida", function() {
    const password = PasswordFactory.create("md5", "123456");
    expect(password.getValue()).toBe("e10adc3949ba59abbe56e057f20f883e");
});

test("Deve criar uma senha sha1 válida", function() {
    const password = PasswordFactory.create("sha1", "123456");
    expect(password.getValue()).toBe("7c4a8d09ca3762af61e59520943dc26494f8941b");
});

test("Não deve criar uma senha inválida", function() {
    expect(() => PasswordFactory.create("textplain", "1234")).toThrow(new Error("Invalid password"));
});

test("Deve retornar erro ao passar um tipo de senha invalido", function() {
    expect(() => PasswordFactory.create("test", "1234")).toThrow(new Error("Invalid type"));
});