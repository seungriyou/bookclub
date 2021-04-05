export const validateEmail = email => { //email 형식이 맞는지 검사하는 함수
  const regex = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[0-9?A-z]+\.[A-z]{2}.?[A-z]{0,3}$/;
  return regex.test(email);
};

export const removeWhitespace = text => { //이메일, id에 공백을 제거하는 함수
  const regex = /\s/g;
  return text.replace(regex, '');
};
