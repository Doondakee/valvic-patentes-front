import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoValvic from '../assets/valvic.png';
import { FaSignOutAlt, FaChevronDown, FaBoxes, FaExternalLinkAlt } from 'react-icons/fa';

function Header({ onLogout }) {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const usuario = localStorage.getItem('usuario') || 'Usuario';
    const rol = localStorage.getItem('rol') || 'empleado';

    const handleNavigate = (ruta) => {
        navigate(ruta);
    };

    return (
        <header className="header-valvic">
            <div className="header-valvic-content">
                <div className="header-valvic-left">
                    <div className="header-valvic-brand">
                        <img src={logoValvic} alt="Valvic" className="header-valvic-logo"/>
                        <div className="header-valvic-brand-text">
                            <h1 className="header-valvic-title">Gomería Valvic</h1>
                            <span className="header-valvic-subtitle">
                                <FaBoxes className="header-subtitle-icon" /> Gestión de Patentes
                            </span>
                        </div>
                    </div>
                </div>

                <div className="header-valvic-user">
                    <div className="header-valvic-user-info" onClick={() => setShowMenu(!showMenu)}>
                        <div className="user-avatar-valvic">
                            <span>{usuario.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="user-details-valvic">
                            <span className="user-name-valvic">{usuario}</span>
                            <span className="user-role-valvic">{rol}</span>
                        </div>
                        <FaChevronDown className={`user-dropdown-icon ${showMenu ? 'rotated' : ''}`} />
                    </div>
            
                    {showMenu && (
                        <div className="header-valvic-dropdown">
                            <div className="dropdown-user-info">
                                <div className="dropdown-avatar">
                                    <span>{usuario.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <div className="dropdown-user-name">{usuario}</div>
                                    <div className="dropdown-user-role">{rol}</div>
                                </div>
                            </div>
                            <div className="dropdown-divider"></div>
                            
                            {/* ✅ NUEVO: Enlace a la versión pública */}
                            <button 
                                className="dropdown-item" 
                                onClick={() => { 
                                    setShowMenu(false); 
                                    handleNavigate('/clientes-patentes');
                                }}
                            >
                                <FaExternalLinkAlt className="dropdown-icon" />
                                Patentes de Clientes
                            </button>
                            
                            <div className="dropdown-divider"></div>
                            
                            <button className="dropdown-item logout-item" onClick={() => { setShowMenu(false); onLogout(); }}>
                                <FaSignOutAlt className="dropdown-icon" />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;