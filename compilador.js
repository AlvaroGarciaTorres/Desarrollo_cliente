var program_output_string =    
`INPUT
STORE 1111
INPUT
ADD 1111
OUTPUT
END`

const dict = {
    "0000": "END",
    "0001": "ADD",
    "0010": "SUBTRACT",
    "0011": "STORE",
    "0101": "LOAD",
    "0110": "BRANCH",
    "0111": "BRANCH_EQ_0",
    "1000": "BRANCH_GE_0",
    "1001": {
        "0001": "INPUT",
        "0010": "OUTPUT"
    }
}

class RAM{
    constructor(words, size){
        this.words = words;
        this.size = size;
        this.zeroes = Array(size).fill(0).join("");
        this.memory = Array(2**words).fill(this.zeroes); //valores almacenados en la memoria
    }

    read(dir){
        return this.memory[parseInt(dir, 2)]; //devuelve el contenido de la direccion de memoria que se le pase
    }

    write(dir, data){ //escribe un dato en la posicion de memoria que se le pase
        this.memory[parseInt(dir, 2)] = (this.zeroes + data).slice(-this.size); //formatea el dato a binario
        return this; //devuelve la memoria
    }
}

class CPU{ //Una CPU tiene un bus de direcciones que tiene el tamaño de las direcciones
           //y un bus de datos que tiene el tamaño de los datos. Necesitamos pasarle las dos cosas en el constructor
    constructor(words, size){ //tamaño de la arquitectura
        this.opSize = 4;
        this.size = size;
        this.words = words;
        this.pc = Array(words).fill(0).join("");//contador de programa
        this.cir = Array(size).fill(0).join("");//registro de instruccion
        this.ac = Array(size).fill(0).join(""); //acumulador
        this.ram = new RAM(words, size);
        this.zeroes = Array(size).fill(0).join("");
        this.io = new IO();
    }

    fetch(){ //carga en el registro de instruccion la siguiente instruccion a ejecutar
        this.cir = this.ram.read(this.pc) //lee el contador del programa
        this.pc = (this.zeroes + (parseInt(this.pc, 2) + 1).toString(2)).slice(-this.size); //aumenta el pc en 1
        return this;
    }

    execute(){ //ejecuta la instruccion cir tiene una parte que es el codigo de operacion (4 bits) y otra que es el operando (4 bits)
        const oc = this.cir.slice(0, this.opSize);
        const oper = this.cir.slice(this.opSize);
        console.log(oc, oper);
        switch (oc){
            case "0101": //LOAD
                this.ac = this.ram.read(oper);
                break;
            case "0001": //ADD
                var number = this.ram.read(oper);
                this.ac = (this.zeroes + (parseInt(this.ac, 2) + parseInt(number, 2)).toString(2)).slice(-this.size);
                break;
            case "0011": //STORE almacena en memoria lo que haya en el acumulador
                this.ram.write(oper, this.ac);
            case "0010": //SUBTRACT le quita al acumulador lo que haya en esa direccion (ac-direccion)
                var number = this.ram.read(oper);
                this.ac = (this.zeroes + (parseInt(this.ac, 2) - parseInt(number, 2)).toString(2)).slice(-this.size);
                break;
            case "0110": //BRANCH ALWAYS le pasas una instruccion y una direccion y pone el contador del programa en esa direccion)
                this.pc = this.ram.read(oper);
                break;
            case "0111": //BRANCH IF ACC = 0 si el acumulador es 0 pones el cp en esa direccion si no la mantienes igual
                if(this.ac === 0){
                    this.pc = this.ram.read(oper);
                }
                break;
            case "1000": //BRANCH IF ACC >= 0
                if(this.ac >= 0){
                    this.pc = this.ram.read(oper);
                }
                break;
            case "0000": //END
                this.cir = Array(8).fill(0).join("");
            case "1001": //INPUT/OUTPUT
                if(oper != "0010"){ 
                    this.ac = this.io.getInputs().toString(2); //Añadir input del array de inputs
                } else { 
                    this.io.getOutputs().push(parseInt(this.ac, 2)); //Añadir al array de outputs
                }
                break;
        }
        return this;
    }
}

class OS{ //sistema operativo
    constructor(words, size){
        this.cpu = new CPU(words, size);
        this.zeros = Array(8).fill(0).join("");
        this.oc = words;
    }

    compile(program_output_string){ //ensamblador -> hex
        const withoutOpers = ["END", "INPUT", "OUTPUT"];
        function getKeyByValue(object, value){
            return Object.keys(object).find(key => object[key] === value)
        }
        
        program_output_string = program_output_string.split("\n");
        
        function getAllOper(program_output_string){
            for(let i=0; i<program_output_string.length; i++){
                if(withoutOpers.includes(program_output_string[i])){
                    if(program_output_string[i] === "INPUT"){
                        program_output_string[i] += " 0001";
                    } else if (program_output_string[i] === "OUTPUT"){
                        program_output_string[i] += " 0010";
                    } else if (program_output_string[i] === "END") program_output_string[i] += " 0000";
                }   
            }
        }
        
        getAllOper(program_output_string);
        
        const instructions = program_output_string.map((x, i) => (
            {        
                oper: x.slice(-4),
                oc: x.slice(0, -5)
            } 
            ));
        
        const getBinaryOc = function(instructions){
            for(let i=0; i<instructions.length; i++){
                if(instructions[i].oc === "INPUT" || instructions[i].oc === "OUTPUT"){
                    instructions[i].oc = "1001";
                } else instructions[i].oc = getKeyByValue(dict, instructions[i].oc);
            }
        }
        
        getBinaryOc(instructions)
        
        var hex = instructions.map((x, i) =>(
                                instructions[i].oc + instructions[i].oper
                                ))
                                .map(x => parseInt(x, 2))
                                .map(x => x.toString(16)).join(" ");
        
        return hex;
    }

