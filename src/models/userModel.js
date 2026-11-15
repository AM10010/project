const prisma = require("../prisma");

function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function createUser(email, name, passwordHash) {
  const user = await prisma.user.create({
    data: { email, name, passwordHash },
  });
  return user.id;
}

module.exports = { findByEmail, createUser };
  