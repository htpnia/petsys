const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./config/db')
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const bcrypt = require('bcrypt');  // Adicionado bcrypt
const Usuario = require('./model/user'); 
const Perfil = require('./model/profile');
const Modulo = require('./model/module');
const Transacao = require('./model/transaction');
const Funcao = require('./model/function');
const ModuloTransacao = require('./model/moduleTransaction');
const ModuloFuncao = require('./model/moduleFunction');
const PerfilModulo = require('./model/profileModule');
const cors = require('cors'); 
const { Parser } = require('json2csv');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'chave';

app.use(cors({
    origin: 'http://127.0.0.1:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['Authorization']
}));

// Middleware para parsear o corpo das requisições em JSON
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos.
app.use(express.static(path.join(__dirname, '/')));

// Relacionamentos

Perfil.belongsToMany(Modulo, {
    through: PerfilModulo,
    foreignKey: 'idPerfil',
    otherKey: 'idModulo'
});

Modulo.belongsToMany(Perfil, {
    through: PerfilModulo,
    foreignKey: 'idModulo',
    otherKey: 'idPerfil'
});

Modulo.belongsToMany(Funcao, {
    through: ModuloFuncao,
    foreignKey: 'idModulo',
    otherKey: 'idFuncao'
});

Funcao.belongsToMany(Modulo, {
    through: ModuloFuncao,
    foreignKey: 'idFuncao',
    otherKey: 'idModulo'
});

Modulo.belongsToMany(Transacao, {
    through: ModuloTransacao,
    foreignKey: 'idModulo',
    otherKey: 'idTransacao'
});

Transacao.belongsToMany(Modulo, {
    through: ModuloTransacao,
    foreignKey: 'idTransacao',
    otherKey: 'idModulo'
});

// Rota raiz para direcionar para a página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Login/login.html'));
});

// Rota de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await Usuario.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(400).json({ success: false, message: 'Senha incorreta' });
        }

        if (!user.acessoSistema) {
            return res.status(403).json({ success: false, message: 'Usuário não tem acesso ao sistema' });
        }

        const token = jwt.sign({ id: user.idUsuario }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ success: false, message: 'Erro ao fazer login' });
    }
});

// Enviar email de recuperação de senha
app.post('/api/recover', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'E-mail não cadastrado.' });
        }

        const token = jwt.sign({ id: user.idUsuario }, SECRET_KEY, { expiresIn: '1h' });

        const mailOptions = {
            to_email: user.email,
            subject: 'Recuperação de Senha - QQTech Bê-a-Bá',
            body: `Clique no link para redefinir sua senha: http://localhost:3000/reset-password?token=${token}`
        };

        const scriptPath = path.join(__dirname, 'scripts', 'send_email.py');
        const command = `python ${scriptPath} ${mailOptions.to_email} "${mailOptions.subject}" "${mailOptions.body}"`;

        console.log('Executando comando:', command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Erro ao enviar e-mail:', error);
                console.error('stderr:', stderr);
                return res.status(500).json({ success: false, message: 'Erro ao enviar e-mail' });
            }
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
            res.status(200).json({ success: true, message: 'E-mail de recuperação enviado com sucesso.' });
        });
    } catch (error) {
        console.error('Erro ao processar recuperação de senha:', error);
        res.status(500).json({ success: false, message: 'Erro ao processar recuperação de senha.' });
    }
});

// Redefinir a senha
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        // Atualizar a senha do usuário
        usuario.senha = await bcrypt.hash(newPassword, 10);
        await usuario.save();

        res.json({ success: true, message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ success: false, message: 'Erro ao redefinir senha' });
    }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Dashboard/dashboard.html')); // Sirva o arquivo HTML do dashboard
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

// Rota GET para servir o arquivo "recoverLogin.html"
app.get('/recuperarsenha', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Login/recoverLogin.html'));
})

// Rota GET para servir o arquivo "resetPassword.html"
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Login/resetPassword.html'));
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

// Rota GET para servir o arquivo 'editUser.html' para edição de usuários
app.get('/editUser', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'User/editUser.html'));
});

// Rota GET para servir o arquivo 'editProfile.html' para edição de perfis
app.get('/editProfile', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Profile/editProfile.html'));
});

