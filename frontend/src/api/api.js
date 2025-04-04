
const API_URL = "https://valhodlebackend.onrender.com/api/jogo/";
//const API_URL = "http://127.0.0.1:8000/api/jogo"; 

export const iniciarJogo = async (jogador, modo = "normal") => {
    try {
        const response = await fetch(`${API_URL}/iniciar/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ jogador, modo }), 
        });
        if (!response.ok) {
            throw new Error("Erro ao iniciar o jogo");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao iniciar o jogo:", error);
        return null;
    }
};


export const verificarTentativa = async (jogoId, tentativa) => {
    try {
        const response = await fetch(`${API_URL}/tentar/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ jogo_id: jogoId, tentativa }),
        });

        if (!response.ok) {
            throw new Error("Erro ao verificar tentativa");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Erro ao verificar tentativa:", error);
        return null;
    }
};
