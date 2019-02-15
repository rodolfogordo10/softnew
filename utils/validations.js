export const validateEmail = email => {
  const reEmail = /\S+@\S+\.\S+/;

  return reEmail.test(email);
};

export const validatePhone = (number, onlyCellPhone) => {
  if (!number)
    return false;

  const formated = number.replace(/\D/g, '');
  const phoneRE = /^[1-9]{2}[1-8]\d{7}$/;
  const cellphoneRE = /^[1-9]{2}9\d{8}$/;

  if (onlyCellPhone) {
    return cellphoneRE.test(formated);
  }

  return phoneRE.test(formated) || cellphoneRE.test(formated);
};

export const validateCEP = cep => {
  const cepRE = /^\d{5}-\d{3}$/;

  return cepRE.test(cep);
};