// Rota GET para servir o arquivo 'editModule.html' para edição de módulos
app.get('/editModule', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Modules/editModule.html'));
});

// Rota GET para servir o arquivo 'editFunction.html' para edição de funções
app.get('/editFunction', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'FunctionTransaction/editFunction.html'));
});

// Rota GET para servir o arquivo 'editTransaction.html' para edição de transações
app.get('/editTransaction', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'FunctionTransaction/editTransaction.html'));
});

// Rota GET para servir o arquivo 'assModuleFunction.html' para associação de módulos a funções
app.get('/associateModuleFunction', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Modules/assModuleFunction.html'));
});

// Rota GET para servir o arquivo 'assModuleFunction.html' para associação de módulos a transações
app.get('/associateModuleTransaction', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Modules/assModuleTransaction.html'));
});

// Rota GET para servir o arquivo 'assProfileModule.html' para associação de perfis a modulos
app.get('/associateProfileModule', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'Profile/assProfileModule.html'));
});

// Rota POST para criar um novo usuário
app.post('/caduser', async (req, res) => {
    try {
        const { nomeUsuario, email, matricula, senha, idPerfil, acessoSistema } = req.body;
        const hashedPassword = await bcrypt.hash(senha, 10); // Hash da senha
        const novoUsuario = await Usuario.create({ nomeUsuario, email, matricula, senha: hashedPassword, idPerfil, acessoSistema });
        res.status(201).json({ success: true, usuario: novoUsuario });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar usuário' });
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

//API rotas para fornecer dados de usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
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
        res.json({ success: true, funcoes });
    } catch (error) {
        console.error('Erro ao buscar funções:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar funções' });
    }
});
// API rotas para fornecer dados de transações
app.get('/api/transacoes', async (req, res) => {
    try {
        const transacoes = await Transacao.findAll();
        res.json({ success: true, transacoes });
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar transações' });
    }
});


//API rota para fornecer usuário específico
app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar usuário' });
    }
});


// API rota para fornecer perfil específico
app.get('/api/perfis/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const perfil = await Perfil.findByPk(id);
        if (!perfil) {
            return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
        }
        res.json({ success: true, perfil });
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao carregar perfil' });
    }
});

// API rota para fornecer módulo específico
app.get('/api/modulos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }
        res.json({ success: true, modulo: { idModulo: modulo.idModulo, nomeModulo: modulo.nomeModulo, descricao: modulo.descricao } });
    } catch (error) {
        console.error('Erro ao carregar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao carregar módulo', details: error.message });
    }
});

// API rota para fornecer transação específica
app.get('/api/transacoes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const transacao = await Transacao.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ success: false, message: 'Transação não encontrada' });
        }
        res.json({ success: true, transacao: { idTransacao: transacao.idTransacao, nomeTransacao: transacao.nomeTransacao, descricao: transacao.descricao } });
    } catch (error) {
        console.error('Erro ao carregar transação:', error);
        res.status(500).json({ success: false, message: 'Erro ao carregar transação', details: error.message });
    }
});

// API rota para fornecer função específica
app.get('/api/funcoes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const funcao = await Funcao.findByPk(id);
        if (!funcao) {
            return res.status(404).json({ success: false, message: 'Função não encontrada' });
        }
        res.json({ success: true, funcao: { idFuncao: funcao.idFuncao, nomeFuncao: funcao.nomeFuncao, descricao: funcao.descricao } });
    } catch (error) {
        console.error('Erro ao carregar função:', error);
        res.status(500).json({ success: false, message: 'Erro ao carregar função', details: error.message });
    }
});


// Atualizar um usuário
app.put('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nomeUsuario, email, matricula, senha, idPerfil, acessoSistema } = req.body;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        usuario.nomeUsuario = nomeUsuario;
        usuario.email = email;
        usuario.matricula = matricula;
        if (senha) {
            usuario.senha = await bcrypt.hash(senha, 10); // Atualizar a senha somente se for fornecida
        }
        usuario.idPerfil = idPerfil;
        usuario.acessoSistema = acessoSistema;
        await usuario.save();
        res.json({ success: true, usuario });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
    }
});

