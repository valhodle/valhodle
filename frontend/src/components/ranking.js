import React, { useEffect, useState } from 'react';
import './ranking.css';
import { FaTimes } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL;

const Ranking = ({ onClose }) => {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/ranking/`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Erro ao buscar ranking");
                }
                return res.json();
            })
            .then((data) => {
                const removerAcentos = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const rankingFiltrado = data.filter(item => {
                    const nome = removerAcentos(item.jogador.toLowerCase());
                    return !nome.startsWith("jogador_anonimo");
                });
                setRanking(rankingFiltrado);
            })
            .catch((err) => console.error("Erro ao carregar ranking:", err));
    }, []);

    return (
        <div className="ranking-overlay">
            <div className="ranking-modal">
                <button className="fechar-btn" onClick={onClose}>
                    <FaTimes />
                </button>
                <h2 className="ranking-titulo">🏆 GOATS</h2>
                <table className="ranking-tabela">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Jogador</th>
                            <th>Jogos</th>
                            <th>Média de tentativas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}º</td>
                                <td>{item.jogador}</td>
                                <td>{item.jogos}</td>
                                <td>{item.media_tentativas.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Ranking;
