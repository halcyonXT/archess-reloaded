import React, { createContext, useEffect } from 'react';

const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = React.useState((() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const stored = localStorage.getItem("ARC_THEME");
        
        if (!stored || !["dark", "light"].includes(stored)) {
            return prefersDark ? "dark" : "light";
        } else return stored;
    })());

    const [bgStyles, setBgStyles] = React.useState({});

    const toggleThemeWrapper = (choice) => {
        const changeRootVariable = (prop, val) => document.documentElement.style.setProperty(prop, val);

        if (choice === theme) return;

        if (choice === "light") {
            changeRootVariable("--main", "#ffffff");
            changeRootVariable("--inv", "#000000");

            setTheme("light")
            localStorage.setItem("ARC_THEME", "light");
        } else {
            changeRootVariable("--main", "#000000");
            changeRootVariable("--inv", "#ffffff");

            setTheme("dark")
            localStorage.setItem("ARC_THEME", "dark");
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