export default class APIError extends Error {ç
    public code: number
    constructor(message:string, code: number){
        super(message)
        this.code = code
    }
}