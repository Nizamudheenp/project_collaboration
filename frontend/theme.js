export const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');

    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

export const loadTheme = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
