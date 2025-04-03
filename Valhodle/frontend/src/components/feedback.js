import React from 'react';
import './feedback.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { BsFillTriangleFill } from "react-icons/bs";

const NOMES_ATRIBUTOS = {
    "nome": "Nome",
    "ano": "Ano de nascimento",
    "oculos": "Usa óculos"
};

const FeedbackTable = ({ tentativas }) => {
    if (!tentativas || tentativas.length === 0) return null;

    const atributos = Object.keys(tentativas[0].feedback);

    return (
        <div className="feedback-container">
            <div className="feedback-header">
                {atributos.map((atributo, index) => (
                    <div key={index} className="feedback-box header">
                        {NOMES_ATRIBUTOS[atributo] || atributo}
                    </div>
                ))}
            </div>

            {tentativas.map((tentativa, tentativaIndex) => (
                <div key={tentativaIndex} className="feedback-row">
                    {atributos.map((atributo, index) => {
                        const { valor, correto, valorCorreto } = tentativa.feedback[atributo];

                        // Determinar o ícone da seta se for um número
                        let arrowIcon = null;
                        if (typeof valor === "number" && typeof valorCorreto === "number") {
                            if (valor < valorCorreto) {
                                arrowIcon = <FaArrowUp className="arrow-icon up" />;
                            } else if (valor > valorCorreto) {
                                arrowIcon = <FaArrowDown className="arrow-icon down" />;
                            }
                        }

                        return (
                            <div key={index} className={`feedback-box ${correto ? 'correct' : 'incorrect'}`}>
                                {arrowIcon}
                                <span className="feedback-value">{String(valor)}</span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default FeedbackTable;
