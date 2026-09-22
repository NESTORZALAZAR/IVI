import { Link } from "react-router-dom";
import { useState } from "react";
import cerebro from "../../images/juegos/cerebro.svg";
import juego from "../../images/juegos/juego.svg";
import libros from "../../images/juegos/libros.svg";
import "../../css/pages/JuegosPage.css";

const juegos = [
  { path: "parejas", title: "Parejas escondidas", text: "Entrena la memoria de trabajo visuoespacial encontrando cada pareja.", image: cerebro, color: "mint", tag: "Memoria", age: "5-15 años" },
  { path: "silabas", title: "El tren de sílabas", text: "Ordena las sílabas y arma palabras paso a paso.", image: libros, color: "gold", tag: "Conciencia fonológica", age: "5-15 años" },
  { path: "letras", title: "Lluvia de letras", text: "Atrapa los objetivos y filtra las letras distractoras.", image: juego, color: "coral", tag: "Atención", age: "7-15 años" }
];

const dificultades = [
  { value: "all", label: "Todos" },
  { value: "0", label: "Fácil" },
  { value: "1", label: "Medio" },
  { value: "2", label: "Difícil" }
];
const edades = [
  { value: "all", label: "Todas las edades" },
  { value: "5-7", label: "5-7 años" },
  { value: "8-10", label: "8-10 años" },
  { value: "11-15", label: "11-15 años" },
  { value: "15+", label: "15+ años" }
];

const getStoredAge = () => {
  const officePatient = JSON.parse(localStorage.getItem("ivi_office_patient") || "null");
  const storedUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("ivi_user") || "null");
  const age = Number(officePatient?.age ?? storedUser?.age ?? 0);
  if (age >= 5 && age <= 7) return "5-7";
  if (age >= 8 && age <= 10) return "8-10";
  if (age >= 11 && age <= 15) return "11-15";
  if (age > 15) return "15+";
  return "all";
};

export default function JuegosPage() {
  const [difficulty, setDifficulty] = useState("all");
  const [age, setAge] = useState(getStoredAge);
  const query = new URLSearchParams();
  if (difficulty !== "all") query.set("dificultad", difficulty);
  if (age !== "all") query.set("edad", age);
  const queryString = query.toString();

  return (
    <main className="games-page">
      <header className="games-hero">
        <div><span className="eyebrow">Módulo lúdico</span><h1>Juegos de tamizaje</h1><p>Actividades breves para explorar memoria, conciencia fonológica y atención. Completa los niveles a tu ritmo.</p></div>
        <img src={juego} alt="Ilustración de un juego" />
      </header>
      <section className="difficulty-filter" aria-labelledby="difficulty-title">
        <div><span className="eyebrow">Personaliza el reto</span><h2 id="difficulty-title">Elige edad y dificultad</h2></div>
        <div className="difficulty-options" role="group" aria-label="Filtrar por dificultad">
          {dificultades.map((option) => <button className={difficulty === option.value ? "selected" : ""} onClick={() => setDifficulty(option.value)} key={option.value}>{option.label}</button>)}
        </div>
        <div className="age-options" role="group" aria-label="Filtrar por edad">
          {edades.map((option) => <button className={age === option.value ? "selected" : ""} onClick={() => setAge(option.value)} key={option.value}>{option.label}</button>)}
        </div>
      </section>
      <section className="games-grid" aria-label="Juegos disponibles">
        {juegos.map((item) => <Link className={`game-card ${item.color}`} to={`/juegos/${item.path}${queryString ? `?${queryString}` : ""}`} key={item.path}>
          <img src={item.image} alt="" /><span className="game-tag">{item.tag}</span><h2>{item.title}</h2><p>{item.text}</p><span className="game-card-level">{age === "all" ? item.age : edades.find((option) => option.value === age).label} · {difficulty === "all" ? "3 niveles disponibles" : `${dificultades[Number(difficulty) + 1].label} seleccionado`}</span><span className="game-card-link">Jugar ahora <span aria-hidden="true">→</span></span>
        </Link>)}
      </section>
      <p className="games-note">Estas actividades son orientativas y no sustituyen una evaluación profesional.</p>
    </main>
  );
}
