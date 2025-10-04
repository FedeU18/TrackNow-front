import { useState } from 'react';

export const useMenus = () => {
    const [menus, setMenus] = useState({
        estado: false,
        categoria: false,
        repartidor: false,
        fecha: false,
        dia: false,
        mes: false,
        año: false
    });

    const setMenuVisible = (menuName, visible) => {
        setMenus(prev => ({ 
            ...prev, 
            [menuName]: visible 
        }));
    };

    const toggleMenu = (menuName) => {
        setMenus(prev => ({ 
            ...prev, 
            [menuName]: !prev[menuName] 
        }));
    };

    const closeAllMenus = () => {
        setMenus({
            estado: false,
            categoria: false,
            repartidor: false,
            fecha: false,
            dia: false,
            mes: false,
            año: false
        });
    };

    return {
        menus,
        setMenuVisible,
        toggleMenu,
        closeAllMenus
    };
};