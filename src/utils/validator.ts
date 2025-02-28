/*
Txt Me - A web based messaging platform
Copyright (C) 2025 Ryan Large

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

interface EscapeMap {
  [key: string]: string;
}

type ValidationReturnType = {
  valid: boolean;
  reason: string;
};

type StrParams = {
  string?: string;
  maxLength?: number;
  minLength?: number;
  customRegex?: RegExp;
  customEscapeMap?: EscapeMap;
  inputName?: string;
};

type IntParams = {
  testLen?: boolean;
  minSize?: number;
  maxSize?: number;
  customRegex?: RegExp;
  number?: number;
  inputName?: string;
};

// Validate a string
export const valStr = ({
  string = "",
  maxLength = 10,
  minLength = 3,
  customRegex = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?/~`\-\\s ]*$/,
  customEscapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  },

  inputName = "value",
}: StrParams): ValidationReturnType => {
  string.trim();
  if (typeof string !== "string") {
    return { valid: false, reason: `${inputName} must be of type string` };
  }
  const stringLength: number = string.length;
  if (stringLength < minLength || stringLength > maxLength) {
    return {
      valid: false,
      reason: `Your ${inputName} is ${
        stringLength < minLength ? "too short" : "too long"
      }. Your ${inputName} must be no less than ${minLength} characters and no more than ${maxLength} characters`,
    };
  }
  const nonDangerousPatterns = customRegex.test(string);
  if (!nonDangerousPatterns) {
    return { valid: false, reason: `Invalid ${inputName}` };
  }
  string.replace(
    new RegExp(`[${Object.keys(customEscapeMap).join("")}]`),
    (match) => customEscapeMap[match]
  );
  return { valid: true, reason: "All checks passed" };
};

// Validate an integer
export const valInt = ({
  testLen = false,
  minSize = 0,
  maxSize = 100000,
  customRegex = /^\d+$/,
  number = 0,
  inputName = "value",
}: IntParams): ValidationReturnType => {
  if (typeof number !== "number") {
    return { valid: false, reason: `${inputName} must be of type number` };
  }
  if (!testLen) {
    if (number < minSize || number > maxSize) {
      return {
        valid: false,
        reason: `${inputName} must be greater than ${minSize} and less than ${maxSize}`,
      };
    }
  }
  const stringifiedNumber = number.toString();
  if (testLen) {
    if (
      stringifiedNumber.length > maxSize ||
      stringifiedNumber.length < minSize
    ) {
      return {
        valid: false,
        reason: `The length of the number you defined was too ${
          stringifiedNumber.length > maxSize ? "long" : "short"
        }`,
      };
    }
  }
  const isAValidNumber = customRegex.test(stringifiedNumber);
  if (!isAValidNumber) {
    return {
      valid: false,
      reason: `${inputName} is not valid. Please try again`,
    };
  }
  if (!Number.isInteger(number)) {
    return { valid: false, reason: `${inputName} must be of type number` };
  }
  return { valid: true, reason: "All checks passed" };
};

// Validate a username
export const valUsername = (username: string) => {
  const isValidName = valStr({
    string: username,
    maxLength: 20,
    minLength: 3,
    inputName: "username",
  });
  if (!isValidName.valid) {
    return { valid: false, reason: isValidName.reason };
  }
  return { valid: true, reason: `All checks passed` };
};

// Validate an email
export const valEmail = (email: string): ValidationReturnType => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (typeof email !== "string") {
    return {
      valid: false,
      reason: `Email must be a type of string`,
    };
  }
  const isValidEmail = valStr({
    string: email,
    maxLength: 50,
    minLength: 5,
    customRegex: emailRegex,
    inputName: "email",
  });
  if (!isValidEmail.valid) {
    return { valid: false, reason: isValidEmail.reason };
  }
  return { valid: true, reason: "All checks passed" };
};

// Validate a password
export const valPassword = (password: string): ValidationReturnType => {
  if (typeof password !== "string") {
    return { valid: false, reason: "Password must be of a type string" };
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const isValidPassword = valStr({
    string: password,
    maxLength: 40,
    minLength: 8,
    customRegex: passwordRegex,
    inputName: "password",
  });
  if (!isValidPassword.valid) {
    return { valid: false, reason: isValidPassword.reason };
  }
  return { valid: true, reason: "All checks passed" };
};

// Validate a phone number
export const valPhoneNumber = (phoneNumber: string): ValidationReturnType => {
  if (typeof phoneNumber !== "string") {
    return { valid: false, reason: "Phone number must be a string" };
  }
  const phoneRegex = /^(\(\d{3}\)-\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/;
  const isValidPhone = valStr({
    string: phoneNumber,
    maxLength: 14,
    minLength: 12,
    customRegex: phoneRegex,
    customEscapeMap: {
      "(": "",
      ")": "",
      "-": "",
    },
    inputName: "phone number",
  });

  const formattedNum = phoneNumber.replace(/[()-]/g, "");
  const phoneNumberNums = Number(formattedNum);
  const isValidNumber = valInt({
    testLen: true,
    minSize: 10,
    maxSize: 10,
    number: phoneNumberNums,
  });

  if (!isValidPhone.valid) {
    return { valid: false, reason: isValidPhone.reason };
  }
  if (!isValidNumber.valid) {
    return { valid: false, reason: isValidNumber.reason };
  }
  return { valid: true, reason: "All checks passed" };
};
