import "../../css/pages/AboutPage.css";

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-container">
        <h1>Acerca de IVI</h1>
        
        <section className="about-section">
          <h2>¿Qué es IVI?</h2>
          <p>
            IVI (Plataforma de Apoyo y Tamizaje Dislexia) es una herramienta digital diseñada 
            para proporcionar apoyo a personas con dislexia mediante evaluaciones especializadas 
            y herramientas de accesibilidad personalizadas.
          </p>
        </section>

        <section className="about-section">
          <h2>Funcionalidades Principales</h2>
          <ul>
            <li><strong>Pruebas de Tamizaje:</strong> Evaluaciones especializadas para detectar indicios de dislexia</li>
            <li><strong>Panel de Accesibilidad:</strong> Personaliza fuentes, tamaño, espaciado y contraste</li>
            <li><strong>Recursos Educativos:</strong> Acceso a contenido especializado y materiales de apoyo</li>
            <li><strong>Interfaz Intuitiva:</strong> Diseño pensado especialmente para la facilidad de uso</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Fuentes Accesibles</h2>
          <p>
            IVI ofrece diferentes opciones de fuentes optimizadas para mejorar la experiencia de lectura:
          </p>
          <ul>
            <li><strong>Lato:</strong> Fuente estándar clara y legible</li>
            <li><strong>Lexend:</strong> Especialmente diseñada para personas con dislexia</li>
            <li><strong>Arial:</strong> Fuente sans-serif simple y universal</li>
            <li><strong>Georgia:</strong> Fuente serif clásica y legible</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Opciones de Personalización</h2>
          <ul>
            <li>Tamaño de letra ajustable (14px - 28px)</li>
            <li>Control de interlineado (espaciado entre líneas)</li>
            <li>Modo oscuro con tonalidades para dislexia</li>
            <li>Temas de fondo (blanco, crema, sepia)</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Privacidad y Seguridad</h2>
          <p>
            Tus datos y preferencias de accesibilidad son almacenados de forma segura. 
            Respetamos tu privacidad y utilizamos la información únicamente para mejorar tu experiencia.
          </p>
        </section>
      </div>
    </main>
  );
}
