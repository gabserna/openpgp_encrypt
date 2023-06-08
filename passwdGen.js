// chat-gpt provided this for us
function generateStrongPassword(length = 16) {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*_-+=";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  let password = "";

  // Generate at least one character from each character set
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(numberChars);
  password += getRandomChar(specialChars);

  // Generate remaining characters randomly from all character sets
  for (let i = 4; i < length; i++) {
    password += getRandomChar(allChars);
  }

  // Shuffle the password to mix the characters randomly
  password = shuffleString(password);

  return password;
}

function getRandomChar(characters) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

function shuffleString(string) {
  const array = string.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

// Example usage
const password = generateStrongPassword(32);
console.log(password);