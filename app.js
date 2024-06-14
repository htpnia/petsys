const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Usuario = require('./model/user'); // Corrigido para importar corretamente
const Perfil = require('./model/profile'); // Corrigido para importar corretamente
const Modulo = require('./model/module');
const Transacao = require('./model/transaction');
const Funcao = require('./model/function');



const app = express();
const PORT = 3000;

// Middleware para parsear o corpo das requisições em JSON
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos.
app.use(express.static(path.join(__dirname, 'public')));

// Rota GET para servir o arquivo 'regUser.html'
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Dashboard/dashboard.html'));
});

// Rota GET para servir o arquivo 'regUser.html'
app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'User/users.html'));
});

// Rota GET para servir o arquivo 'regProfile.html' para cadastro de perfil
app.get('/perfis', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'profile/profiles.html'));
});

// Rota GET para servir o arquivo 'regModule.html' para cadastro de módulo
app.get('/modulos', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Modules/modules.html'));
});

// Rota GET para servir o arquivo 'regFunction.html' para cadastro de função
app.get('/funcoestransacoes', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'FunctionTransaction/functiontransaction.html'));
});



// Rota GET para servir o arquivo 'regUser.html'
app.get('/caduser', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'User/regUser.html'));
});

// Rota GET para servir o arquivo 'regProfile.html' para cadastro de perfil
app.get('/cadperfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'profile/regProfile.html'));
});

// Rota GET para servir o arquivo 'regModule.html' para cadastro de módulo
app.get('/cadmodulo', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Modules/regModule.html'));
});

// Rota GET para servir o arquivo 'regFunction.html' para cadastro de função
app.get('/cadfuncao', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'FunctionTransaction/regFunction.html'));
});

// Rota GET para servir o arquivo 'regTransaction.html' para cadastro de transação
app.get('/cadtransacao', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'FunctionTransaction/regTransaction.html'));
});


// Rota POST para criar um novo usuário
app.post('/caduser', async (req, res) => {
    try {
        const { nomeusuario, email, matricula, senha } = req.body;
        const novoUsuario = await Usuario.create({ nomeusuario, email, matricula, senha });
        res.status(201).json(novoUsuario);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Rota POST para criar um novo perfil
app.post('/cadperfil', async (req, res) => {
    try {
        const { nomePerfil, descricao } = req.body;
        const novoPerfil = await Perfil.create({ nomePerfil, descricao });
        res.status(201).json({ success: true, perfil: novoPerfil });
    } catch (error) {
        console.error('Erro ao criar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar perfil' });
    }
});

// Rota POST para criar um novo modulo
app.post('/cadmodulo', async (req, res) => {
    try {
        const { nomeModulo, descricao } = req.body;
        const novoModulo = await Modulo.create({ nomeModulo, descricao });
        res.status(201).json({ success: true, modulo: novoModulo });
    } catch (error) {
        console.error('Erro ao criar modulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar modulo' });
    }
});

// Rota POST para criar uma nova função
app.post('/cadfuncao', async (req, res) => {
    try {
        const { nomeFuncao, descricao } = req.body;
        const novaFuncao = await Funcao.create({ nomeFuncao, descricao });
        res.status(201).json({ success: true, funcao: novaFuncao });
    } catch (error) {
        console.error('Erro ao criar funcao:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar funcao' });
    }
});

// Rota POST para criar uma nova transação
app.post('/cadtransacao', async (req, res) => {
    try {
        const { nomeTransacao, descricao } = req.body;
        const novaTransacao = await Transacao.create({ nomeTransacao, descricao });
        res.status(201).json({ success: true, transacao: novaTransacao });
    } catch (error) {
        console.error('Erro ao criar transacao:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar transacao' });
    }
});

// API rotas para fornecer dados de usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// API rotas para fornecer dados de perfis
app.get('/api/perfis', async (req, res) => {
    try {
        const perfis = await Perfil.findAll();
        res.json(perfis);
    } catch (error) {
        console.error('Erro ao buscar perfis:', error);
        res.status(500).json({ error: 'Erro ao buscar perfis' });
    }
});

// API rotas para fornecer dados de módulos
app.get('/api/modulos', async (req, res) => {
    try {
        const modulos = await Modulo.findAll();
        res.json(modulos);
    } catch (error) {
        console.error('Erro ao buscar módulos:', error);
        res.status(500).json({ error: 'Erro ao buscar módulos' });
    }
});
// API rotas para fornecer dados de funçõess
app.get('/api/funcoes', async (req, res) => {
    try {
        const funcoes = await Funcao.findAll();
        res.json(funcoes);
    } catch (error) {
        console.error('Erro ao buscar funções:', error);
        res.status(500).json({ error: 'Erro ao buscar funções' });
    }
});
// API rotas para fornecer dados de transações
app.get('/api/transacoes', async (req, res) => {
    try {
        const transacoes = await Transacao.findAll();
        res.json(transacoes);
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ error: 'Erro ao buscar transações' });
    }
});

// Atualizar um usuário
app.put('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nomeUsuario, email, matricula, senha } = req.body;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }
        usuario.nome_usuario = nomeUsuario;
        usuario.email_usuario = email;
        usuario.matricula_usuario = matricula;
        await modulo.save();
        res.json({ success: true, modulo });
    } catch (error) {
        console.error('Erro ao atualizar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar módulo' });
    }
});
// Atualizar um perfil
app.put('/api/perfis/:id', async (req, res) => {
    const { id } = req.params;
    const { nomePerfil, descricao } = req.body;
    try {
        const perfil = await Perfil.findByPk(id);
        if (!perfil) {
            return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
        }
        perfil.nome_perfil = nomePerfil;
        perfil.descricao = descricao;
        await perfil.save();
        res.json({ success: true, perfil });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar perfil' });
    }
});
// Atualizar um módulo
app.put('/api/modulos/:id', async (req, res) => {
    const { id } = req.params;
    const { nomeModulo, descricao } = req.body;
    try {
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }
        modulo.nome_modulo = nomeModulo;
        modulo.descricao = descricao;
        await modulo.save();
        res.json({ success: true, modulo });
    } catch (error) {
        console.error('Erro ao atualizar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar módulo' });
    }
});

// Atualizar uma função
app.put('/api/funcoes/:id', async (req, res) => {
    const { id } = req.params;
    const { nomeFuncao, descricao } = req.body;
    try {
        const funcao = await Funcao.findByPk(id);
        if (!funcao) {
            return res.status(404).json({ success: false, message: 'Função não encontrada' });
        }
        funcao.nome_funcao = nomeFuncao;
        funcao.descricao = descricao;
        await funcao.save();
        res.json({ success: true, funcao });
    } catch (error) {
        console.error('Erro ao atualizar função:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar função' });
    }
});
// Atualizar uma transação
app.put('/api/transacoes/:id', async (req, res) => {
    const { id } = req.params;
    const { nomeTransacao, descricao } = req.body;
    try {
        const transacao = await Transacao.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ success: false, message: 'Transação não encontrada' });
        }
        transacao.nome_transacao = nomeTransacao;
        transacao.descricao = descricao;
        await transacao.save();
        res.json({ success: true, transacao });
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar transação' });
    }
});

// Deletar um usuário
// Deletar um perfil
// Deletar um módulo
app.delete('/api/modulos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }
        await modulo.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar módulo' });
    }
});

// Deletar uma função
// Deletar uma transação







// Rota raiz para direcionar para a página de registro
app.get('/', (req, res) => {
    res.redirect('/dashboard');
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack); // Loga o erro no console
    res.status(500).send('Algo deu errado!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
