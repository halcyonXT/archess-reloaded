import React, { createContext, useEffect } from 'react';

const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = React.useState("light");
    const [bgStyles, setBgStyles] = React.useState({});

    const toggleThemeWrapper = (choice) => {
        const changeRootVariable = (prop, val) => document.documentElement.style.setProperty(prop, val);

        if (choice === theme) return;

        if (choice === "light") {
            changeRootVariable("--main", "#ffffff");
            changeRootVariable("--inv", "#000000");

            setTheme("light")
        } else {
            changeRootVariable("--main", "#000000");
            changeRootVariable("--inv", "#ffffff");

            setTheme("dark")
        }
    }

    React.useEffect(() => {
        const changeRootVariable = (prop, val) => document.documentElement.style.setProperty(prop, val);

        if (theme === "light") {
            changeRootVariable("--main", "#ffffff");
            changeRootVariable("--inv", "#000000");
        } else {
            changeRootVariable("--main", "#000000");
            changeRootVariable("--inv", "#ffffff");
        }
    }, [])

    const background = {
        styles: bgStyles,
        setStyles: (obj) => setBgStyles(obj),
        clearStyles: () => setBgStyles({})
    }

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            setTheme: toggleThemeWrapper,
            background: {
                ...background
            }}}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContextProvider, ThemeContext }