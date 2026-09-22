import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import cerebro from "../../images/juegos/cerebro.svg";
import juego from "../../images/juegos/juego.svg";
import libros from "../../images/juegos/libros.svg";
import "../../css/pages/JuegosPage.css";

const niveles = [
  { label: "Fácil", detail: "Inicio", className: "easy" },
  { label: "Medio", detail: "Desafío", className: "medium" },
  { label: "Difícil", detail: "Experto", className: "hard" }
];
const edadesValidas = ["5-7", "8-10", "11-15", "15+"];
const ETIQUETAS_EDAD = { "5-7": "Exploradores", "8-10": "Constructores", "11-15": "Retadores", "15+": "Avanzados" };
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const queryParams = new URLSearchParams(window.location.search);
const getInitialLevel = () => {
  const value = Number(queryParams.get("dificultad"));
  return Number.isInteger(value) && value >= 0 && value <= 2 ? value : 0;
};
const getInitialAge = () => edadesValidas.includes(queryParams.get("edad")) ? queryParams.get("edad") : "8-10";

function Shell({ title, subtitle, image, level, setLevel, age, children, onReset }) {
  return <main className="game-page"><div className="game-shell"><Link className="back-link" to="/juegos">← Volver a juegos</Link><header className="game-title"><img src={image} alt="" /><div><span className="eyebrow">Versión {ETIQUETAS_EDAD[age]} · {age} años</span><h1>{title}</h1><p>{subtitle}</p></div></header><nav className="level-tabs" aria-label="Seleccionar nivel">{niveles.map((item, index) => <button className={level === index ? `active ${item.className}` : ""} onClick={() => setLevel(index)} key={item.label}>{item.label}<small>{item.detail}</small></button>)}</nav>{children}<button className="reset-button" onClick={onReset}>Reiniciar nivel</button></div></main>;
}

const PAREJAS_ICONS = ["★", "●", "▲", "◆", "♥", "☀", "☘", "✿", "⬟", "☂"];
const PAREJAS_ICONS_BY_AGE = {
  "5-7": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐸", "🐵"],
  "8-10": ["🚲", "⚽", "🎨", "📚", "🚀", "🌈", "🎵", "🧩", "🔭", "🏆"],
  "11-15": ["♞", "♜", "⚡", "☯", "♻", "✈", "⌘", "☄", "⚙", "♟"],
  "15+": ["H", "K", "M", "R", "T", "V", "X", "Z", "@", "#"]
};
const PAREJAS_BY_AGE = {
  "5-7": [{ pairs: 3, columns: 3, delay: 1000 }, { pairs: 4, columns: 4, delay: 850 }, { pairs: 5, columns: 5, delay: 700 }],
  "8-10": [{ pairs: 4, columns: 4, delay: 850 }, { pairs: 6, columns: 4, delay: 700 }, { pairs: 7, columns: 5, delay: 600 }],
  "11-15": [{ pairs: 5, columns: 5, delay: 750 }, { pairs: 7, columns: 5, delay: 600 }, { pairs: 9, columns: 6, delay: 500 }],
  "15+": [{ pairs: 5, columns: 5, delay: 650 }, { pairs: 8, columns: 6, delay: 500 }, { pairs: 10, columns: 5, delay: 400 }]
};
const createMemoryDeck = (level, age) => {
  const config = (PAREJAS_BY_AGE[age] || PAREJAS_BY_AGE["8-10"])[level];
  const icons = PAREJAS_ICONS_BY_AGE[age] || PAREJAS_ICONS;
  return shuffle(icons.slice(0, config.pairs).flatMap((icon) => [icon, icon]).map((icon, id) => ({ id, icon, open: false, matched: false })));
};

export function JuegoParejasPage() {
  const [level, setLevel] = useState(getInitialLevel);
  const [age] = useState(getInitialAge);
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [locked, setLocked] = useState(false);
  const config = (PAREJAS_BY_AGE[age] || PAREJAS_BY_AGE["8-10"])[level];
  const reset = () => { setCards(createMemoryDeck(level, age)); setSelected([]); setMoves(0); setMatches(0); setLocked(false); };
  useEffect(reset, [level, age]);
  const choose = (index) => {
    if (locked || cards[index]?.open || cards[index]?.matched || selected.length === 2) return;
    const next = cards.map((card, cardIndex) => cardIndex === index ? { ...card, open: true } : card);
    const picks = [...selected, index]; setCards(next); setSelected(picks);
    if (picks.length === 2) {
      setMoves((value) => value + 1); setLocked(true);
      const [first, second] = picks;
      const matched = next[first].icon === next[second].icon;
      setTimeout(() => { setCards((current) => current.map((card, cardIndex) => picks.includes(cardIndex) ? { ...card, open: matched, matched } : card)); if (matched) setMatches((value) => value + 1); setSelected([]); setLocked(false); }, matched ? 250 : config.delay);
    }
  };
  return <Shell title="Parejas escondidas" subtitle={age === "5-7" ? "Encuentra animales iguales y fortalece tu memoria visual." : age === "15+" ? "Relaciona códigos y símbolos bajo presión de memoria." : "Encuentra los elementos iguales y ejercita tu memoria visuoespacial."} image={cerebro} level={level} setLevel={setLevel} age={age} onReset={reset}><div className="game-stats"><b>Parejas <strong>{matches}/{config.pairs}</strong></b><b>Intentos <strong>{moves}</strong></b><b>Precisión <strong>{moves ? Math.round((matches / moves) * 100) : 0}%</strong></b></div><div className="memory-board" style={{ "--columns": config.columns }}>{cards.map((card, index) => <button aria-label={card.open || card.matched ? `Símbolo ${card.icon}` : "Carta oculta"} className={`memory-card ${card.open || card.matched ? "revealed" : ""} ${card.matched ? "matched" : ""}`} onClick={() => choose(index)} key={card.id}>{card.open || card.matched ? <span className="memory-card-icon">{card.icon}</span> : "?"}</button>)}</div>{matches === config.pairs && <div className="success-message"><h2>¡Nivel completado!</h2><p>Lograste {matches} parejas en {moves} intentos.</p></div>}</Shell>;
}

