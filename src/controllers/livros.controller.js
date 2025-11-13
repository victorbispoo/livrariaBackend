import { db } from "../config/db.js";
// ============================
//  Rotas CRUD
// ============================

export async function postarLivros(req, res) {
    try {
        const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo } = req.body;
        if (!titulo || !autor || !genero)
            return res.status(400).json({ erro: "Campos obrigatórios" });

        await db.execute(
            "INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao,isbn , idioma, formato, caminho_capa, sinopse, ativo) VALUES (?, ?, ?,?,?,?,?,?,?,?,?)",
            [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo]
        );

        res.json({ mensagem: "Livro postado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};


export async function listarLivros(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM livros");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};


export async function obterLivros(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM livros WHERE id = ?", [
            req.params.id,
        ]);
        if (rows.length === 0)
            return res.status(404).json({ erro: "Livro não encontrado" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function atualizarLivros(req, res) {
    try {
        const { titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo } = req.body;
        await db.execute(
            "UPDATE livros SET titulo = ?, autor = ?, genero = ? WHERE id = ?",
            [titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse, ativo]
        );
        res.json({ mensagem: "Livro atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};


export async function excluirLivros(req, res) {
    try {
        await db.execute("DELETE FROM livros WHERE id = ?", [req.params.id]);
        res.json({ mensagem: "Livro deletado com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

export async function listarAvaliacoesDeLivros(req, res) {
    try {
        const livroId = req.params.id;
        const sql = `
      SELECT 
        l.id AS id_livro,
        l.titulo,
        COUNT(a.id) AS total_avaliacoes,
        COALESCE(ROUND(AVG(a.nota), 2), 0) AS media_notas
        FROM livros l
        LEFT JOIN avaliacoes a ON l.id = a.livro_id
        GROUP BY l.id, l.titulo
        ORDER BY l.titulo;

    `;

        const [rows] = await db.query(sql, [livroId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao listar avaliações do livro:", error);
        res.status(500).json({ message: "Erro ao buscar avaliações do livro" });
    }
}