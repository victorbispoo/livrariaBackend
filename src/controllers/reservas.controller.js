import { db } from "../config/db.js";

// LISTAR RESERVAS
export const listarReservas = async (req, res) => {
  try {
    const sql = `
        SELECT
        l.id AS id_livro,
        l.titulo AS titulo_livro,
        u.id AS id_usuario,
        u.nome AS nome_usuario,
        r.data_retirada,
        r.data_devolucao,
        r.confirmado_email
        FROM reservas r
        JOIN livros l ON r.livro_id = l.id
        JOIN usuarios u ON r.usuario_id = u.id
    `;;

       const [rows] = await db.query(sql);


    function formatarData(date) {
      const d = new Date(date);
      const dia = String(d.getDate()).padStart(2, "0");
      const mes = String(d.getMonth() + 1).padStart(2, "0");
      const ano = d.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }


    const reservasFormatadas = rows.map(r => ({
      ...r,
      data_retirada: formatarData(r.data_retirada),
      data_devolucao: formatarData(r.data_devolucao),
    }));

    return res.status(200).json(reservasFormatadas);

  } catch (error) {
    console.error("Erro ao listar reservas:", error);
    return res.status(500).json({ message: "Erro ao buscar as reservas" });
  }
};

// CRIAR RESERVA
export const criarReserva = async (req, res) => {
  try {
    const { usuario_id, livro_id, data_devolucao } = req.body;

    if (!usuario_id || !livro_id || !data_devolucao) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos: usuario_id, livro_id e data de devolução" });
    }

    const data_retirada = new Date();
    const dataDev = new Date(data_devolucao);

    if (dataDev <= data_retirada) {
      return res
        .status(400)
        .json({ message: "A data de devolução deve ser após à data de retirada." });
    }

    await db.query(
      `INSERT INTO reservas (usuario_id, livro_id, data_retirada, data_devolucao)
       VALUES (?, ?, ?, ?)`,
      [usuario_id, livro_id, data_retirada, data_devolucao]
    );

    await db.query(
      `UPDATE livros SET ativo = false WHERE id = ?`,
      [livro_id]
    );

    return res.status(201).json({ message: "Reserva realizada com sucesso!" });

  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return res.status(500).json({ message: "Erro ao criar reserva" });
  }
};

// EXCLUIR RESERVA

export const excluirReserva = async (req, res) => {
  try {
    const reservaId = req.params.id;
    const sql = "DELETE FROM reservas WHERE id = ?";
    const [result] = await db.query(sql, [reservaId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reserva não encontrada" });
    }
    res.status(200).json({ message: "Reserva excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir reserva:", error);
    res.status(500).json({ message: "Erro ao excluir reserva" });
  }
};