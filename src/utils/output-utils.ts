
var term = require( 'terminal-kit' ).terminal


export function colorizeJSON(obj, indent = 2, level = 0) {
    const spacing = ' '.repeat(level * indent);
    if (Array.isArray(obj)) {
        term(`[`);
        obj.forEach((item, i) => {
            term('\n' + spacing + ' '.repeat(indent));
            colorizeJSON(item, indent, level + 1);
            if (i < obj.length - 1) term(',');
        });
        term('\n' + spacing + `]`);
    } else if (typeof obj === 'object' && obj !== null) {
        term(`{`);
        const keys = Object.keys(obj);
        keys.forEach((key, i) => {
            term('\n' + spacing + ' '.repeat(indent));
            term.brightCyan(`"${key}"`);
            term(`: `);
            colorizeJSON(obj[key], indent, level + 1);
            if (i < keys.length - 1) term(',');
        });
        term('\n' + spacing + `}`);
    } else if (typeof obj === 'string') {
        term.brightGreen(`"${obj}"`);
    } else if (typeof obj === 'number') {
        term.yellow(obj.toString());
    } else if (typeof obj === 'boolean') {
        term.magenta(obj.toString());
    } else if (obj === null) {
        term.gray('null');
    }
}