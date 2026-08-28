import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Login from './components/login';
import Header from './components/header';
import Patentes from './components/patentes';
import DetallePatente from './components/detallePatente';
import ClientesPatentes from './components/clientesPatentes';
import './styles/global.css';
import './styles/login.css';
import './styles/header.css';
import './styles/patentes.css';
import './styles/detallePatente.css';
import './styles/clientesPatentes.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarSesion = () => {
      try {
        const usuario = localStorage.getItem('usuario');
        const userRol = localStorage.getItem('rol');
        const tiempoSesion = localStorage.getItem('tiempoSesion');
        
        if (tiempoSesion) {
          const tiempoActual = Date.now();
          const tiempoExpiracion = parseInt(tiempoSesion);
          const horasTranscurridas = (tiempoActual - tiempoExpiracion) / (1000 * 60 * 60);
          
          if (horasTranscurridas >= 12) {
            localStorage.removeItem('usuario');
            localStorage.removeItem('rol');
            localStorage.removeItem('userId');
            localStorage.removeItem('tiempoSesion');
            setIsAuthenticated(false);
            setRol(null);
          } else if (usuario) {
            setIsAuthenticated(true);
            setRol(userRol);
          }
        } else if (usuario) {
          localStorage.setItem('tiempoSesion', Date.now().toString());
          setIsAuthenticated(true);
          setRol(userRol);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error verificando sesión:', error);
        setLoading(false);
      }
    };
    
    verificarSesion();
  }, []);

  const handleLogin = (status) => {
    if (status) {
      localStorage.setItem('tiempoSesion', Date.now().toString());
      setIsAuthenticated(true);
      setRol(localStorage.getItem('rol'));
      navigate('/patentes');
    } else {
      setIsAuthenticated(false);
      setRol(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    localStorage.removeItem('tiempoSesion');
    setIsAuthenticated(false);
    setRol(null);
    navigate('/login');
  };

  // ==========================================
  // Ruta protegida (requiere autenticación)
  // ==========================================
  const RutaProtegida = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // ==========================================
  // Layout (Header + contenido)
  // ==========================================
  const Layout = ({ children }) => (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          Cargando sesión...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ========================================== */}
      {/* RUTAS PÚBLICAS (NO requieren login) */}
      {/* ========================================== */}
      <Route path="/clientes-patentes" element={<ClientesPatentes />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
      {/* Redirección raíz */}
      <Route path="/" element={<Navigate to="/patentes" replace />} />

      {/* ========================================== */}
      {/* RUTAS PROTEGIDAS (requieren autenticación) */}
      {/* ========================================== */}
      <Route path="/patentes" element={
        <RutaProtegida>
          <Layout>
            <Patentes />
          </Layout>
        </RutaProtegida>
      } />

      <Route path="/patentes/:patente" element={
        <RutaProtegida>
          <Layout>
            <DetallePatenteWrapper />
          </Layout>
        </RutaProtegida>
      } />

      {/* 404 - Página no encontrada */}
      <Route path="*" element={<Navigate to="/patentes" replace />} />
    </Routes>
  );
}

// ==========================================
// Wrapper para DetallePatente
// ==========================================
function DetallePatenteWrapper() {
  const { patente } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clientes/${patente}`);
        if (response.data.success && response.data.data) {
          setCliente(response.data.data);
        } else {
          setError('No se encontró el cliente');
        }
      } catch (err) {
        console.error('Error al cargar cliente:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    if (patente) {
      cargarCliente();
    }
  }, [patente]);

  const handleVolver = () => {
    navigate('/patentes');
  };

  const handleEliminar = () => {
    navigate('/patentes');
  };

  const handleActualizar = () => {
    const recargarCliente = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clientes/${patente}`);
        if (response.data.success && response.data.data) {
          setCliente(response.data.data);
        }
      } catch (err) {
        console.error('Error al recargar cliente:', err);
      }
    };
    recargarCliente();
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
        Cargando...
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ff6b6b' }}>
        {error || 'Cliente no encontrado'}
      </div>
    );
  }

  return (
    <DetallePatente 
      patente={cliente}
      onVolver={handleVolver}
      onEliminar={handleEliminar}
      onActualizar={handleActualizar}
    />
  );
}

export default App;