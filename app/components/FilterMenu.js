import React from 'react';
import { Menu, Button } from 'react-native-paper';

const FilterMenu = ({ 
    visible, 
    setVisible, 
    value, 
    options, 
    onSelect, 
    placeholder,
    style,
    icon = "chevron-down",
    compact = false
}) => {
    return (
        <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
                <Button 
                    mode="outlined" 
                    onPress={() => setVisible(!visible)}
                    style={style}
                    icon={icon}
                    compact={compact}
                >
                    {value === "todos" ? placeholder : value}
                </Button>
            }>
            {options.map(option => (
                <Menu.Item 
                    key={option.value}
                    onPress={() => { 
                        onSelect(option.value); 
                        setVisible(false);
                    }} 
                    title={option.label} 
                />
            ))}
        </Menu>
    );
};

export default FilterMenu;