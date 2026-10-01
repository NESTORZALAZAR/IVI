export async function generateAudioFromText(text) {
  const response = await fetch("http://localhost:8000/api/lector/extract-and-speak/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ text: text.trim() }),
  });
  const data = await response.json();
  if (!response.ok || !data.audio) throw new Error(data.error || "No se pudo generar el audio");

  const bytes = new Uint8Array(data.audio.length / 2);
  for (let index = 0; index < data.audio.length; index += 2) {
    bytes[index / 2] = parseInt(data.audio.slice(index, index + 2), 16);
  }

  return URL.createObjectURL(new Blob([bytes], { type: "audio/mpeg" }));
}
