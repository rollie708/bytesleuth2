export interface Instruction {
  offset: number
  opcode: number
  mnemonic: string
  operand?: string
  gas: number
}

export interface FunctionSelector {
  selector: string
  offset: number
  confidence: 'high' | 'medium' | 'low'
}

export interface ExternalCall {
  type: 'CALL' | 'DELEGATECALL' | 'STATICCALL' | 'CALLCODE'
  offset: number
}

export interface StorageAccess {
  type: 'SLOAD' | 'SSTORE'
  offset: number
  slot?: string
}

export interface ControlFlow {
  jumps: Array<{ from: number; to?: number }>
  branches: Array<{ offset: number; condition: string }>
}

export interface AnalysisResult {
  disassembly: Instruction[]
  functionSelectors: FunctionSelector[]
  externalCalls: ExternalCall[]
  storageAccesses: StorageAccess[]
  controlFlow: ControlFlow
}

const OPCODES: Record<number, { mnemonic: string; gas: number }> = {
  0x00: { mnemonic: 'STOP', gas: 0 },
  0x01: { mnemonic: 'ADD', gas: 3 },
  0x02: { mnemonic: 'MUL', gas: 5 },
  0x03: { mnemonic: 'SUB', gas: 3 },
  0x04: { mnemonic: 'DIV', gas: 5 },
  0x05: { mnemonic: 'SDIV', gas: 5 },
  0x06: { mnemonic: 'MOD', gas: 5 },
  0x10: { mnemonic: 'LT', gas: 3 },
  0x14: { mnemonic: 'EQ', gas: 3 },
  0x15: { mnemonic: 'ISZERO', gas: 3 },
  0x16: { mnemonic: 'AND', gas: 3 },
  0x17: { mnemonic: 'OR', gas: 3 },
  0x18: { mnemonic: 'XOR', gas: 3 },
  0x19: { mnemonic: 'NOT', gas: 3 },
  0x35: { mnemonic: 'CALLDATALOAD', gas: 3 },
  0x36: { mnemonic: 'CALLDATASIZE', gas: 2 },
  0x50: { mnemonic: 'POP', gas: 2 },
  0x51: { mnemonic: 'MLOAD', gas: 3 },
  0x52: { mnemonic: 'MSTORE', gas: 3 },
  0x53: { mnemonic: 'MSTORE8', gas: 3 },
  0x54: { mnemonic: 'SLOAD', gas: 800 },
  0x55: { mnemonic: 'SSTORE', gas: 20000 },
  0x56: { mnemonic: 'JUMP', gas: 8 },
  0x57: { mnemonic: 'JUMPI', gas: 10 },
  0x58: { mnemonic: 'PC', gas: 2 },
  0x59: { mnemonic: 'MSIZE', gas: 2 },
  0x5a: { mnemonic: 'GAS', gas: 2 },
  0x5b: { mnemonic: 'JUMPDEST', gas: 1 },
  0x60: { mnemonic: 'PUSH1', gas: 3 },
  0x61: { mnemonic: 'PUSH2', gas: 3 },
  0x62: { mnemonic: 'PUSH3', gas: 3 },
  0x63: { mnemonic: 'PUSH4', gas: 3 },
  0x64: { mnemonic: 'PUSH5', gas: 3 },
  0x80: { mnemonic: 'DUP1', gas: 3 },
  0x81: { mnemonic: 'DUP2', gas: 3 },
  0x82: { mnemonic: 'DUP3', gas: 3 },
  0x90: { mnemonic: 'SWAP1', gas: 3 },
  0x91: { mnemonic: 'SWAP2', gas: 3 },
  0xf0: { mnemonic: 'CREATE', gas: 32000 },
  0xf1: { mnemonic: 'CALL', gas: 700 },
  0xf2: { mnemonic: 'CALLCODE', gas: 700 },
  0xf3: { mnemonic: 'RETURN', gas: 0 },
  0xf4: { mnemonic: 'DELEGATECALL', gas: 700 },
  0xfa: { mnemonic: 'STATICCALL', gas: 700 },
  0xfd: { mnemonic: 'REVERT', gas: 0 },
  0xff: { mnemonic: 'SELFDESTRUCT', gas: 5000 },
}

