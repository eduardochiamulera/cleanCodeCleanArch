const CPF_VALID_LENGTH = 11;
const FIRST_DIGIT_FACTOR = 10;
const SECOND_DIGIT_FACTOR = 11;

export default class Cpf{
    private value: string;

    constructor(value: string){
        if(!this.validate(value)) throw new Error("Invalid cpf");
        this.value = value;
    }

    getValue(){
        return this.value;
    }

    validate (cpf: string) {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== CPF_VALID_LENGTH) return false;
        if (this.allDigitsTheSame(cpf)) return false;
        const digit1 = this.calculateDigit(cpf, FIRST_DIGIT_FACTOR);
        const digit2 = this.calculateDigit(cpf, SECOND_DIGIT_FACTOR);
        return `${digit1}${digit2}` === this.extractDigit(cpf);
    }

    allDigitsTheSame (cpf: string) {
        const [firstDigit] = cpf;
        return [...cpf].every(digit => digit === firstDigit);
    }

    calculateDigit (cpf: string, factor: number) {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1) total += parseInt(digit) * factor--;
        }
        const remainder = total % 11;
        return (remainder < 2) ? 0 : 11 - remainder;
    }

    extractDigit (cpf: string) {
        return cpf.slice(9);
    }
}