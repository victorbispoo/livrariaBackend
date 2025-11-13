import express from "express";
import { listarAvaliacoes, criarAvaliacao ,  listarAvaliacoesDeLivros} from "../controllers/avaliacoes.controller.js";

const router = express.Router();

// Rota para listar todas as avaliações
router.get("/", listarAvaliacoes);

router.get("/media", listarAvaliacoesDeLivros);

// Rota para criar uma nova avaliação
router.post("/", criarAvaliacao);


export default router;