const WORDS_BY_AGE = {
  "5-7": [[{ word: "casa", parts: ["ca", "sa"], hint: "🏠" }, { word: "gato", parts: ["ga", "to"], hint: "🐈" }, { word: "luna", parts: ["lu", "na"], hint: "🌙" }], [{ word: "pato", parts: ["pa", "to"], hint: "🦆" }, { word: "mesa", parts: ["me", "sa"], hint: "🪑" }, { word: "sapo", parts: ["sa", "po"], hint: "🐸" }], [{ word: "pelota", parts: ["pe", "lo", "ta"], hint: "⚽" }, { word: "camisa", parts: ["ca", "mi", "sa"], hint: "👕" }]],
  "8-10": [[{ word: "casa", parts: ["ca", "sa"], hint: "🏠" }, { word: "gato", parts: ["ga", "to"], hint: "🐈" }, { word: "luna", parts: ["lu", "na"], hint: "🌙" }], [{ word: "pelota", parts: ["pe", "lo", "ta"], hint: "⚽" }, { word: "camisa", parts: ["ca", "mi", "sa"], hint: "👕" }, { word: "zapato", parts: ["za", "pa", "to"], hint: "👟" }], [{ word: "mariposa", parts: ["ma", "ri", "po", "sa"], hint: "🦋" }, { word: "chocolate", parts: ["cho", "co", "la", "te"], hint: "🍫" }]],
  "11-15": [[{ word: "planeta", parts: ["pla", "ne", "ta"], hint: "🪐" }, { word: "musica", parts: ["mu", "si", "ca"], hint: "🎧" }], [{ word: "maravilla", parts: ["ma", "ra", "vi", "lla"], hint: "✨" }, { word: "aventura", parts: ["a", "ven", "tu", "ra"], hint: "🧭" }], [{ word: "investigacion", parts: ["in", "ves", "ti", "ga", "cion"], hint: "🔬" }, { word: "creatividad", parts: ["cre", "a", "ti", "vi", "dad"], hint: "🎭" }]],
  "15+": [[{ word: "proyecto", parts: ["pro", "yec", "to"], hint: "📋" }, { word: "dialogo", parts: ["di", "a", "lo", "go"], hint: "💬" }], [{ word: "pensamiento", parts: ["pen", "sa", "mien", "to"], hint: "💡" }, { word: "estrategia", parts: ["es", "tra", "te", "gia"], hint: "🧠" }], [{ word: "responsabilidad", parts: ["res", "pon", "sa", "bi", "li", "dad"], hint: "✅" }, { word: "comunicacion", parts: ["co", "mu", "ni", "ca", "cion"], hint: "📣" }]]
};

