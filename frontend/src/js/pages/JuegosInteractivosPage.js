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
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const PAREJAS_CONFIGS = [{ pairs: 4, columns: 4, delay: 850 }, { pairs: 6, columns: 4, delay: 650 }, { pairs: 8, columns: 4, delay: 500 }];
const PAREJAS_ICONS = ["★", "●", "▲", "◆", "♥", "☀", "☘", "✿"];
const LETRAS_CONFIGS = [{ target: "b", distractors: ["a", "c", "e", "o"], duration: 30 }, { target: "b", distractors: ["d", "p", "q", "a"], duration: 35 }, { target: "b", distractors: ["d", "p", "q", "n", "u"], duration: 40 }];
const getInitialLevel = () => {
  const value = Number(new URLSearchParams(window.location.search).get("dificultad"));
  return Number.isInteger(value) && value >= 0 && value <= 2 ? value : 0;
};
const createMemoryDeck = (level, icons, configs) => {
  const deck = icons.slice(0, configs[level].pairs).flatMap((icon) => [icon, icon]).map((icon, id) => ({ id, icon, open: false, matched: false }));
  return shuffle(deck);
};

function Shell({ title, subtitle, image, level, setLevel, children, onReset }) {
  return <main className="game-page"><div className="game-shell"><Link className="back-link" to="/juegos">← Volver a juegos</Link><header className="game-title"><img src={image} alt="" /><div><span className="eyebrow">Juego de tamizaje</span><h1>{title}</h1><p>{subtitle}</p></div></header><nav className="level-tabs" aria-label="Seleccionar nivel">{niveles.map((item, index) => <button className={level === index ? `active ${item.className}` : ""} onClick={() => setLevel(index)} key={item.label}>{item.label}<small>{item.detail}</small></button>)}</nav>{children}<button className="reset-button" onClick={onReset}>Reiniciar nivel</button></div></main>;
}

export function JuegoParejasPage() {
  const [level, setLevel] = useState(getInitialLevel); const [cards, setCards] = useState([]); const [selected, setSelected] = useState([]); const [moves, setMoves] = useState(0); const [matches, setMatches] = useState(0); const [locked, setLocked] = useState(false);
  const config = PAREJAS_CONFIGS[level];
  const reset = () => {
      setCards(createMemoryDeck(level, PAREJAS_ICONS, PAREJAS_CONFIGS));
    setSelected([]); setMoves(0); setMatches(0); setLocked(false);
  };
  useEffect(() => {
    setCards(createMemoryDeck(level, PAREJAS_ICONS, PAREJAS_CONFIGS));
    setSelected([]); setMoves(0); setMatches(0); setLocked(false);
  }, [level]);
  const choose = (index) => { if (locked || cards[index]?.open || cards[index]?.matched || selected.length === 2) return; const next = cards.map((card, i) => i === index ? { ...card, open: true } : card); const picks = [...selected, index]; setCards(next); setSelected(picks); if (picks.length === 2) { setMoves((value) => value + 1); setLocked(true); const [first, second] = picks; if (next[first].icon === next[second].icon) { setTimeout(() => { setCards((current) => current.map((card, i) => picks.includes(i) ? { ...card, matched: true } : card)); setMatches((value) => value + 1); setSelected([]); setLocked(false); }, 250); } else setTimeout(() => { setCards((current) => current.map((card, i) => picks.includes(i) ? { ...card, open: false } : card)); setSelected([]); setLocked(false); }, config.delay); } };
  return <Shell title="Parejas escondidas" subtitle="Encuentra los símbolos iguales y ejercita tu memoria visuoespacial." image={cerebro} level={level} setLevel={setLevel} onReset={reset}><div className="game-stats"><b>Parejas <strong>{matches}/{config.pairs}</strong></b><b>Intentos <strong>{moves}</strong></b><b>Precisión <strong>{moves ? Math.round((matches / moves) * 100) : 0}%</strong></b></div><div className="memory-board" style={{ "--columns": config.columns }}>{cards.map((card, index) => <button aria-label={card.open || card.matched ? `Símbolo ${card.icon}` : "Carta oculta"} className={`memory-card ${card.open || card.matched ? "revealed" : ""} ${card.matched ? "matched" : ""}`} onClick={() => choose(index)} key={card.id}>{card.open || card.matched ? card.icon : "?"}</button>)}</div>{matches === config.pairs && <div className="success-message"><h2>¡Nivel completado!</h2><p>Lograste {matches} parejas en {moves} intentos.</p></div>}</Shell>;
}

