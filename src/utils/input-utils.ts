import terminalKit from "terminal-kit";
const { terminal } = terminalKit

export function askInput(prompt: string, defaultValue: string|undefined = undefined): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        terminal(`${prompt} `);
        terminal.inputField({ cancelable: true, default: defaultValue }, (error, input) => {
            if (error) return reject(error);
            resolve(input);
        });
    });
}

export function askString(prompt: string, defaultValue: string|undefined = undefined): Promise<string> {
    return new Promise((resolve, reject) => {
        terminal(`${prompt} `);
        terminal.inputField({ cancelable: true, default: defaultValue }, (error, input) => {
            if (error || input == undefined) return reject(error);
            resolve(input);
        });
    });
}

export function askNumber(prompt: string, defaultValue: string|undefined = undefined): Promise<number> {
    return new Promise((resolve, reject) => {
        terminal(`${prompt} `);
        terminal.inputField({ cancelable: true, default: defaultValue }, (error, input) => {
            if (error) return reject(error);
            resolve(Number(input));
        });
    });
}