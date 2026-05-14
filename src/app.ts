import express, {Request, Response} from 'express'
import {Produto} from "./class/produto"

const app = express()
const PORT = process.env.PORT ?? 3000
app.use(express.json())

function filtraProdutoPorNome(req: Request, res: Response): void{
    try{
        let name = req.query.name
        const resultado = produtos.filter(p => p.nome === name)
        res.status(200).json(resultado)
    }catch (e:unknown){
        res.status(400).json({Message: "Necessário informar o nome"})
    }
}

function validarDados(data: any): void{
    if(!data.nome) throw new Error("Produto requer o preenchimento de 'nome'!")
    if(!data.preco) throw new Error("Produto requer o prenchimento de preço!")
    if(data.preco <= 0) throw new Error("Preço deve ser maior que zero")
    if(!data.fabricante?.nome) throw new Error("Nome do fabricante é obrigatório")
    if(!data.fabricante?.endereco?.cidade) throw new Error("Cidade é obrigatória")
    if(!data.fabricante?.endereco?.pais) throw new Error("País é obrigatório")
}

function validarProduto(data: any): void{
    validarDados(data)
    if(produtos.some(p => p.id === data.id)) throw new Error("Já existe um produto com esse ID")
}

const produtos: Produto[] = []

function novoProduto(req: Request, res: Response): void{
    try{
        let data: any = req.body
        validarProduto(data)

        const produto = new Produto(data.id, data.nome, data.preco, data.fabricante)
        produtos.push(produto)

        res.status(200).json(produto)
    }catch (e: unknown){
        res.status(400).json({status: "error", message: (e as Error).message})
    }
}

function listarProdutos(req: Request, res: Response): void{
      res.status(200).json(produtos)
}

function buscarPorID(req: Request, res: Response): void{
    try{
        let id = Number(req.params.id)
        const produto = produtos.find(p => p.id === id)
          
        if(!produto){
            res.status(404).json({Message: "Produto não encontrado"})
            return
        }
        res.status(200).json(produto)
    }catch (e: unknown){
        res.status(500).json({message: (e as Error).message})
    }
}
    
function atualizarProduto(req: Request, res: Response): void{
        try{
            let id = Number(req.params.id)
            const produto = produtos.find(p => p.id === id)
            
            if(!produto){
                res.status(404).json({Message: "Produto não encontrado"})
                return
            }
            
            let data: any = req.body
            validarDados(data)

            produto.nome = data.nome
            produto.preco = data.preco
            produto.fabricante.nome = data.fabricante.nome
            produto.fabricante.endereco.cidade = data.fabricante.endereco.cidade
            produto.fabricante.endereco.pais = data.fabricante.endereco.pais
            res.status(200).json(produto)
            
        }catch(e:unknown){
            res.status(500).json({message: (e as Error).message})
        }
    }
    
function removerProduto(req: Request, res: Response): void{
    try{
        let id = Number(req.params.id)
        const index = produtos.findIndex(p => p.id === id)
        
        if(index === -1){
            res.status(404).json({Message: "Produto não encontrado"})
            return
        }

        produtos.splice(index, 1)
        res.status(200).json({message: "Produto removido com sucesso!"})

    }catch (e: unknown){
        res.status(500).json({message: (e as Error).message})
    }
}

app.get('/api/product/:id', buscarPorID)
app.get('/api/product', filtraProdutoPorNome)
app.post('/api/product', novoProduto)
app.get('/api/products', listarProdutos)
app.put('/api/product/:id', atualizarProduto)
app.delete('/api/product/:id', removerProduto)

app.listen(PORT, () => console.log(`API em execução no URL: http://localhost:${PORT}`))