import express, {Request, Response} from "express"
import {Produto} from "./class/produto"

const app = express()
const PORT = process.env.PORT ?? 3000
app.use(express.json())

const produtos : Produto [] = [];
function novoProduto(req: Request, res: Response): void{
  try {
    let data: any = req.body;

    if(!data.nome || !data.preco || !data.fabricante){
      throw new Error("Produto requer nome, preco e fabricante ");
    }

    const produto = new Produto(
      data.id,
      data.nome,
      data.preco,
      data.fabricante
    );

    // Implementar persistencia

    res.status(200).json(produto);
  }catch (e: unknown) {
    res.status(400).json({
      Message: (e as Error).message,
    });
  }
}