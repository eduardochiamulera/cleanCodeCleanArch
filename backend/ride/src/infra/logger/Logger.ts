export default class Logger {
    private static instance: Logger;
    private level: string = "error";
    private levels: string[] = ["trace", "debug", "warn", "error", "fatal"];

    private constructor() {}

    debug(message: string, data: any){
        const levels = this.levels.slice(this.levels.indexOf(this.level));
        if(levels.includes("debug")){
            console.log("DEBUG", message, data);
        }
    }

    setLevel(level: string){
        this.level = level;
    }

    static getInstance(){
        if(!Logger.instance){
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }
}