const sites = [
  { nome: "Conexo", url: "https://conexo.ws" },
  { nome: "Loldle", url: "https://loldle.net" },
  { nome: "Wordle BR", url: "https://wordle-brasil.vercel.app" },
  { nome: "Contexto", url: "https://contexto.me" },
  { nome: "Termo", url: "https://term.ooo" },
  { nome: "Framed", url: "https://framed.wtf" },
  { nome: "Moviedle", url: "https://moviedle.xyz" }
];

const btn = document.getElementById("btnJogo");
const resultado = document.getElementById("resultado");

function getHoje() {
  return new Date().toISOString().split("T")[0];
}

function irParaJogo() {
  const hoje = getHoje();

  let dados = JSON.parse(localStorage.getItem("jogos")) || {
    data: hoje,
    usados: []
  };

  if (dados.data !== hoje) {
    dados = { data: hoje, usados: [] };
  }

  if (dados.usados.length === sites.length) {
    mostrarPopup();
    return;
  }

  const disponiveis = sites
    .map((site, index) => ({ ...site, index }))
    .filter(item => !dados.usados.includes(item.index));

  const escolhido =
    disponiveis[Math.floor(Math.random() * disponiveis.length)];

  dados.usados.push(escolhido.index);
  localStorage.setItem("jogos", JSON.stringify(dados));

  btn.disabled = true;

  // 🎰 animação
  const nomes = sites.map(s => s.nome);
  let i = 0;

  const intervalo = setInterval(() => {
    resultado.textContent = nomes[i % nomes.length] + " 🎲";
    i++;
  }, 100);

  setTimeout(() => {
    clearInterval(intervalo);

    resultado.innerHTML = `
      <p>🎮 Hoje é: <strong>${escolhido.nome}</strong></p>
      <button id="abrirJogo" class="secondary-btn">Abrir jogo</button>
    `;

    document.getElementById("abrirJogo").addEventListener("click", () => {
      window.open(escolhido.url, "_blank", "noopener,noreferrer");
      btn.disabled = false;
    });

  }, 1000);
}

function mostrarPopup() {
  const popup = document.createElement("div");
  popup.id = "popup";

  popup.innerHTML = `
    <div class="popup-content">
      <h1>🚫 ACABOU</h1>
      <p>Você zerou os jogos diários.</p>
      <p>Toque na grama 🌱</p>
    </div>
  `;

  document.body.appendChild(popup);
}

btn.addEventListener("click", irParaJogo);

window.resetJogos = function () {
  localStorage.removeItem("jogos");
  console.log("Resetado! 🔄");
};