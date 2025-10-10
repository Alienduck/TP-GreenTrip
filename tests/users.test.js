const fs = require('fs');
const path = require('path');
const { createAccount, login } = require('./../backend/users');

const USERS_PATH = path.join(__dirname, '../backend', 'data', 'users.json');

// 🔄 Réinitialiser les données avant chaque test
beforeEach(() => {
  fs.writeFileSync(USERS_PATH, JSON.stringify([], null, 2));
});

test('Créer un compte avec succès', () => {
  const result = createAccount('Alice', 'alice@example.com', '123456', 'local', '');
  expect(result.success).toBe(true);
  expect(result.user.Email).toBe('alice@example.com');
});

test('Échec si email déjà utilisé', () => {
  createAccount('Bob', 'bob@example.com', 'abc123', 'local', '');
  const result = createAccount('Bob2', 'bob@example.com', 'xyz789', 'local', '');
  expect(result.success).toBe(false);
  expect(result.message).toMatch(/déjà utilisé/i);
});

test('Connexion réussie avec bon mot de passe', () => {
  createAccount('Charlie', 'charlie@example.com', 'pass', 'local', '');
  const result = login('charlie@example.com', 'pass');
  expect(result.success).toBe(true);
  expect(result.user.Name).toBe('Charlie');
});

test('Connexion échoue avec mauvais mot de passe', () => {
  createAccount('Dana', 'dana@example.com', 'secret', 'local', '');
  const result = login('dana@example.com', 'wrong');
  expect(result.success).toBe(false);
});