const session = require("express-session");
const prisma = require("./prisma");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const store = new PrismaSessionStore(prisma, {
  checkPeriod: 10 * 60 * 1000,
  dbRecordIdIsSessionId: true,
});

module.exports = session({
  secret: process.env.SESSION_SECRET,
  store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});