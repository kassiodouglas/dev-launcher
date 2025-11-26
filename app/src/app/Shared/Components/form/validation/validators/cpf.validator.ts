import { ValidatorFn } from "@angular/forms";

export function cpfValidator(): ValidatorFn {
  return control => {
    const cpf = (control.value || '').replace(/\D/g, '');



    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return { cpf: true };

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += +cpf[i] * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== +cpf[9]) return { cpf: true };

    soma = 0;
    for (let i = 0; i < 10; i++) soma += +cpf[i] * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    return resto === +cpf[10] ? null : { cpf: true };
  };
}
