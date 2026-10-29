import React, { useState, useEffect } from 'react';
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
  ListGroupItem

} from 'reactstrap';

const GridItem = ({ item, onAñadir }) => {
  return (
    <Col md="4" xs="12">
      <Card className="mb-3"> 
        <CardBody>
          <CardTitle tag="h3">{item.nombre}</CardTitle>
          <CardText tag="h5">Categoria: {item.categoria}</CardText>
          <CardText tag="h6">Precio: <Badge color="success" pill> {item.precio} Cr</Badge></CardText>
          
          <Alert color={item.stockDisponible > 0 ? "success" : "danger"}>
            {item.stockDisponible > 0 ? `Stock disponible: ${item.stockDisponible}` : "Agotado en base"}
          </Alert>
          
          <ButtonGroup>
            <Button 
              color="secondary" 
              disabled={item.stockDisponible <= 0} 
              onClick={() => onAñadir(item)}
            >
              Añadir a Nave
            </Button>
          </ButtonGroup>
        </CardBody>
      </Card>
    </Col>
  );
};


const DynamicGrid = ({ items, onAñadir }) => {
  return (
    <Container>
      <Row>
        {items.map((item, index) => (
          <GridItem 
            key={item.id || item._id || index} 
            item={item} 
            onAñadir={onAñadir} 
          />    
        ))}
      </Row>
    </Container>
  );
};


function App() {
  // --- ESTADOS ---
  const [creditos, setCreditos] = useState(0);
  const [costoTotal, setCostoTotal] = useState(0);
  const [reservas, setReservas] = useState([]);
  const [suministros, setSuministros] = useState([]);

  const API_URL = 'http://localhost:3000/api';

  const cargarCatalogo = () => {
    fetch(`${API_URL}/inventario/`)
      .then(res => res.json())
      .then(data => {
        if (data && data.suministros) {
          setSuministros(data.suministros);
        }
      })
      .catch(err => console.error("Error cargando catálogo:", err));
  };

  const cargarCarga = () => {
    fetch(`${API_URL}/inventario/carga`)
      .then(res => res.json())
      .then(data => {
        if (data && data.creditos) setCreditos(data.creditos);
        if (data && data.precioTotal) setCostoTotal(data.precioTotal);
        if (data && data.items) setReservas(data.items);
      })
      .catch(err => console.error("Error cargando créditos/costos:", err));
  };
  useEffect(() => {
    cargarCatalogo();
    cargarCarga();
  }, []);
        



  // CORRECCIÓN AQUÍ: Añadida la lógica para disminuir el número de stock en la interfaz
    const test = (selectedItem) => {
    const selectedId = selectedItem.id || selectedItem._id;

   
    fetch(`${API_URL}/inventario/reservar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        suministroId: selectedId,
        cantidad: 1 
       })
    })
    .then(res => res.json())
    .then(() => {
      cargarCatalogo();
      cargarCarga();
    })
    .catch(err => console.error("Error al guardar:", err));
  };


  return (
    <Container>
      <Navbar color="light" light expand="md">
        <Nav className="ms-auto" navbar> 
          <NavItem className="ml-auto">
            <h1>Carga de Suministros</h1>
          </NavItem>
          <NavItem className="ml-auto">
            <h5>Créditos disponibles: <Badge color="dark" pill> {creditos} Cr</Badge></h5>
          </NavItem>
          <NavItem className="ml-auto">
            <h5>Costo total de Carga: <Badge color="dark" pill> {costoTotal} Cr</Badge></h5>
          </NavItem>
        </Nav>
      </Navbar>
      
      <DynamicGrid 
        onAñadir={test}  
        items={Array.isArray(suministros) && suministros.length > 0 ? suministros : []} 
      />
      <ListGroup>
              {reservas.length === 0 ? (
                <ListGroupItem className="text-muted text-center">
                  La nave está vacía. Añade suministros.
                </ListGroupItem>
              ) : (
                reservas.map((item, index) => (
                  
                  <ListGroupItem key={item.id || index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{item.nombre}</strong>
                      <div className="text-muted small">Cant: {item.cantidad || 1}</div>
                    </div>
                    <Badge color="primary" pill>
                      {item.precio * (item.cantidad || 1)} Cr
                    </Badge>
                  </ListGroupItem>
                ))
              )}
            </ListGroup>
    </Container>
  );
}

export default App;
