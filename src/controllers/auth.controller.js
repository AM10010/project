const bcrypt = require("bcrypt");
const User = require("../models/userModel");

function showSignup(req, res) {
  res.render("signup", { error: null });
}

async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).render("signup", { error: "Name, email, and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).render("signup", { error: "Password must be at least 8 characters long" });
  }

  const existing = await User.findByEmail(email);
  if (existing) {
    return res.status(400).render("signup", { error: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = await User.createUser(email, name, passwordHash);

  req.session.user = { id, name };
  req.session.save(() => res.redirect("/"));
}

function showLogin(req, res) {
  res.render("login", { error: null });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(400).render("login", { error: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(400).render("login", { error: "Invalid email or password" });
  }

  req.session.user = { id: user.id, name: user.name };
  req.session.save(() => res.redirect("/"));
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
}

module.exports = { showSignup, signup, showLogin, login, logout };