// Atualizar um perfil
app.put('/api/perfis/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nomePerfil, descricao } = req.body;

        // Validação básica
        if (!nomePerfil || !descricao) {
            return res.status(400).json({ success: false, message: 'Nome do perfil e descrição são obrigatórios' });
        }

        // Encontrar o perfil pelo ID
        const perfil = await Perfil.findByPk(id);
        if (!perfil) {
            return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
        }

        // Atualizar os campos do perfil
        perfil.nomePerfil = nomePerfil;
        perfil.descricao = descricao;

        // Salvar as mudanças
        await perfil.save();

        res.json({ success: true, message: 'Perfil atualizado com sucesso', perfil });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar perfil' });
    }
});

// Atualizar um módulo
app.put('/api/modulos/:id', async (req, res) => {
    const { id } = req.params;
    console.log('ID recebido para atualização:', id);
    const { nomeModulo, descricao } = req.body;
    console.log('Dados recebidos para atualização:', { nomeModulo, descricao });

    try {
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }
        modulo.nomeModulo = nomeModulo;
        modulo.descricao = descricao;
        await modulo.save();
        console.log('Módulo atualizado com sucesso:', modulo);
        res.json({ success: true, modulo });
    } catch (error) {
        console.error('Erro ao atualizar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar módulo', details: error.message });
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
        funcao.nomeFuncao = nomeFuncao;
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
        transacao.nomeTransacao = nomeTransacao;
        transacao.descricao = descricao;
        await transacao.save();
        res.json({ success: true, transacao });
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar transação' });
    }
});

// Deletar um usuário
app.delete('/api/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        await usuario.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar usuário' });
    }
});
// Deletar um perfil
app.delete('/api/perfis/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuarios = await Usuario.findAll({ where: { idPerfil: id } });
        if (usuarios.length > 0) {
            return res.status(400).json({ success: false, message: 'Perfil alocado a usuário.' });
        }

        const perfil = await Perfil.findByPk(id);
        if (!perfil) {
            return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
        }

        await PerfilModulo.destroy({ where: { idPerfil: id } });

        await perfil.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar perfil' });
    }
});
// Deletar um módulo
app.delete('/api/modulos/:id', async (req, res) => {
    const { id } = req.params;

    const transaction = await sequelize.transaction();

    try {
        // Excluir associações de Modulotransacao
        await ModuloTransacao.destroy({ where: { idModulo: id }, transaction });
        // Excluir associações de Modulofuncao
        await ModuloFuncao.destroy({ where: { idModulo: id }, transaction });
        // Excluir associações de PerfilModulo
        await PerfilModulo.destroy({ where: { idModulo: id }, transaction })
        // Encontrar e excluir o módulo
        const modulo = await Modulo.findByPk(id);
        if (!modulo) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Módulo não encontrado' });
        }
        
        await modulo.destroy({ transaction });

        await transaction.commit();

        res.status(204).send();
    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao deletar módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar módulo', details: error.message });
    }
});

// Deletar uma função
app.delete('/api/funcoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const funcao = await Funcao.findByPk(id);
        if (!funcao) {
            return res.status(404).json({ success: false, message: 'Função não encontrada' });
        }
        await ModuloFuncao.destroy({ where: { idFuncao: id } });
        await funcao.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar função:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar função' });
    }
});
// Deletar uma transação
app.delete('/api/transacoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const transacao = await Transacao.findByPk(id);
        if (!transacao) {
            return res.status(404).json({ success: false, message: 'Transação não encontrada' });
        }
        await ModuloTransacao.destroy({ where: { idTransacao: id } });
        await transacao.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar transação:', error);
        res.status(500).json({ success: false, message: 'Erro ao deletar transação' });
    }
});

// API rota para associar módulo a transação
app.post('/api/modulosTransacoes/associar', async (req, res) => {
    const { idModulo, idTransacoes } = req.body;
    console.log('Recebido POST para /api/modulosTransacoes/associar');
    console.log('Dados recebidos:', req.body);

    if (!idModulo || !idTransacoes || !Array.isArray(idTransacoes)) {
        return res.status(400).json({ success: false, message: 'Dados insuficientes ou formato incorreto' });
    }

    try {
        console.log('Tentando destruir associações anteriores...');
        await ModuloTransacao.destroy({ where: { idModulo } });
        console.log('Associações anteriores destruídas com sucesso.');

        console.log('Tentando criar novas associações...');
        const associations = idTransacoes.map(idTransacao => ({
            idModulo,
            idTransacao
        }));
        
        const createdAssociations = await ModuloTransacao.bulkCreate(associations);
        console.log('Novas associações criadas com sucesso:', createdAssociations);

        res.status(200).json({ success: true, message: 'Associação realizada com sucesso' });
    } catch (error) {
        console.error('Erro ao associar transações ao módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao associar transações ao módulo', details: error.message });
    }
});

