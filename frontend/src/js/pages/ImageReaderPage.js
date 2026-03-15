import { useState, useRef } from "react";
import ImageFileUploader from "../components/common/ImageFileUploader/ImageFileUploader";
import "./ImageReaderPage.css";

// El modelo BLIP corre en el backend Python (sin API keys, sin límites)
// La primera llamada descarga el modelo (~990MB) a la caché local del servidor
async function describirConIA(archivo, onProgreso) {
  const BACKEND_URL = 'http://localhost:8000/api/archivos/describe-ia/';

  onProgreso('Analizando imagen con IA...');

  const formData = new FormData();
  formData.append('file', archivo);

  // Timeout largo: primera vez descarga el modelo BLIP (~1-3 min)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 min

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error del servicio: ${res.status}`);
    }

    const result = await res.json();
    if (!result.descripcion) throw new Error('El modelo no devolvió descripción');
    return result.descripcion;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Tiempo de espera agotado. Intenta de nuevo.');
    throw err;
  }
}

export default function ImageReaderPage() {
  const [resultado, setResultado] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [hablando, setHablando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [velocidad, setVelocidad] = useState(1);

  const [descripcion, setDescripcion] = useState("");
  const [describiendo, setDescribiendo] = useState(false);
  const [progresoIA, setProgresoIA] = useState("");

  const utteranceRef = useRef(null);

  const handleFileProcessed = (data) => {
    window.speechSynthesis.cancel();
    setHablando(false);
    setPausado(false);
    setDescripcion("");
    setResultado(data);
    
    // Crear preview de la imagen
    if (data.archivo) {
      const reader = new FileReader();
      reader.onload = (e) => setImagenPreview(e.target.result);
      reader.readAsDataURL(data.archivo);
    }
  };

  const leer = (texto, lang = "es-ES") => {
    if (!texto) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = lang;
    utter.rate = velocidad;
    utter.onstart = () => { setHablando(true); setPausado(false); };
    utter.onend = () => { setHablando(false); setPausado(false); };
    utter.onerror = () => { setHablando(false); setPausado(false); };
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const pausarReanudar = () => {
    if (pausado) { window.speechSynthesis.resume(); setPausado(false); }
    else { window.speechSynthesis.pause(); setPausado(true); }
  };

  const detener = () => {
    window.speechSynthesis.cancel();
    setHablando(false);
    setPausado(false);
  };

  const handleDescribirIA = async () => {
    if (!resultado?.archivo) return;
    setDescribiendo(true);
    setDescripcion("");
    window.speechSynthesis.cancel();
    setHablando(false);
    try {
      const desc = await describirConIA(resultado.archivo, setProgresoIA);
      setDescripcion(desc);
      setProgresoIA("");
    } catch (err) {
      setDescripcion("Error: " + err.message);
      setProgresoIA("");
    } finally {
      setDescribiendo(false);
    }
  };

  return (
    <div className="image-reader-page">
      <div className="reader-container">
        <div className="reader-header">
          <h1>🖼️ Lector de Imágenes</h1>
          <p>Carga una imagen — extrae texto con OCR o describe dibujos con IA</p>
        </div>

        <div className="reader-content">
          {/* ── TARJETA RECTANGULAR: Carga de Imagen ── */}
          <div className="tarjeta-carga">
            {imagenPreview ? (
              <div className="imagen-preview-contenedor">
                <img src={imagenPreview} alt="Imagen cargada" className="imagen-preview" />
                <button 
                  className="btn-cambiar-imagen"
                  onClick={() => {
                    setImagenPreview(null);
                    setResultado(null);
                    setDescripcion("");
                  }}
                >
                  📸 Cambiar imagen
                </button>
              </div>
            ) : (
              <ImageFileUploader onFileProcessed={handleFileProcessed} />
            )}
          </div>

          {/* ── DOS TARJETAS RECTANGULARES: Resultados ── */}
          {resultado && (
            <div className="resultados-contenedor">
              {/* ── TARJETA IZQUIERDA: Lectura de Texto OCR ── */}
              <div className="tarjeta-resultado tarjeta-izquierda">
                <div className="tarjeta-header">
                  <h3>📝 Texto Extraído</h3>
                  <p className="tipo-etiqueta">Lectura mediante OCR</p>
                </div>

                {resultado.texto && resultado.texto.trim().length > 0 ? (
                  <>
                    <div className="texto-extraido">
                      {resultado.texto}
                    </div>
                    <p className="contador-caracteres">
                      {resultado.caracteres} caracteres
                    </p>

                    <div className="controles-audio">
                      <div className="velocidad-control">
                        <label>Velocidad: {velocidad}x</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={velocidad}
                          onChange={(e) => setVelocidad(parseFloat(e.target.value))}
                          disabled={hablando}
                        />
                      </div>
                      <div className="botones-audio">
                        {!hablando ? (
                          <button className="btn-leer" onClick={() => leer(resultado.texto)}>
                            ▶️ Leer texto
                          </button>
                        ) : (
                          <>
                            <button className="btn-pausar" onClick={pausarReanudar}>
                              {pausado ? "▶️ Reanudar" : "⏸ Pausar"}
                            </button>
                            <button className="btn-detener" onClick={detener}>
                              ⏹ Detener
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="sin-contenido">
                    <p>No se encontró texto en la imagen.</p>
                  </div>
                )}
              </div>

              {/* ── TARJETA DERECHA: Descripción con IA ── */}
              <div className="tarjeta-resultado tarjeta-derecha">
                <div className="tarjeta-header">
                  <h3>🤖 Descripción con IA</h3>
                  <p className="tipo-etiqueta">Análisis visual de la imagen</p>
                </div>

                {describiendo ? (
                  <div className="ia-loading">
                    <div className="spinner-ia"></div>
                    <span>{progresoIA || "Procesando..."}</span>
                  </div>
                ) : descripcion ? (
                  <>
                    <div className="descripcion-texto">{descripcion}</div>

                    <div className="controles-audio">
                      <div className="botones-audio">
                        {!hablando ? (
                          <button className="btn-leer" onClick={() => leer(descripcion)}>
                            ▶️ Escuchar descripción
                          </button>
                        ) : (
                          <>
                            <button className="btn-pausar" onClick={pausarReanudar}>
                              {pausado ? "▶️ Reanudar" : "⏸ Pausar"}
                            </button>
                            <button className="btn-detener" onClick={detener}>
                              ⏹ Detener
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="sin-contenido">
                    <button
                      className="btn-describir"
                      onClick={handleDescribirIA}
                      disabled={describiendo}
                    >
                      {describiendo ? "Analizando..." : "🔍 Analizar imagen"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
