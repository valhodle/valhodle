import React from 'react';
import './feedback.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const NOMES_ATRIBUTOS = {
    "nome": "Nome",
    "ano": "Ano de nascimento",
    "oculos": "Usa óculos",
    "tatuagem": "Tem tatuagem",
    "altura": "Altura",
    "area_estudo": "Área de estudo",
    "time": "Time",
    "animal_de_estimacao": "Animal de estimação"
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

            {tentativas.map((tentativa, tentativaIndex) => {
                const isPrimeiraLinha = tentativaIndex === 0;
                const rowKey = `tentativa-${tentativaIndex}-${JSON.stringify(tentativa.feedback)}`;

                return (
                    <div
                        key={rowKey}
                        className={`feedback-row ${isPrimeiraLinha ? 'primeira-tentativa' : ''}`}
                    >
                        {atributos.map((atributo, index) => {
                            const { valor, correto, valorCorreto } = tentativa.feedback[atributo];

                            let classeCor = "incorrect";
                            if (correto === "certo") {
                                classeCor = "correct";
                            } else if (correto === "meio") {
                                classeCor = "partial";
                            }

                            let arrowIcon = null;
                            if (typeof valor === "number" && typeof valorCorreto === "number") {
                                if (valor < valorCorreto) {
                                    arrowIcon = <FaArrowUp className="arrow-icon" />;
                                } else if (valor > valorCorreto) {
                                    arrowIcon = <FaArrowDown className="arrow-icon" />;
                                }
                            }

                            const style = isPrimeiraLinha
                                ? { animationDelay: `${index * 0.1}s` }
                                : {};

                            const boxClass = `feedback-box ${classeCor} ${isPrimeiraLinha ? 'aparecendo' : ''}`;

                            return (
                                <div key={index} className={boxClass} style={style}>
                                    {arrowIcon}
                                    <span className="feedback-value">{String(valor)}</span>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default FeedbackTable;