// API rota para associar módulo a função
app.post('/api/modulosFuncoes/associar', async (req, res) => {
    const { idModulo, idFuncoes } = req.body;
    console.log('Recebido POST para /api/modulosFuncoes/associar');
    console.log('Dados recebidos:', req.body);

    if (!idModulo || !idFuncoes || !Array.isArray(idFuncoes)) {
        return res.status(400).json({ success: false, message: 'Dados insuficientes ou formato incorreto' });
    }

    try {
        console.log('Tentando destruir associações anteriores...');
        await ModuloFuncao.destroy({ where: { idModulo } });
        console.log('Associações anteriores destruídas com sucesso.');

        console.log('Tentando criar novas associações...');
        const associations = idFuncoes.map(idFuncao => ({
            idModulo,
            idFuncao
        }));
        
        const createdAssociations = await ModuloFuncao.bulkCreate(associations);
        console.log('Novas associações criadas com sucesso:', createdAssociations);

        res.status(200).json({ success: true, message: 'Associação realizada com sucesso' });
    } catch (error) {
        console.error('Erro ao associar funções ao módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao associar funções ao módulo', details: error.message });
    }
});

// API rota para associar perfil a módulo
app.post('/api/perfilModulo/associar', async (req, res) => {
    const { idPerfil, idModulos } = req.body;
    console.log('Recebido POST para /api/perfilModulo/associar');
    console.log('Dados recebidos:', req.body);

    if (!idPerfil|| !idModulos || !Array.isArray(idModulos)) {
        return res.status(400).json({ success: false, message: 'Dados insuficientes ou formato incorreto' });
    }

    try {
        console.log('Tentando destruir associações anteriores...');
        await PerfilModulo.destroy({ where: { idPerfil } });
        console.log('Associações anteriores destruídas com sucesso.');

        console.log('Tentando criar novas associações...');
        const associations = idModulos.map(idModulo => ({
            idPerfil,
            idModulo
        }));
        
        const createdAssociations = await PerfilModulo.bulkCreate(associations);
        console.log('Novas associações criadas com sucesso:', createdAssociations);

        res.status(200).json({ success: true, message: 'Associação realizada com sucesso' });
    } catch (error) {
        console.error('Erro ao associar módulos ao perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao associar módulos ao perfil', details: error.message });
    }
});

// Rota para obter funções de um módulo específico
app.get('/api/modulos/:id/funcoes', async (req, res) => {
    const { id } = req.params;
    try {
        const funcoes = await Funcao.findAll({
            include: {
                model: Modulo,
                where: { idModulo: id }
            }
        });
        res.json(funcoes);
    } catch (error) {
        console.error('Erro ao buscar funções:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar funções' });
    }
});

// Rota para obter transações de um módulo específico
app.get('/api/modulos/:id/transacoes', async (req, res) => {
    const { id } = req.params;
    try {
        const transacoes = await Transacao.findAll({
            include: {
                model: Modulo,
                where: { idModulo: id }
            }
        });
        res.json(transacoes);
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar transações' });
    }
});

// Rota para obter módulos de um perfil específico
app.get('/api/perfis/:id/modulos', async (req, res) => {
    const { id } = req.params;
    try {
        const perfil = await Perfil.findByPk(id, {
            include: [{
                model: Modulo,
                through: { attributes: [] } // Excluir atributos da tabela associativa
            }]
        });

        if (!perfil) {
            return res.status(404).json({ success: false, message: 'Perfil não encontrado' });
        }

        const modulos = perfil.Modulos; 
        res.json(modulos);
    } catch (error) {
        console.error('Erro ao carregar módulos do perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao carregar módulos do perfil' });
    }
});

