export const toastOptions = {
    className: 'custom-toast',
    duratio: 4000,
    style: {
        marginTop: '20px',
        background: '#ffffff',
        color: '#1e293b',
        padding: '16px 24px',
        borderRadius: '20px',
        fontSize: '16px',
        fontWeight: '600',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        maxWidth: '500px',
    },
    success: {
        iconTheme: { primary: '#10b981', secondary: '#fff' },
    },
    error: {
        iconTheme: { primary: '#ef4444', secondary: '#fff' },
    },
};

export default toastOptions;