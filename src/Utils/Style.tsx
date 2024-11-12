const colors = {
    primary: '#36a0c8',
    secondary: '#e3f2fd',
    lightgray: 'lightgray',
    secondaryBackground: '#dae4e8',
};

const listItemStyle = {
    '&.Mui-selected': { backgroundColor: colors.secondary },
    textAlign: 'center',
    ':focus': { outline: 'none' },
};

const buttonStyle = {
    backgroundColor: colors.primary,
    ':focus': { outline: 'none' },
};

const boxStyle = {
    mt: 5,
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
};

const tab = {
    color: colors.primary,
    fontWeight: 'bold',
};



export { listItemStyle, buttonStyle, boxStyle, colors, tab };