import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Alert,
  Badge,
  Navbar,
  Nav,
  NavItem,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
  Form,
  FormGroup,
  Input,
  UncontrolledAlert

} from 'reactstrap';

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

      <Form onSubmit={manejarAjuste}>
        <FormGroup className="d-flex gap-2">
          <Input
            type="number"
            value={temperatura}
            onChange={(e) => setTemperatura(e.target.value)}
            placeholder="1-100"
            disabled={estabilizado}
            min="1"
            max="100"
          />
          <Button 
            type="submit" 
            color="primary" 
            disabled={estabilizado}
          >
            Ajustar
          </Button>
        </FormGroup>
      </Form>

      {/* Botón de Reinicio */}
      <Button 
        color="danger" 
        onClick={manejarReiniciar} 
        className="mt-2 w-100"
      >
        Reiniciar Sistema
      </Button>
      
      <h3>Historial</h3>

      <ListGroup>
                    {historial.length === 0 ? (
                      <ListGroupItem className="text-muted text-center">
                        La nave está vacía. Añade suministros.
                      </ListGroupItem>
                    ) : (
                      
                      historial.map((Temp, index) => (
                        
                        <ListGroupItem key={ index} className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>Intento {index + 1}</strong>
                            <div className="text-muted small">Temp : {Temp }</div>
                          </div>

                          <Badge color="primary" pill>
                            {Temp}°C
                          </Badge>
                        
                        </ListGroupItem>
                      ) ))
                    }
                  </ListGroup>
    </div>
  );
}
