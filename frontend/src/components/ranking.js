import React, { useEffect, useState } from 'react';
import './ranking.css';

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
            .then((data) => setRanking(data))
            .catch((err) => console.error("Erro ao carregar ranking:", err));
    }, []);

    return (
        <div className="ranking-overlay">
            <div className="ranking-modal">
                <button className="fechar-btn" onClick={onClose}>Fechar</button>
                <h2>🏆 Ranking dos Melhores Jogadores</h2>
                <table className="ranking-tabela">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Jogador</th>
                            <th>Jogos</th>
                            <th>Média de Tentativas</th>
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
