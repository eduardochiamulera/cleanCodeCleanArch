export class Regestry{
    dependencies: {[name: string]: any};
    private static instance: Regestry;

    private constructor(){
        this.dependencies = {};
    }

    provide(name: string, dependency: any){
        this.dependencies[name] = dependency;
    }

    inject(name: string){
        return this.dependencies[name];
    }

    static getInstance(){
        if(!Regestry.instance){
            this.instance = new Regestry();
        }

        return Regestry.instance;
    }
}

//decorator
export function inject(name: string){
    return function(target: any, propertyKey:string){
        target[propertyKey] = new Proxy({},{
            get(target: any, propertyKey: string){
                const dependency = Regestry.getInstance().inject(name);
                console.log("DECORATOR", dependency);
                return dependency[propertyKey];
            }
        });
    }
}