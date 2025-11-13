import express from "express";
import {
    listarLivros,
    obterLivros,
    postarLivros,
    atualizarLivros,
    excluirLivros,
    listarAvaliacoesDeLivros
} from "../controllers/livros.controller.js";

const router = express.Router();


router.get("/", listarLivros);
router.get("/:id", obterLivros);
router.get("/:avaliacoes", listarAvaliacoesDeLivros);
router.post("/", postarLivros);
router.put("/:id", atualizarLivros);
router.delete("/:id", excluirLivros);

export default router;