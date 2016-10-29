'use strict';

const INSTRUCTIONS = {
  MOV: 1, // moves value of second operand into memory address of first operand
  ADD: 2, // adds first and second operand and stores result in register x
  CMP: 3, // compares value in register a against value in operand
  JL: 4,
  SYS: 0xff, // system call. only valid value is 3 which prints out the value in register a to the screen
};

// this represents our ram that our program can write to and read from
const memory = [];

const registers = {
  a: 0,
  b: 0,
  c: 0,
};

// this is a simple assembly program to assemble
const program = [
  'loop:          ; define a label to jump to later',
  '  mov @a, 0    ; set a zero in register a',
  '  add 1        ; add 1 to value in register a',
  '  cmp 10       ; compare value in register a against 10',
  '  jl loop      ; if comparison was less than 10 then jump to label loop',
].join('\n');


// let's say our program starts at memory address 0 for simplicity
// so label "loop" will have a value of 0
const jumpTable = {
  label: 0,
};

const MOV_TYPE = {
  REGISTER: 0xC, // move destination is a register
  ADDRESS: 0xA,  // move destination is a direct memory address
};

// this is hand-assembled data to execute in our emulator
const data = [
  1,   // MOV instruction
  MOV_TYPE.REGISTER, // MOV instruction destination is a register
  97,  // MOV destination is register a
  0,   // MOV source value is zero
  2,   // ADD instruction
  1,   // ADD operand value is a one
  3,   // CMP instruction
  10,  // CMP operand value is ten
  4,   // JL instruction
  jumpTable.label, // JL jump destination address
  0xff, // SYS instruction
  3,    // print register a value to screen
];

// ity bity emulator
let ip = 0;
while (ip < data.length) {
  const instruction = data[ip];
  // console.log(`INSTRUCTION: ${instruction}`);
  if (instruction === INSTRUCTIONS.MOV) {
    ip += 1;
    const moveType = data[ip];
    if (moveType === MOV_TYPE.REGISTER) {
      ip += 1;
      const register = data[ip];
      ip += 1;
      const src = data[ip];
      ip += 1;
      registers[register] = src;
      console.log(`MOV @${String.fromCharCode(register)}, ${src}`);
    } else if (moveType === MOV_TYPE.ADDRESS) {
      ip += 1;
      const address = data[ip];
      ip += 1;
      const src = data[ip];
      ip += 1;
      memory[address] = src;
      console.log(`MOV ${address}, ${src}`);
    }
  } else if (instruction === INSTRUCTIONS.ADD) {
    ip += 1;
    const operand = data[ip];
    registers.a += operand;
    ip += 1;
    console.log(`ADD ${operand}`);
  } else if (instruction === INSTRUCTIONS.CMP) {
    ip += 1;
    const value = data[ip];
    ip += 1;
    console.log(`CMP ${value}`);
    if (registers.a < value) {
      registers.c = -1;
    } else if (registers.a > value) {
      registers.c = 1;
    } else {
      registers.c = 0;
    }
  } else if (instruction === INSTRUCTIONS.JL) {
    ip += 1;
    const address = data[ip];
    ip += 1;
    console.log(`JL ${address}`);
    if (registers.c < 0) {
      ip = address;
    }
  } else if (instruction === INSTRUCTIONS.SYS) {
    ip += 1;
    const call = data[ip];
    ip += 1;
    console.log(`SYS ${call}`);
    if (call === 3) {
      console.log(`register a has value: ${registers.a}`);
    }
  }
}
