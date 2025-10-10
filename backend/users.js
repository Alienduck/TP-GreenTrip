const fs = require('fs');
const path = require('path');

const USERS_PATH = path.join(__dirname, 'data', 'users.json');

function getUserCount(users) {
    const maxId = users.reduce((max, u) => Math.max(max, u.UserId || 0), 0);
    return maxId + 1;
}

function userExist(users, email) {
    return users.some(item => item.Email === email);
}

// TODO: tests
function getUser(users, email) {
    return users.find(item => item.Email === email);
}

function getUserAccount(users, email, password) {
    return users.find(item => item.Email === email && item.Password === password);
}

function createUser(users, name, email, password, AuthProvider, AuthProviderId) {
    const newUser = {
        UserId: getUserCount(users),
        Name: name,
        Email: email,
        Password: password, // TODO: hash
        AuthProvider: AuthProvider,
        AuthProviderId: AuthProviderId,
        Bookings: [],
    };
    return newUser;
}

// Create account
function createAccount(name, email, password, AuthProvider, AuthProviderId) {
    const users = JSON.parse(fs.readFileSync(USERS_PATH));
    if (userExist(users, email)) {
        return { success: false, message: 'Email déjà utilisé.' };
    }
    const newUser = createUser(users, name, email, password, AuthProvider, AuthProviderId)
    users.push(newUser);
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
    return { success: true, user: newUser };
}

// Login
function login(email, password) {
    const users = JSON.parse(fs.readFileSync(USERS_PATH));
    const user = getUserAccount(users, email, password);
    if (!user) {
        return { success: false, message: 'Identifiants invalides.' };
    }
    return { success: true, user };
}

/*
* @params: email: string
* @return: { success: bool, message: string? }
*/
function deleteAccount(email) {
    const users = JSON.parse(fs.readFileSync(USERS_PATH));
    const user = getUser(users, email);
    if (!user) {
        return { success: false, message: 'User not found'};
    }
    const update = users.filter(item => item !== user);
    fs.writeFileSync(USERS_PATH, JSON.stringify(update, null, 2));
    return { success: true }
}

module.exports = { createAccount, login, deleteAccount };