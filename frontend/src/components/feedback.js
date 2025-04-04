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

            {tentativas.map((tentativa, tentativaIndex) => (
                <div key={tentativaIndex} className="feedback-row">
                    {atributos.map((atributo, index) => {
                        const { valor, correto, valorCorreto } = tentativa.feedback[atributo];

                        // Define a classe com base na resposta
                        let classeCor = "incorrect";
                        if (correto === "certo") {
                            classeCor = "correct";
                        } else if (correto === "meio") {
                            classeCor = "partial";
                        }

                        // Ícone de seta para atributos numéricos
                        let arrowIcon = null;
                        if (typeof valor === "number" && typeof valorCorreto === "number") {
                            if (valor < valorCorreto) {
                                arrowIcon = <FaArrowUp className="arrow-icon" />;
                            } else if (valor > valorCorreto) {
                                arrowIcon = <FaArrowDown className="arrow-icon" />;
                            }
                        }

                        return (
                            <div key={index} className={`feedback-box ${classeCor}`}>
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
