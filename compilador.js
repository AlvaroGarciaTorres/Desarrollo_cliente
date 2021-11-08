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
        this.memory = Array(2**words).fill(this.zeroes); //values stored in the memory
    }

    read(dir){ //reads the content of the memory's direction provided
        return this.memory[parseInt(dir, 2)]; 
    }

    write(dir, data){ //writes a data into the memory's direction provided
        this.memory[parseInt(dir, 2)] = (this.zeroes + data).slice(-this.size); //to binary
        return this;
    }

}

class CPU{ //Una CPU tiene un bus de direcciones que tiene el tamaño de las direcciones
           //y un bus de datos que tiene el tamaño de los datos. Necesitamos pasarle las dos cosas en el constructor
    constructor(words, size){ //architecture's size
        this.opSize = 4;
        this.size = size;
        this.words = words;
        this.pc = Array(words).fill(0).join("");//program counter
        this.cir = Array(size).fill(0).join("");//current instruction register
        this.ac = Array(size).fill(0).join(""); //accumulator
        this.ram = new RAM(words, size);
        this.zeroes = Array(size).fill(0).join("");
        this.io = new IO();
    }

    fetch(){ //loads into the cir the next instruction to execute
        this.cir = this.ram.read(this.pc) //reads the pc
        this.pc = (this.zeroes + (parseInt(this.pc, 2) + 1).toString(2)).slice(-this.size); //increases pc by 1
        return this;
    }

    execute(){ //executes the instruction in the cir (4 bits for the operator and 4 bits for the operation code)
        const oc = this.cir.slice(0, this.opSize);
        const oper = this.cir.slice(this.opSize);
        /*console.log("..............");
        console.log(oc, oper);
        console.log("Counter: ", parseInt(this.pc, 2));
        console.log("Acumulador: ", parseInt(this.ac, 2));*/
        switch (oc){
            case "0101": //LOAD
                //console.log("LOAD");
                this.ac = this.ram.read(oper);
                break;
            case "0001": //ADD
                var number = this.ram.read(oper);
                //console.log("ADD ", parseInt(number, 2));
                this.ac = this.io.toComplementA2(this.io.fromComplementA2(this.ac, 2) + this.io.fromComplementA2(number, 2));
                break;
            case "0011": //STORE
                //console.log("STORE");
                this.ram.write(oper, this.ac);
                break;
            case "0010": //SUBTRACT
                var number = this.ram.read(oper);
                this.ac = this.io.toComplementA2((this.io.fromComplementA2(this.ac, 2)) - (this.io.fromComplementA2(number, 2)));
                break;
            case "0110": //BRANCH ALWAYS
                //console.log("BRANCH");  
                this.pc = (this.zeroes + oper).slice(-this.size);
                break;
            case "0111": //BRANCH IF ACC = 0 
                //console.log("BRANCH=0");
            if(this.ac === "00000000"){
                    this.pc = (this.zeroes + oper).slice(-this.size);
                }
                break;
            case "1000": //BRANCH IF ACC >= 0
                //console.log("BRANCH>0");
                this.ac = this.io.toComplementA2(this.ac);
                if(this.ac >= 0){
                    this.pc = (this.zeroes + oper).slice(-this.size);
                }
                break;
            case "0000": //END
                //console.log("END");
                this.cir = Array(8).fill(0).join("");
                break;
            case "1001": //INPUT/OUTPUT
                if(oper != "0010"){
                    //console.log("INPUT"); 
                    this.ac = this.io.toComplementA2(this.io.getInputs());
                } else {
                    //console.log("OUTPUT");
                    this.io.getOutputs().push(this.io.fromComplementA2(this.ac));
                }
                break;
        }
        //console.log("Acumulador: ", this.ac);
        return this;
    }
}

class OS{ //operating system
    constructor(words, size){
        this.cpu = new CPU(words, size);
        this.zeroes = Array(8).fill(0).join("");
        this.oc = words;
        this.timer;
    }

    /*setTimer(){
        this.timer = setInterval(function(){
            console.log("<<<<");
        });
    }

    stopTimer(){
        setTimeout(function(){
            clearInterval(this.timer);
        },4000)
    }*/

    compile(program_output_string){ //assembler -> hex
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

    decompile(hex){ //hex -> assembler
        const withoutOpers = ["END", "INPUT", "OUTPUT"];
        const ram = hex.split(" ")
        .map(x => parseInt(x, 16))
        .map(x => x.toString(2))
        .map(x => this.zeroes + x)
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

    
    load(hex){ //hex -> binary loads program in the memory
        const ram = hex.split(" ")
        .map(x => parseInt(x, 16))
        .map(x => x.toString(2))
        .map(x => this.zeroes + x)
        .map(x => x.slice(-8))

        for(var i = 0; i<this.cpu.ram.memory.length; i++){
            if(ram[i]){
                this.cpu.ram.memory[i] = ram[i];
            } else this.cpu.ram.memory[i] = Array(8).fill(0).join("");
            
        }
        return this.cpu.ram.memory;
    }
    
    executeProgram(){ //executes the instructions loaded in the memory
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
        this.inputs = [-1, 3, -4, 0];
        this.outputs = [];
        this.zeroes = Array(8).fill(0).join("");
        this.size = 8;
    }

    getInputs(){ //provides inputs
        this.inputsCounter += 1;
        return this.inputs[this.inputsCounter];
    }

    getOutputs(){ //recovers outputs
        return this.outputs;
    }

    toComplementA2(number){ //number -> string in C2
        if(number < 0){
            number = number.toString(2).slice(1);
            number = (this.zeroes + number).slice(-this.size);
            number = number.split("");
            for(var i = 0; i<number.length; i++){
                if(number[i] == "0"){
                    number[i] = "1";
                } else number[i] = "0";
            }
            number = number.join("");
            number = (parseInt(number, 2) + 1).toString(2);
            return number;
        } else {
            number = number.toString(2);
            number = (this.zeroes + number).slice(-this.size);
            return number;
        }
    }

    fromComplementA2(string){ //string -> number in C1
        if(string.startsWith("1")){
            string = (parseInt(string, 2) - 1).toString(2).split("");
            for(var i = 0; i<string.length; i++){
                if(string[i] == "0"){
                    string[i] = "1";
                } else string[i] = "0";
            }
            string = parseInt("-" + string.join(""), 2);
            return string;
        } else {
            string = parseInt(string, 2);
            return string;
        }
    }
}

input = 
`INPUT
STORE 1111
INPUT
ADD 1111
OUTPUT
END`

inputClase =
`INPUT
BRANCH_EQ_0 0101
ADD 1111
STORE 1111
BRANCH 0000
LOAD 1111
OUTPUT
END`

input2 = 
`LOAD 1111
BRACH_EQ_0 1001
LOAD 1110
ADD 1100
STORE 1100
LOAD 1111
SUBTRACT 1101
STORE 1111
BRACH 0000
LOAD 1100
OUTPUT
END`

var cpu = new CPU(4, 8);

var os = new OS(4,8);
os.load((os.compile(inputClase)))
console.log(os.executeProgram())
console.log("Outputs: ", os.printOutputs())




/*
os.cpu.io.toComplementA2(-1);

os.cpu.io.fromComplementA2("11111111");
*/








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