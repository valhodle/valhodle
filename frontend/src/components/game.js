import React, { useState } from 'react';
import { iniciarJogo, verificarTentativa } from '../api/api';
import Feedback from './feedback';
import './game.css';
import { FaGamepad, FaArrowRight, FaMedal, FaPlay, FaStar } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import Ranking from './ranking';

const Game = () => {
    const [jogoId, setJogoId] = useState(null);
    const [tentativas, setTentativas] = useState(0);
    const [feedbacks, setFeedbacks] = useState([]);
    const [acertou, setAcertou] = useState(false);
    
    const [jogador, setJogador] = useState('');
    const [modo, setModo] = useState('normal');
    const [tentativa, setTentativa] = useState('');

    const [mostrarRanking, setMostrarRanking] = useState(false);

    const iniciar = async () => {
        try {
            const nomeJogador = jogador.trim() ? jogador : "Anonimo";
            const jogo = await iniciarJogo(nomeJogador, modo);
            setJogoId(jogo.jogo_id);
            setFeedbacks([]);
            setAcertou(false);
        } catch (error) {
            console.error("Erro ao iniciar o jogo:", error);
        }
    };

    const enviarTentativa = async () => {
        if (!tentativa) {
            return;
        }
    
        try {
            const resposta = await verificarTentativa(jogoId, tentativa);

            if (resposta.mensagem === "Amigo não encontrado!") {
                return;
            }

            setFeedbacks(prevFeedbacks => [
                { feedback: resposta.feedback, acertou: resposta.acertou },
                ...prevFeedbacks
            ]);
            setAcertou(resposta.acertou);
            setTentativas(resposta.tentativas);

            setTentativa('');

        } catch (error) {
            console.error("Erro ao verificar tentativa:", error);
            alert("Erro ao enviar tentativa. Tente novamente.");
        }
    };
    
    return (
        <div>
            <h1 className="tituloLOL">Valhodle</h1>

            <div className="modo-container">
                <button 
                    className={`modo-btn ${modo === "normal" ? "selected" : ""}`} 
                    onClick={() => setModo("normal")}
                    data-tooltip-id="tooltip-normal"
                >
                    <FaGamepad className="modo-icon" />
                </button>
                <Tooltip id="tooltip-normal" place="top" content="Modo normal" />

                <button 
                    className={`modo-btn ${mostrarRanking ? "selected" : ""}`} 
                    onClick={() => setMostrarRanking(true)} 
                    data-tooltip-id="tooltip-ranking"
                >
                    <FaMedal className="modo-icon" />
                </button>
                <Tooltip id="tooltip-ranking" place="top" content="Ranking" />

                <button 
                    className="modo-btn modo-breve" 
                    data-tooltip-id="tooltip-em-breve"
                >
                    <FaStar className="modo-icon" />
                </button>
                <Tooltip id="tooltip-em-breve" place="top" content="Novos modos em breve" />
            </div>

            
            {mostrarRanking && <Ranking onClose={() => setMostrarRanking(false)} />}
            
            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="input-jogador"
                        placeholder="Jogador"
                        value={jogador}
                        onChange={(e) => setJogador(e.target.value)}
                        data-tooltip-id="tooltip-jogador"
                    />
                    <Tooltip id="tooltip-jogador" place="top" content="Digite seu nome ou jogue anonimamente" />
                </div>
            </div>

            <button className="btn-iniciar" onClick={iniciar}>
                <FaPlay />
            </button>

            {jogoId && (
                <div className="tentativa-container">
                    <input
                        type="text"
                        placeholder="Digite um nome..."
                        value={tentativa}
                        onChange={(e) => setTentativa(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                enviarTentativa();
                            }
                        }}
                        className="input-tentativa"
                    />
                    <button className="btn-enviar" onClick={enviarTentativa}>
                        Enviar 
                    </button>
                </div>
            )}

            <div>
                <Feedback tentativas={feedbacks} />
                {acertou && <h2 className="fontePadrao">Parabéns! Você acertou em {tentativas} tentativas!</h2>}
            </div>
        </div>
    );
};

export default Game;
