import bcrypt from "bcryptjs";

const generatePasswordHash = async () => {
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Password:", password);
  console.log("Hashed Password:", hashedPassword);

  // Test verify
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log("Password verification test:", isValid);
};

generatePasswordHash();