export async function analyzeBytecode(bytecode: string): Promise<AnalysisResult> {
  const disassembly = disassemble(bytecode)
  const functionSelectors = extractFunctionSelectors(disassembly)
  const externalCalls = findExternalCalls(disassembly)
  const storageAccesses = findStorageAccesses(disassembly)
  const controlFlow = analyzeControlFlow(disassembly)

  return {
    disassembly,
    functionSelectors,
    externalCalls,
    storageAccesses,
    controlFlow,
  }
}

function disassemble(bytecode: string): Instruction[] {
  const instructions: Instruction[] = []
  const bytes = hexToBytes(bytecode)

  let i = 0
  while (i < bytes.length) {
    const opcode = bytes[i]
    const opcodeInfo = OPCODES[opcode] || { mnemonic: `UNKNOWN_${opcode.toString(16)}`, gas: 0 }

    const instruction: Instruction = {
      offset: i,
      opcode,
      mnemonic: opcodeInfo.mnemonic,
      gas: opcodeInfo.gas,
    }

    // Handle PUSH opcodes
    if (opcode >= 0x60 && opcode <= 0x7f) {
      const pushSize = opcode - 0x5f
      const operandBytes = bytes.slice(i + 1, i + 1 + pushSize)
      instruction.operand = '0x' + operandBytes.map(b => b.toString(16).padStart(2, '0')).join('')
      i += pushSize + 1
    } else {
      i++
    }

    instructions.push(instruction)
  }

  return instructions
}

function extractFunctionSelectors(instructions: Instruction[]): FunctionSelector[] {
  const selectors: FunctionSelector[] = []

  for (let i = 0; i < instructions.length - 3; i++) {
    const inst = instructions[i]
    
    // Look for PUSH4 followed by EQ pattern (function selector check)
    if (inst.mnemonic === 'PUSH4' && inst.operand) {
      const next = instructions[i + 1]
      const next2 = instructions[i + 2]
      
      if (next?.mnemonic === 'EQ' || next2?.mnemonic === 'EQ') {
        selectors.push({
          selector: inst.operand,
          offset: inst.offset,
          confidence: 'high',
        })
      }
    }
  }

  return selectors
}

function findExternalCalls(instructions: Instruction[]): ExternalCall[] {
  const calls: ExternalCall[] = []

  for (const inst of instructions) {
    if (inst.mnemonic === 'CALL') {
      calls.push({ type: 'CALL', offset: inst.offset })
    } else if (inst.mnemonic === 'DELEGATECALL') {
      calls.push({ type: 'DELEGATECALL', offset: inst.offset })
    } else if (inst.mnemonic === 'STATICCALL') {
      calls.push({ type: 'STATICCALL', offset: inst.offset })
    } else if (inst.mnemonic === 'CALLCODE') {
      calls.push({ type: 'CALLCODE', offset: inst.offset })
    }
  }

  return calls
}

function findStorageAccesses(instructions: Instruction[]): StorageAccess[] {
  const accesses: StorageAccess[] = []

  for (const inst of instructions) {
    if (inst.mnemonic === 'SLOAD') {
      accesses.push({ type: 'SLOAD', offset: inst.offset })
    } else if (inst.mnemonic === 'SSTORE') {
      accesses.push({ type: 'SSTORE', offset: inst.offset })
    }
  }

  return accesses
}

function analyzeControlFlow(instructions: Instruction[]): ControlFlow {
  const jumps: Array<{ from: number; to?: number }> = []
  const branches: Array<{ offset: number; condition: string }> = []

  for (let i = 0; i < instructions.length; i++) {
    const inst = instructions[i]

    if (inst.mnemonic === 'JUMP') {
      jumps.push({ from: inst.offset })
    } else if (inst.mnemonic === 'JUMPI') {
      branches.push({ offset: inst.offset, condition: 'conditional' })
      jumps.push({ from: inst.offset })
    }
  }

  return { jumps, branches }
}

function hexToBytes(hex: string): number[] {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
  const bytes: number[] = []
  
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes.push(parseInt(cleanHex.slice(i, i + 2), 16))
  }
  
  return bytes
}
