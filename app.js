const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const porta = 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true
}));

app.get('/login', (req, res) => {
    res.send(`<form method="POST" action="/login">
                <input type="text" name="username" placeholder="Usuário" required />
                <input type="password" name="password" placeholder="Senha" required />
                <button type="submit">Login</button>
              </form>`);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'user' && password === '123456') {
        req.session.isAuthenticated = true;
        res.cookie('loggedIn', 'true', { maxAge: 900000, httpOnly: true });
        res.redirect('/dashboard');
    } else {
        res.send('Usuário ou senha incorretos. <a href="/login">Tente novamente</a>');
    }
});

function verificaAutenticacao(req, res, next) {
    if (req.session.isAuthenticated) return next();
    res.redirect('/login');
}

app.get('/dashboard', verificaAutenticacao, (req, res) => {
    res.send(`Bem-vindo, ${req.session.username || 'usuário'}! <a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('loggedIn');
        res.redirect('/login');
    });
});

app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));
