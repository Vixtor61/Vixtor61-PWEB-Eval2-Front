import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Ej1 from './AppEJ1'; // Asegúrate de ajustar la ruta si están en otra carpeta
import Ej2 from './App';

function App() {
  return (
    <BrowserRouter>
      <nav style={styles.nav}>
        <h3 style={{ margin: 0 }}>Panel de Control</h3>
        <div style={styles.linksContainer}>
          {/* Links que cambian la URL sin recargar la página */}
          <Link to="/ejercicio1" style={styles.link}>Ir a Ejercicio 1</Link>
          <Link to="/ejercicio2" style={styles.link}>Ir a Ejercicio 2</Link>
        </div>
      </nav>

      {/* CONTENEDOR DONDE SE CARGAN LAS VISTAS */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Ej1 />} /> 
          
          <Route path="/ejercicio1" element={<Ej1 />} />
          <Route path="/ejercicio2" element={<Ej2 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Estilos básicos para que tu menú se vea ordenado y moderno
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#1f2937', // Gris oscuro profesional
    color: 'white',
    fontFamily: 'sans-serif'
  },
  linksContainer: {
    display: 'flex',
    gap: '20px'
  },
  link: {
    color: '#38bdf8', // Azul claro llamativo
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px'
  }
};

export default App;
