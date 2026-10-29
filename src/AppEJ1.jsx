import React, { useState } from 'react';

export default function Reactor() {
  const [temperatura, setTemperatura] = useState('');
  const [mensaje, setMensaje] = useState('El reactor requiere estabilización.');
  const [historial, setHistorial] = useState([]);
  const [estabilizado, setEstabilizado] = useState(false);
  const API_URL = 'http://localhost:3000/api';
  // Enviar intento de ajuste al servidor usando promesas (.then)
  const manejarAjuste = (e) => {
    e.preventDefault();
    if (!temperatura) return;

    fetch(`${API_URL}/reactor/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature_usr: Number(temperatura) }),
    })
      .then(res => res.json())
      .then(data => {
        setMensaje(data.res);

        if (data.res === 'estabilizado') {
          setEstabilizado(true);
        } else {
          setHistorial([...historial, temperatura]);
        }
        setTemperatura('');
      });
  };

  // Reiniciar el reactor usando promesas (.then)
  const manejarReiniciar = () => {
    fetch(`${API_URL}/reactor/reboot`, { method: 'POST' })
      .then(() => {
        setMensaje('Reactor reiniciado. Introduce una nueva temperatura.');
        setHistorial([]);
        setEstabilizado(false);
        setTemperatura('');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Control del Reactor</h2>
      <p style={{ color: estabilizado ? 'green' : 'orange' }}>Estado: {mensaje}</p>

      <form onSubmit={manejarAjuste}>
        <input
          type="number"
          value={temperatura}
          onChange={(e) => setTemperatura(e.target.value)}
          placeholder="1-100"
          disabled={estabilizado}
        />
        <button type="submit" disabled={estabilizado}>Ajustar</button>
      </form>

      <button onClick={manejarReiniciar} style={{ marginTop: '10px' }}>Reiniciar Sistema</button>

      <h3>Historial</h3>
      <ul>
        {historial.map((temp, index) => (
          <li key={index}>Intento #{index + 1}: {temp}°C</li>
        ))}
      </ul>
    </div>
  );
}
