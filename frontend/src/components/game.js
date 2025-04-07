import React, { useState, useEffect, useCallback, useRef } from 'react';
import { iniciarJogo, verificarTentativa } from '../api/api';
import Feedback from './feedback';
import Ranking from './ranking';
import './game.css';
import { FaGamepad, FaMedal, FaPlay, FaStar } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const Game = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [jogoId, setJogoId] = useState(null);
    const [tentativas, setTentativas] = useState(0);
    const [feedbacks, setFeedbacks] = useState([]);
    const [acertou, setAcertou] = useState(false);
    const [jogador, setJogador] = useState('');
    const [tentativa, setTentativa] = useState('');
    const [modo, setModo] = useState('normal');
    const [mostrarRanking, setMostrarRanking] = useState(false);
    const [tempoRestante, setTempoRestante] = useState('');
    const tentativaInputRef = useRef(null);
    const [erroServidor, setErroServidor] = useState(false);
    const timeoutRef = useRef(null);
    const [nomesValidos, setNomesValidos] = useState([]);
    const [sugestoesVisiveis, setSugestoesVisiveis] = useState(false);

    const formatarTempo = (ms) => {
        const horas = Math.floor(ms / 1000 / 60 / 60);
        const minutos = Math.floor((ms / 1000 / 60) % 60);
        const segundos = Math.floor((ms / 1000) % 60);
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };

    const atualizarTempo = useCallback(() => {
        const agora = new Date();
        const meiaNoite = new Date();
        meiaNoite.setHours(24, 0, 0, 0);
        const diff = meiaNoite - agora;
        setTempoRestante(formatarTempo(diff));
    }, []);

    const handleIniciarJogo = useCallback(async () => {
        if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                setErroServidor(true);
                timeoutRef.current = null;
            }, 1000);
        }

        try {
            const nome = jogador.trim() || 'jogador_anonimo';
            const jogo = await iniciarJogo(nome, modo);
            clearTimeout(timeoutRef.current);

            if (!jogo || !jogo.jogo_id) {
                throw new Error("Resposta inesperada do servidor");
            }

            setJogoId(jogo.jogo_id);
            setErroServidor(false);

            if (nome.toLowerCase() !== 'jogador_anonimo' && jogo.mensagem?.includes("já jogou hoje")) {
                setFeedbacks([{ feedback: jogo.feedback, acertou: jogo.acertou }]);
                setAcertou(jogo.acertou);
                setTentativas(jogo.tentativas);
            } else {
                setFeedbacks([]);
                setAcertou(false);
                setTentativas(0);
            }
        } catch (err) {
            clearTimeout(timeoutRef.current);
            console.error("Erro ao iniciar o jogo:", err);
            setErroServidor(true);
        }

    }, [jogador, modo]);

    const handleEnviarTentativa = useCallback(async () => {
        if (!tentativa) return;

        try {
            const resposta = await verificarTentativa(jogoId, tentativa);
            if (resposta.mensagem === "Amigo não encontrado!") return;

            setFeedbacks(prev => [
                { feedback: resposta.feedback, acertou: resposta.acertou },
                ...prev
            ]);

            setAcertou(resposta.acertou);
            setTentativas(resposta.tentativas);
            setTentativa('');
            setSugestoesVisiveis(false);
        } catch (err) {
            console.error("Erro ao verificar tentativa:", err);
            alert("Erro ao enviar tentativa. Tente novamente.");
        }
    }, [tentativa, jogoId]);

    useEffect(() => {
        atualizarTempo();
        const intervalo = setInterval(atualizarTempo, 1000);
        return () => clearInterval(intervalo);
    }, [atualizarTempo]);

    useEffect(() => {
        if (jogoId && tentativaInputRef.current) {
            tentativaInputRef.current.focus();
        }
    }, [jogoId]);

    useEffect(() => {
        const carregarNomes = async () => {
            const nomes = await buscarNomesValidos();
            setNomesValidos(nomes);
        };

        carregarNomes();
    }, []);

    const buscarNomesValidos = async () => {
        try {
            const resposta = await fetch(`${API_URL}/nomes-validos/`);
            const data = await resposta.json();
            return data;
        } catch (error) {
            console.error("Erro ao buscar nomes válidos:", error);
            return [];
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleEnviarTentativa();
    };

    const handleJogadorKeyPress = (e) => {
        if (e.key === "Enter") {
            handleIniciarJogo();
        }
    };

    const renderModoBotao = (modoAtual, icone, tooltip, onClick, selecionado = false) => (
        <>
            <button
                className={`modo-btn ${selecionado ? 'selected' : ''}`}
                onClick={onClick}
                data-tooltip-id={`tooltip-${tooltip}`}
            >
                {icone}
            </button>
            <Tooltip id={`tooltip-${tooltip}`} place="top" content={tooltip} />
        </>
    );

    const sugestoesFiltradas = nomesValidos.filter(nome =>
        nome.toLowerCase().includes(tentativa.toLowerCase()) && tentativa !== ''
    );

    return (
        <div>
            <h1 className="tituloLOL">Valhodle</h1>

            <div className="modo-container">
                {renderModoBotao("normal", <FaGamepad className="modo-icon" />, "Modo normal", () => setModo("normal"), modo === "normal")}
                {renderModoBotao("ranking", <FaMedal className="modo-icon" />, "Ranking", () => setMostrarRanking(true), mostrarRanking)}
                {renderModoBotao("em-breve", <FaStar className="modo-icon" />, "Novos modos em breve", () => { }, false)}
            </div>

            {mostrarRanking && <Ranking onClose={() => setMostrarRanking(false)} />}

            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="input-jogador"
                        placeholder="Digite seu nome..."
                        value={jogador}
                        onChange={(e) => setJogador(e.target.value)}
                        onKeyDown={handleJogadorKeyPress}
                        data-tooltip-id="tooltip-jogador"
                    />
                    <Tooltip id="tooltip-jogador" place="top" content="Digite seu nome ou jogue anonimamente" />
                </div>
            </div>

            <div className="container-botoes-iniciar">
                <button className="btn-iniciar" onClick={handleIniciarJogo}>
                    <FaPlay />
                </button>

                {erroServidor && (
                    <button className="btn-ajuda" data-tooltip-id="tooltip-ajuda">
                        ?
                    </button>
                )}

                <Tooltip
                    id="tooltip-ajuda"
                    place="right"
                    content="O servidor é grátis e às vezes demora para responder. Tente novamente em alguns segundos."
                />
            </div>

            {jogoId && acertou && (
                <div className="contador-container">
                    <p className="contador-texto">
                        Próximo valhodle em: <strong>{tempoRestante}</strong>
                    </p>
                </div>
            )}

            {jogoId && !acertou && (
                <div className="tentativa-container">
                    <div className="input-sugestao-wrapper">
                        <input
                            ref={tentativaInputRef}
                            type="text"
                            placeholder="Digite um nome..."
                            value={tentativa}
                            onChange={(e) => {
                                setTentativa(e.target.value);
                                setSugestoesVisiveis(true);
                            }}
                            onKeyDown={handleKeyPress}
                            className="input-tentativa"
                            autoComplete="off"
                        />
                        {sugestoesVisiveis && sugestoesFiltradas.length > 0 && (
                            <ul className="sugestoes-lista">
                                {sugestoesFiltradas.map((nome, index) => (
                                    <li key={index} onClick={() => {
                                        setTentativa(nome);
                                        setSugestoesVisiveis(false);
                                    }}>
                                        {nome}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button className="btn-enviar" onClick={handleEnviarTentativa}>
                        Enviar
                    </button>
                </div>
            
            )}

            <div>
                {acertou && (
                    <h2 className="parabens">
                        Parabéns! Você acertou em {tentativas} {tentativas === 1 ? 'tentativa' : 'tentativas'}!
                    </h2>
                )}
                <Feedback tentativas={feedbacks} />
            </div>
        </div>
    );
};

export default Game;
