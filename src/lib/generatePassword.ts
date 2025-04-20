export const generatePassword = (length: number = 8): string => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let password: string = "";

  for (let i = 0; i <= length; i++) {
    const randomNumber = Math.floor(Math.random() * charset.length);
    password += charset[randomNumber];
  }

  return password;
};
