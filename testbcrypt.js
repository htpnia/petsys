const bcrypt = require('bcrypt');

const senhaFornecida = 'admin';
const senhaHashadaNoBanco = '$2b$10$uSddFIyTPBgJvHJlP/NrdeQUHN.0u9VVbchtqRaIRiiw9D2wKv8wO'; // Substitua pelo hash gerado no passo anterior

bcrypt.compare(senhaFornecida, senhaHashadaNoBanco, function(err, result) {
    if (err) throw err;
    console.log('Senha corresponde:', result); // Deve ser true
});