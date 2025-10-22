import express from "express";
import { listarUsuario } from "../controllers/usuario.controller.js";
import { obterUsuario } from "../controllers/usuario.controller.js";
import { criarUsuario } from "../controllers/usuario.controller.js";
import { atualizarUsuario } from "../controllers/usuario.controller.js";
import { excluirUsuario } from "../controllers/usuario.controller.js";
const router = express.Router();
router.get("/", listarUsuario);
router.get("/:id", obterUsuario);
router.post("/", criarUsuario);
router.put("/:id", atualizarUsuario);
router.delete("/:id", excluirUsuario);

export default router;