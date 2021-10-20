const binary = "91 3f 91 1f 92 00 00 00 00 00 00 00 00 00 00 00";
const data = 8;
const addresses = 4;
const oc = 4;

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

const memory = Array(2**addresses).fill(0)
        .map((_,i) => i)
        .map(x => x.toString(2))
        .map(x => zeros_addresses + x)
        .map(x => x.slice(-addresses))
        ;

const ram = binary.split(" ")
        .map(x => parseInt(x, 16))
        .map(x => x.toString(2))
        .map(x => zeros + x)
        .map(x => x.slice(-data))
        .map((x, i) => (
            {
                address: memory[i],
                oc: x.slice(0,oc),
                oper: x.slice(oc)
            }
        ))
        ;

function printRAM(ram){
    console.log("RAM");
    console.log("Address\t\tValue");
    ram.forEach(({address, oc, oper}) => console.log(`${address} \t\t${oc}${oper}`));
}

printRAM(ram);

function decompile(ram){
    console.log("SOURCE");
    console.log("Address\t\tInstruction");

    for(let i=0; i<ram.length; i++){
        let {address, oc, oper} = ram[i];

        let nemonic = dict[oc];
        if(typeof nemonic === "object"){
            nemonic = nemonic[oper];
        }

        if(withoutOpers.includes(nemonic)){
            oper = "";
        } else {
            oper = " " + oper;
        }
        console.log(`${address} \t\t${nemonic}${oper}`);
    }
}
console.log();
decompile(ram);