// ROTAS DASHBOARD
// Rotas para obter contagens
app.get('/api/count/usuarios', async (req, res) => {
    try {
        const count = await Usuario.count();
        res.json({ count });
    } catch (error) {
        console.error('Erro ao contar usuários:', error);
        res.status(500).json({ success: false, message: 'Erro ao contar usuários' });
    }
});

app.get('/api/count/perfis', async (req, res) => {
    try {
        const count = await Perfil.count();
        res.json({ count });
    } catch (error) {
        console.error('Erro ao contar perfis:', error);
        res.status(500).json({ success: false, message: 'Erro ao contar perfis' });
    }
});

app.get('/api/count/modulos', async (req, res) => {
    try {
        const count = await Modulo.count();
        res.json({ count });
    } catch (error) {
        console.error('Erro ao contar módulos:', error);
        res.status(500).json({ success: false, message: 'Erro ao contar módulos' });
    }
});

app.get('/api/count/funcoes', async (req, res) => {
    try {
        const count = await Funcao.count();
        res.json({ count });
    } catch (error) {
        console.error('Erro ao contar funções:', error);
        res.status(500).json({ success: false, message: 'Erro ao contar funções' });
    }
});

app.get('/api/count/transacoes', async (req, res) => {
    try {
        const count = await Transacao.count();
        res.json({ count });
    } catch (error) {
        console.error('Erro ao contar transações:', error);
        res.status(500).json({ success: false, message: 'Erro ao contar transações' });
    }
});

// Rotas para gerar relatórios
app.get('/api/reports/:type', async (req, res) => {
    const { type } = req.params;
    let data, fields, filename;

    try {
        switch (type) {
            case 'usuarios':
                data = await Usuario.findAll();
                fields = ['idUsuario', 'nomeUsuario', 'email', 'matricula'];
                filename = 'usuarios.csv';
                break;
            case 'perfis':
                data = await Perfil.findAll();
                fields = ['idPerfil', 'nomePerfil', 'descricao'];
                filename = 'perfis.csv';
                break;
            case 'modulos':
                data = await Modulo.findAll();
                fields = ['idModulo', 'nomeModulo', 'descricao'];
                filename = 'modulos.csv';
                break;
            case 'funcoes':
                data = await Funcao.findAll();
                fields = ['idFuncao', 'nomeFuncao', 'descricao'];
                filename = 'funcoes.csv';
                break;
            case 'transacoes':
                data = await Transacao.findAll();
                fields = ['idTransacao', 'nomeTransacao', 'descricao'];
                filename = 'transacoes.csv';
                break;
            default:
                return res.status(400).json({ success: false, message: 'Tipo de relatório desconhecido' });
        }

        const parser = new Parser({ fields });
        const csv = parser.parse(data.map(item => item.toJSON()));

        res.header('Content-Type', 'text/csv');
        res.attachment(filename);
        res.send(csv);
    } catch (error) {
        console.error(`Erro ao gerar relatório de ${type}:`, error);
        res.status(500).json({ success: false, message: `Erro ao gerar relatório de ${type}` });
    }
});

// API para obter a contagem de usuários por perfil
app.get('/api/users-per-profile', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(`
            SELECT perfil.nome_perfil AS nomePerfil, COUNT(usuario.id_usuario) as count
            FROM Usuario usuario
            JOIN Perfil perfil ON usuario.id_perfil = perfil.id_perfil
            GROUP BY perfil.nome_perfil
        `);
        if (!results || results.length === 0) {
            console.error('Nenhum dado encontrado');
            return res.status(404).json({ message: 'Nenhum dado encontrado' });
        }
        res.json(results);
    } catch (error) {
        console.error('Erro ao obter contagem de usuários por perfil:', error);
        res.status(500).json({ message: 'Erro ao obter contagem de usuários por perfil' });
    }
});

app.get('/generate-pie-chart', (req, res) => {
    const scriptPath = path.join(__dirname, 'scripts', 'pizza.py');
    console.log(`Executando script Python: ${scriptPath}`);
    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao executar script Python: ${error}`);
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Erro ao gerar gráfico');
        }
        console.log(`stdout: ${stdout}`);
        res.send('Gráfico gerado com sucesso');
    });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send('Algo deu errado!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
