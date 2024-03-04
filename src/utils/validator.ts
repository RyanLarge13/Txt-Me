interface EscapeMap {
 [key: string]: string;
}

class Validator {
 constructor() {}

 valStr(
  string: string,
  maxLength: number = 10,
  minLength: number = 3,
  customRegex: RegExp = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?/~`\-\\s]*$/,
  customEscapeMap: EscapeMap = {
   "&": "&amp;",
   "<": "&lt;",
   ">": "&gt;",
   '"': "&quot;",
   "'": "&#039;"
  }
 ): boolean {
  string.trim();
  if (typeof string !== "string") {
   return false;
  }
  const stringLength: number = string.length;
  if (stringLength < minLength || stringLength > maxLength) {
   return false;
  }
  const nonDangerousPatterns = customRegex.test(string);
  if (!nonDangerousPatterns) {
   return false;
  }
  string.replace(
   new RegExp(`[${Object.keys(customEscapeMap).join("")}]`),
   match => customEscapeMap[match]
  );
  return true;
 }

 valInt(
  minSize: number = 0,
  maxSize: number = 100000,
  customRegex: RegExp = /^\d+$/,
  number: number
 ): boolean {
  if (typeof number !== "number") {
   return false;
  }
  if (number < minSize || number > maxSize) {
   return false;
  }
  const stringifiedNumber = number.toString();
  const isAValidNumber = customRegex.test(stringifiedNumber);
  if (!isAValidNumber) {
   return false;
  }
  if (!Number.isInteger(number)) {
   return false;
  }
  return true;
 }

 valUsername(username: string) {
  const isValidName = this.valStr(username, 20, 3);
  if (!isValidName) {
   return false;
  }
  return true;
 }

 valEmail() {}

 valPassword() {}
 valPhoneNumber() {}
}

export default Validator;
