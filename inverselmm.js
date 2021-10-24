const data = 8;
const addresses = 4;
const oc = 4;

var program_output =    
`INPUT
STORE 1111
INPUT
ADD 1111
OUTPUT` 

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

const withoutOpers = ["END", "INPUT", "OUTPUT"]

const zeros = Array(data).fill(0).join("");
const zeros_addresses = Array(addresses).fill(0).join("");


function getKeyByValue(object, value){
    return Object.keys(object).find(key => object[key] === value)
}

program_output = program_output.split("\n");
console.log(program_output)

function getAllOper(program_output){
    for(let i=0; i<program_output.length; i++){
        if(withoutOpers.includes(program_output[i])){
            if(program_output[i] === "INPUT"){
                program_output[i] += " 0001";
            } else if (program_output[i] === "OUTPUT"){
                program_output[i] += " 0010";
            } else if (program_output[i] === "END") program_output[i] += " 0000";
        }   
    }
}

getAllOper(program_output);

const instructions = program_output.map((x, i) => (
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
        console.log(instructions[i]);
    }
}

getBinaryOc(instructions)

ram = instructions.map((x, i) =>(
                        instructions[i].oc + instructions[i].oper
                        ))
                        .map(x => parseInt(x, 2))
                        .map(x => x.toString(16)).join(" ");


console.log();
console.log(ram);