export function JuegoSilabasPage() {
  const [level, setLevel] = useState(getInitialLevel); const [age] = useState(getInitialAge); const [index, setIndex] = useState(0); const [answer, setAnswer] = useState([]); const [correct, setCorrect] = useState(0); const [errors, setErrors] = useState(0);
  const words = WORDS_BY_AGE[age] || WORDS_BY_AGE["8-10"]; const word = words[level][index];
  const reset = () => { setIndex(0); setAnswer([]); setCorrect(0); setErrors(0); }; const changeLevel = (value) => { setLevel(value); reset(); };
  const pick = (part) => { const next = [...answer, part]; setAnswer(next); if (next.length === word.parts.length) { if (next.join("") === word.word) { setCorrect((value) => value + 1); setTimeout(() => { setIndex((value) => (value + 1) % words[level].length); setAnswer([]); }, 500); } else { setErrors((value) => value + 1); setTimeout(() => setAnswer([]), 700); } } };
  const available = shuffle(word.parts.filter((part, partIndex) => !answer.includes(part) || answer.indexOf(part) === partIndex));
  return <Shell title="El tren de sílabas" subtitle={age === "5-7" ? "Construye palabras conocidas con apoyo visual." : age === "15+" ? "Organiza vocabulario complejo y mejora tu precisión." : "Ordena las sílabas para construir palabras adecuadas a tu edad."} image={libros} level={level} setLevel={changeLevel} age={age} onReset={reset}><div className="word-prompt"><span className="word-hint">{word.hint}</span><span>Arma una palabra de {word.parts.length} sílabas</span></div><div className="syllable-train"><span className="train-engine">🚂</span>{word.parts.map((_, partIndex) => <span className={`train-car ${answer[partIndex] ? "filled" : ""}`} key={partIndex}>{answer[partIndex] || "___"}</span>)}</div><div className="syllable-options">{available.map((part, partIndex) => <button onClick={() => pick(part)} disabled={answer.length >= word.parts.length} key={`${part}-${partIndex}`}>{part}</button>)}</div><div className="game-stats"><b>Palabras <strong>{index + 1}/{words[level].length}</strong></b><b>Aciertos <strong>{correct}</strong></b><b>Errores <strong>{errors}</strong></b></div></Shell>;
}

const LETRAS_BY_AGE = {
  "5-7": [{ target: "a", distractors: ["e", "i", "o"], duration: 30 }, { target: "m", distractors: ["n", "w", "a"], duration: 35 }, { target: "b", distractors: ["a", "c", "d", "p"], duration: 40 }],
  "8-10": [{ target: "b", distractors: ["a", "c", "e", "o"], duration: 30 }, { target: "b", distractors: ["d", "p", "q", "a"], duration: 35 }, { target: "b", distractors: ["d", "p", "q", "n", "u"], duration: 40 }],
  "11-15": [{ target: "g", distractors: ["a", "c", "e", "o"], duration: 30 }, { target: "g", distractors: ["q", "p", "j", "a"], duration: 35 }, { target: "g", distractors: ["q", "p", "j", "y", "9"], duration: 40 }],
  "15+": [{ target: "B", distractors: ["b", "D", "P", "R"], duration: 30 }, { target: "B", distractors: ["b", "d", "p", "q", "R"], duration: 35 }, { target: "B", distractors: ["b", "d", "p", "q", "g", "8"], duration: 40 }]
};

export function JuegoLetrasPage() {
  const [level, setLevel] = useState(getInitialLevel); const [age] = useState(getInitialAge); const [letters, setLetters] = useState([]); const [hits, setHits] = useState(0); const [misses, setMisses] = useState(0); const [running, setRunning] = useState(false); const [time, setTime] = useState(0);
  const configs = LETRAS_BY_AGE[age] || LETRAS_BY_AGE["8-10"]; const config = configs[level];
  const reset = () => { setRunning(false); setLetters([]); setHits(0); setMisses(0); setTime(config.duration); };
  useEffect(() => { setRunning(false); setLetters([]); setHits(0); setMisses(0); setTime(config.duration); }, [level, age, config.duration]);
  useEffect(() => { if (!running) return undefined; const currentConfig = configs[level]; const timer = setInterval(() => setTime((value) => { if (value <= 1) { setRunning(false); return 0; } return value - 1; }), 1000); const spawn = setInterval(() => setLetters((current) => [...current.slice(-7), { id: Date.now() + Math.random(), value: Math.random() < .35 ? currentConfig.target : shuffle(currentConfig.distractors)[0], left: 5 + Math.random() * 88, top: 5 + Math.random() * 82 }]), 850); return () => { clearInterval(timer); clearInterval(spawn); }; }, [running, level, age, configs]);
  const click = (letter) => { setLetters((current) => current.filter((item) => item.id !== letter.id)); if (letter.value === config.target) setHits((value) => value + 1); else setMisses((value) => value + 1); };
  return <Shell title="Lluvia de letras" subtitle={`Atrapa la letra ${config.target} e ignora las distractoras.`} image={juego} level={level} setLevel={setLevel} age={age} onReset={reset}><div className="letter-stats"><b>Tiempo <strong>{time}s</strong></b><b>Aciertos <strong>{hits}</strong></b><b>Falsas alarmas <strong>{misses}</strong></b></div><div className="letter-field" aria-label="Área de letras"><div className="target-badge">Objetivo: <strong>{config.target}</strong></div>{letters.map((letter) => <button className={letter.value === config.target ? "target-letter" : "distractor-letter"} style={{ left: `${letter.left}%`, top: `${letter.top}%` }} onClick={() => click(letter)} key={letter.id}>{letter.value}</button>)}{!running && <div className="field-overlay"><p>{time === 0 ? "Tiempo terminado" : "Pulsa iniciar cuando estés listo"}</p><button onClick={() => setRunning(true)}>{time === 0 ? "Jugar de nuevo" : "Iniciar"}</button></div>}</div></Shell>;
}
