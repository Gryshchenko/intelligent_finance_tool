const os = require('os');

const getLocalIP = (): string => {
    const intefaces = os.networkInterfaces();

    for (const name of Object.keys(intefaces)) {
        for (const iface of intefaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
};

export { getLocalIP };