const words = [
  [{ word: "casa", parts: ["ca", "sa"], hint: "🏠" }, { word: "gato", parts: ["ga", "to"], hint: "🐈" }, { word: "luna", parts: ["lu", "na"], hint: "🌙" }],
  [{ word: "pelota", parts: ["pe", "lo", "ta"], hint: "⚽" }, { word: "camisa", parts: ["ca", "mi", "sa"], hint: "👕" }, { word: "zapato", parts: ["za", "pa", "to"], hint: "👟" }],
  [{ word: "mariposa", parts: ["ma", "ri", "po", "sa"], hint: "🦋" }, { word: "chocolate", parts: ["cho", "co", "la", "te"], hint: "🍫" }, { word: "computadora", parts: ["com", "pu", "ta", "do", "ra"], hint: "💻" }]
];
export function JuegoSilabasPage() {
  const [level, setLevel] = useState(getInitialLevel); const [index, setIndex] = useState(0); const [answer, setAnswer] = useState([]); const [correct, setCorrect] = useState(0); const [errors, setErrors] = useState(0); const word = words[level][index];
  const reset = () => { setIndex(0); setAnswer([]); setCorrect(0); setErrors(0); };
  const changeLevel = (value) => { setLevel(value); setIndex(0); setAnswer([]); setCorrect(0); setErrors(0); };
  const pick = (part) => { const next = [...answer, part]; setAnswer(next); if (next.length === word.parts.length) { if (next.join("") === word.word) { setCorrect((v) => v + 1); setTimeout(() => { setIndex((v) => (v + 1) % words[level].length); setAnswer([]); }, 500); } else { setErrors((v) => v + 1); setTimeout(() => setAnswer([]), 700); } } };
  const available = shuffle(word.parts.filter((part, i) => !answer.includes(part) || answer.indexOf(part) === i));
  return <Shell title="El tren de sílabas" subtitle="Ordena las sílabas para construir cada palabra." image={libros} level={level} setLevel={changeLevel} onReset={reset}><div className="word-prompt"><span className="word-hint">{word.hint || "?"}</span><span>Arma una palabra de {word.parts.length} sílabas</span></div><div className="syllable-train"><span className="train-engine">🚂</span>{word.parts.map((_, i) => <span className={`train-car ${answer[i] ? "filled" : ""}`} key={i}>{answer[i] || "___"}</span>)}</div><div className="syllable-options">{available.map((part, i) => <button onClick={() => pick(part)} disabled={answer.length >= word.parts.length} key={`${part}-${i}`}>{part}</button>)}</div><div className="game-stats"><b>Palabras <strong>{index + 1}/{words[level].length}</strong></b><b>Aciertos <strong>{correct}</strong></b><b>Errores <strong>{errors}</strong></b></div></Shell>;
}

export function JuegoLetrasPage() {
  const [level, setLevel] = useState(getInitialLevel); const [letters, setLetters] = useState([]); const [hits, setHits] = useState(0); const [misses, setMisses] = useState(0); const [running, setRunning] = useState(false); const [time, setTime] = useState(0); const config = LETRAS_CONFIGS[level];
  const reset = () => { setRunning(false); setLetters([]); setHits(0); setMisses(0); setTime(config.duration); };
  useEffect(() => { setRunning(false); setLetters([]); setHits(0); setMisses(0); setTime(LETRAS_CONFIGS[level].duration); }, [level]);
  useEffect(() => { if (!running) return undefined; const currentConfig = LETRAS_CONFIGS[level]; const timer = setInterval(() => setTime((value) => { if (value <= 1) { setRunning(false); return 0; } return value - 1; }), 1000); const spawn = setInterval(() => setLetters((current) => [...current.slice(-7), { id: Date.now() + Math.random(), value: Math.random() < .35 ? currentConfig.target : shuffle(currentConfig.distractors)[0], left: 5 + Math.random() * 88, top: 5 + Math.random() * 82 }]), 850); return () => { clearInterval(timer); clearInterval(spawn); }; }, [running, level]);
    const click = (letter) => { setLetters((current) => current.filter((item) => item.id !== letter.id)); if (letter.value === config.target) setHits((v) => v + 1); else setMisses((v) => v + 1); };
  return <Shell title="Lluvia de letras" subtitle={`Atrapa la letra ${config.target} e ignora las distractoras.`} image={juego} level={level} setLevel={setLevel} onReset={reset}><div className="letter-stats"><b>Tiempo <strong>{time}s</strong></b><b>Aciertos <strong>{hits}</strong></b><b>Falsas alarmas <strong>{misses}</strong></b></div><div className={`letter-field ${running ? "active" : ""}`} aria-label="Área de letras"><div className="target-badge">Objetivo: <strong>{config.target}</strong></div>{letters.map((letter) => <button className={letter.value === config.target ? "target-letter" : "distractor-letter"} style={{ left: `${letter.left}%`, top: `${letter.top}%` }} onClick={() => click(letter)} key={letter.id}>{letter.value}</button>)}{!running && <div className="field-overlay"><p>{time === 0 ? "Tiempo terminado" : "Pulsa iniciar cuando estés listo"}</p><button onClick={() => setRunning(true)}>{time === 0 ? "Jugar de nuevo" : "Iniciar"}</button></div>}</div></Shell>;
}