    decompile(hex){ //hex -> ensamblador
        const withoutOpers = ["END", "INPUT", "OUTPUT"];
        const ram = hex.split(" ")
        .map(x => parseInt(x, 16))
        .map(x => x.toString(2))
        .map(x => this.zeros + x)
        .map(x => x.slice(-8))
        .map((x, i) => (
            {
                oc: x.slice(0,this.oc),
                oper: x.slice(this.oc)
            }
        ));

        function decompileRam(ram){
            var output = "";

            for(let i=0; i<ram.length; i++){
                let {oc, oper} = ram[i];

                let nemonic = dict[oc];
                if(typeof nemonic === "object"){
                    nemonic = nemonic[oper];
                }

                if(withoutOpers.includes(nemonic)){
                    oper = "";
                } else {
                    oper = " " + oper;
                }
                output += `${nemonic}${oper}\n`;
            }
            return output;
        }
        return decompileRam(ram);
    }

    
    load(hex){ //carga en memoria el programa en binario (se lo pasan en hexadecimal)
        const ram = hex.split(" ")
        .map(x => parseInt(x, 16))
        .map(x => x.toString(2))
        .map(x => this.zeros + x)
        .map(x => x.slice(-8))

        for(var i = 0; i<this.cpu.ram.memory.length; i++){
            if(ram[i]){
                this.cpu.ram.memory[i] = ram[i];
            } else this.cpu.ram.memory[i] = Array(8).fill(0).join("");
            
        }
        return this.cpu.ram.memory;
    }
    
    executeProgram(){ //recorre las instrucciones cargadas en la memoria
        for(var i = 0; i<this.cpu.ram.memory.length; i++){
            if(i == 0){
                this.cpu.fetch().execute();
            } else {
                while(this.cpu.cir != Array(8).fill(0).join("")){
                    this.cpu.fetch().execute(); 
                }
            }  
        }           
        return this.cpu;
    }

    printOutputs(){
        return this.cpu.io.outputs;
    }
}

class IO{ //input/output 
    constructor(){
        this.inputsCounter = -1;
        this.inputs = [5, 5, 3];
        this.outputs = [];
    }

    getInputs(){ //devuelve el siguiente input
        this.inputsCounter += 1;
        return this.inputs[this.inputsCounter];
    }

    getOutputs(){ //recoge los output
        return this.outputs;
    }
}

input = 
`INPUT
STORE 1111
INPUT
SUBTRACT 1111
BRANCH_EQ_0 1111
OUTPUT
END`

var cpu = new CPU(4, 8);

var os = new OS(4,8);
console.log(os.load((os.compile(input))))
console.log(os.executeProgram())
console.log()
console.log(os.printOutputs())












/*os.decompile(hex);
os.compile(program_output_string)
os.load(hex);*/
/*console.log(cpu.ram.write("0000", "01011111") //LOAD
                   .write("0001", "00011110") //ADD                 
                   .write("1111", "00000011")
                   .write("1110", "00000010") //write devuelve a la memoria no a la cpu
                   .write("0010", "00111101") //STORE
                   .write("0011", "00101111") //SUBTRACT  
                   .write("0100", "01101110") //BRANCH  
                   .write("0101", "01111110") //BRANCH == 0
                   .write("0110", "10001111") //BRANCH >= 0         
                   ); 

console.log(cpu.fetch() 
               .execute()
               .fetch() //hay que hacer un fetch cada vez que se carga una nueva instruccion
               .execute()
               .fetch()
               .execute()
               .fetch()
               .execute()
               .fetch()
               .execute()
               .fetch()
               .execute()
               .fetch()
               .execute()
               );
*/

/*if(oc === "0101"){ //LOAD
            this.ac = this.ram.read(oper);
        } else if(oc === "0001"){ //ADD
            var number = this.ram.read(oper);
            this.ac = (this.zeroes + (parseInt(this.ac, 2) + parseInt(number, 2)).toString(2)).slice(-this.size);
        } else if(oc === "0011"){ //STORE almacena en memoria lo que haya en el acumulador
            this.ram.write(oper, this.ac);
        } else if(oc === "0010"){ //SUBTRACT le quita al acumulador lo que haya en esa direccion (ac-direccion)
            var number = this.ram.read(oper);
            this.ac = (this.zeroes + (parseInt(this.ac, 2) - parseInt(number, 2)).toString(2)).slice(-this.size);
        } else if(oc === "0110"){ //BRANCH ALWAYS le pasas una instruccion y una direccion y pone el contador del programa en esa direccion)
            this.pc = this.ram.read(oper);
        } else if(oc === "0111"){ //BRANCH IF ACC = 0 si el acumulador es 0 pones el cp en esa direccion si no la mantienes igual
            if(this.ac === 0){
                this.pc = this.ram.read(oper);
            }
        } else if(oc === "1000"){ //BRANCH IF ACC >= 0
            if(this.ac >= 0){
                this.pc = this.ram.read(oper);
            }
        } else if(oc === "0000"){ //END
            this.cir = "00000000";
        } else if(oc === "1001"){  
            if(oper != "0010"){//INPUT
                this.ac = this.io.getInputs().toString(2); //Añadir input del array de inputs
            } else {
                this.io.getOutputs().push(parseInt(this.ac, 2)); //OUTPUT Añadir a output array
            }
        }*/