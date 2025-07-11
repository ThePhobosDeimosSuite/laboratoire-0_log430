import terminalKit from "terminal-kit";
const { terminal } = terminalKit


export function colorizeJSON(obj, indent = 2, level = 0) {
    const spacing = ' '.repeat(level * indent);
    if (Array.isArray(obj)) {
        terminal(`[`);
        obj.forEach((item, i) => {
            terminal('\n' + spacing + ' '.repeat(indent));
            colorizeJSON(item, indent, level + 1);
            if (i < obj.length - 1) terminal(',');
        });
        terminal('\n' + spacing + `]`);
    } else if (typeof obj === 'object' && obj !== null) {
        terminal(`{`);
        const keys = Object.keys(obj);
        keys.forEach((key, i) => {
            terminal('\n' + spacing + ' '.repeat(indent));
            terminal.brightCyan(`"${key}"`);
            terminal(`: `);
            colorizeJSON(obj[key], indent, level + 1);
            if (i < keys.length - 1) terminal(',');
        });
        terminal('\n' + spacing + `}`);
    } else if (typeof obj === 'string') {
        terminal.brightGreen(`"${obj}"`);
    } else if (typeof obj === 'number') {
        terminal.yellow(obj.toString());
    } else if (typeof obj === 'boolean') {
        terminal.magenta(obj.toString());
    } else if (obj === null) {
        terminal.gray('null');
    }
}