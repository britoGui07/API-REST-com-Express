"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const produto_1 = require("./class/produto");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
app.use(express_1.default.json());
function filtraProdutoPorNome(req, res) {
    try {
        let name = req.query.name;
        const resultado = produtos.filter(p => p.nome === name);
        res.status(200).json(resultado);
    }
    catch (e) {
        res.status(400).json({ Message: "Necessário informar o nome" });
    }
}
function validarDados(data) {
    if (!data.nome)
        throw new Error("Produto requer o preenchimento de 'nome'!");
    if (!data.preco)
        throw new Error("Produto requer o prenchimento de preço!");
    if (data.preco <= 0)
        throw new Error("Preço deve ser maior que zero");
    if (!data.fabricante?.nome)
        throw new Error("Nome do fabricante é obrigatório");
    if (!data.fabricante?.endereco?.cidade)
        throw new Error("Cidade é obrigatória");
    if (!data.fabricante?.endereco?.pais)
        throw new Error("País é obrigatório");
}
function validarProduto(data) {
    validarDados(data);
    if (produtos.some(p => p.id === data.id))
        throw new Error("Já existe um produto com esse ID");
}
const produtos = [];
function novoProduto(req, res) {
    try {
        let data = req.body;
        validarProduto(data);
        const produto = new produto_1.Produto(data.id, data.nome, data.preco, data.fabricante);
        produtos.push(produto);
        res.status(200).json(produto);
    }
    catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
}
function listarProdutos(req, res) {
    res.status(200).json(produtos);
}
function buscarPorID(req, res) {
    try {
        let id = Number(req.params.id);
        const produto = produtos.find(p => p.id === id);
        if (!produto) {
            res.status(404).json({ Message: "Produto não encontrado" });
            return;
        }
        res.status(200).json(produto);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
}
function atualizarProduto(req, res) {
    try {
        let id = Number(req.params.id);
        const produto = produtos.find(p => p.id === id);
        if (!produto) {
            res.status(404).json({ Message: "Produto não encontrado" });
            return;
        }
        let data = req.body;
        validarDados(data);
        produto.nome = data.nome;
        produto.preco = data.preco;
        produto.fabricante.nome = data.fabricante.nome;
        produto.fabricante.endereco.cidade = data.fabricante.endereco.cidade;
        produto.fabricante.endereco.pais = data.fabricante.endereco.pais;
        res.status(200).json(produto);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
}
function removerProduto(req, res) {
    try {
        let id = Number(req.params.id);
        const index = produtos.findIndex(p => p.id === id);
        if (index === -1) {
            res.status(404).json({ Message: "Produto não encontrado" });
            return;
        }
        produtos.splice(index, 1);
        res.status(200).json({ message: "Produto removido com sucesso!" });
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
}
app.get('/api/product/:id', buscarPorID);
app.get('/api/product', filtraProdutoPorNome);
app.post('/api/product', novoProduto);
app.get('/api/products', listarProdutos);
app.put('/api/product/:id', atualizarProduto);
app.delete('/api/product/:id', removerProduto);
app.listen(PORT, () => console.log(`API em execução no URL: http://localhost:${PORT}`));
//# sourceMappingURL=app.js.map