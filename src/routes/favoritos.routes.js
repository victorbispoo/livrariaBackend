import express from "express";
import { favoritar, listarFavoritos, deletarFavoritos } from "../controllers/favoritos.controller.js";

const router = express.Router();

router.get("/", listarFavoritos);
router.post("/", favoritar);
router.delete("/:id", deletarFavoritos);

export default router;