var term = require( 'terminal-kit' ).terminal

export function askInput(prompt: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        term(`${prompt} `);
        term.inputField({ cancelable: true }, (error, input) => {
            if (error) return reject(error);
            resolve(input);
        });
    });
}

export function askString(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        term(`${prompt} `);
        term.inputField({ cancelable: true }, (error, input) => {
            if (error) return reject(error);
            resolve(input);
        });
    });
}

export function askNumber(prompt: string): Promise<number> {
    return new Promise((resolve, reject) => {
        term(`${prompt} `);
        term.inputField({ cancelable: true }, (error, input) => {
            if (error) return reject(error);
            resolve(Number(input));
        });
    });
}