const express = require('express');
const router = express.Router();
const ModuloTransacao = require('../model/moduleTransaction'); // Certifique-se de que o caminho está correto

router.post('/modulosTransacoes/associar', async (req, res) => {
    const { idModulo, idTransacoes } = req.body;

    if (!idModulo || !idTransacoes || !Array.isArray(idTransacoes)) {
        return res.status(400).json({ success: false, message: 'Dados insuficientes ou formato incorreto' });
    }

    try {
        // Remova associações anteriores
        await ModuloTransacao.destroy({ where: { idModulo } });

        // Adicione novas associações
        const associations = idTransacoes.map(idTransacao => ({
            idModulo,
            idTransacao
        }));

        await ModuloTransacao.bulkCreate(associations);

        res.status(200).json({ success: true, message: 'Associação realizada com sucesso' });
    } catch (error) {
        console.error('Erro ao associar transações ao módulo:', error);
        res.status(500).json({ success: false, message: 'Erro ao associar transações ao módulo' });
    }
});

module.exports = router;
