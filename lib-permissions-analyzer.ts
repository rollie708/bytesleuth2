import { Instruction, FunctionSelector } from './lib-analysis-engine'

export interface PermissionFinding {
  category: 'owner' | 'pause' | 'upgrade' | 'access_control' | 'privileged_transfer'
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  confidence: 'high' | 'medium' | 'low'
  evidence: {
    selectors?: string[]
    instructions?: number[]
  }
  limitations: string
}

const OWNER_PATTERNS = {
  owner: '0x8da5cb5b',
  transferOwnership: '0xf2fde38b',
  renounceOwnership: '0x715018a6',
  onlyOwner: '0x8da5cb5b',
}

const PAUSE_PATTERNS = {
  pause: '0x8456cb59',
  unpause: '0x3f4ba83a',
  paused: '0x5c975abb',
  whenNotPaused: '0x5c975abb',
}

const UPGRADE_PATTERNS = {
  upgradeTo: '0x3659cfe6',
  upgradeToAndCall: '0x4f1ef286',
  implementation: '0x5c60da1b',
}

export async function analyzePermissions(
  disassembly: Instruction[],
  functionSelectors: FunctionSelector[]
): Promise<PermissionFinding[]> {
  const findings: PermissionFinding[] = []

  // Check for ownership patterns
  const ownerFindings = detectOwnershipPatterns(functionSelectors)
  findings.push(...ownerFindings)

  // Check for pause mechanisms
  const pauseFindings = detectPausePatterns(functionSelectors)
  findings.push(...pauseFindings)

  // Check for upgrade mechanisms
  const upgradeFindings = detectUpgradePatterns(functionSelectors)
  findings.push(...upgradeFindings)

  // Check for DELEGATECALL usage
  const delegateFindings = detectDelegateCall(disassembly)
  findings.push(...delegateFindings)

  // Check for privileged transfer patterns
  const transferFindings = detectPrivilegedTransfers(disassembly, functionSelectors)
  findings.push(...transferFindings)

  return findings
}

function detectOwnershipPatterns(selectors: FunctionSelector[]): PermissionFinding[] {
  const findings: PermissionFinding[] = []
  const matchedSelectors: string[] = []

  for (const selector of selectors) {
    if (Object.values(OWNER_PATTERNS).includes(selector.selector.toLowerCase())) {
      matchedSelectors.push(selector.selector)
    }
  }

  if (matchedSelectors.length > 0) {
    findings.push({
      category: 'owner',
      title: 'Ownership Control Detected',
      description: `Contract implements ownership controls with ${matchedSelectors.length} ownership-related function(s). This allows a privileged address to perform administrative actions.`,
      severity: 'high',
      confidence: 'high',
      evidence: { selectors: matchedSelectors },
      limitations: 'Cannot verify exact access control logic without source code. Requires manual review of owner capabilities.',
    })
  }

  return findings
}

function detectPausePatterns(selectors: FunctionSelector[]): PermissionFinding[] {
  const findings: PermissionFinding[] = []
  const matchedSelectors: string[] = []

  for (const selector of selectors) {
    if (Object.values(PAUSE_PATTERNS).includes(selector.selector.toLowerCase())) {
      matchedSelectors.push(selector.selector)
    }
  }

  if (matchedSelectors.length > 0) {
    findings.push({
      category: 'pause',
      title: 'Pause Mechanism Detected',
      description: `Contract implements pause/unpause functionality with ${matchedSelectors.length} pause-related function(s). A privileged address can halt contract operations.`,
      severity: 'medium',
      confidence: 'high',
      evidence: { selectors: matchedSelectors },
      limitations: 'Cannot determine which functions are pausable or who can trigger pause. Requires source code review.',
    })
  }

  return findings
}

function detectUpgradePatterns(selectors: FunctionSelector[]): PermissionFinding[] {
  const findings: PermissionFinding[] = []
  const matchedSelectors: string[] = []

  for (const selector of selectors) {
    if (Object.values(UPGRADE_PATTERNS).includes(selector.selector.toLowerCase())) {
      matchedSelectors.push(selector.selector)
    }
  }

  if (matchedSelectors.length > 0) {
    findings.push({
      category: 'upgrade',
      title: 'Upgrade Mechanism Detected',
      description: `Contract appears to be upgradeable with ${matchedSelectors.length} upgrade-related function(s). Implementation can be changed by a privileged address.`,
      severity: 'critical',
      confidence: 'high',
      evidence: { selectors: matchedSelectors },
      limitations: 'Cannot verify upgrade authorization logic or implementation validity. Critical security review required.',
    })
  }

  return findings
}

function detectDelegateCall(disassembly: Instruction[]): PermissionFinding[] {
  const findings: PermissionFinding[] = []
  const delegateCallOffsets: number[] = []

  for (const inst of disassembly) {
    if (inst.mnemonic === 'DELEGATECALL') {
      delegateCallOffsets.push(inst.offset)
    }
  }

  if (delegateCallOffsets.length > 0) {
    findings.push({
      category: 'access_control',
      title: 'DELEGATECALL Usage Detected',
      description: `Contract uses DELEGATECALL at ${delegateCallOffsets.length} location(s). This allows execution of external code in the context of this contract, which can be dangerous if not properly protected.`,
      severity: 'critical',
      confidence: 'high',
      evidence: { instructions: delegateCallOffsets },
      limitations: 'Cannot verify DELEGATECALL target or access controls. Requires manual security audit.',
    })
  }

  return findings
}

function detectPrivilegedTransfers(
  disassembly: Instruction[],
  selectors: FunctionSelector[]
): PermissionFinding[] {
  const findings: PermissionFinding[] = []

  // Look for functions that might allow privileged withdrawals
  const suspiciousSelectors = selectors.filter(s => {
    const selector = s.selector.toLowerCase()
    return (
      selector.includes('withdraw') ||
      selector.includes('rescue') ||
      selector.includes('recover') ||
      selector.includes('sweep')
    )
  })

  if (suspiciousSelectors.length > 0) {
    findings.push({
      category: 'privileged_transfer',
      title: 'Privileged Transfer Functions Detected',
      description: `Contract contains ${suspiciousSelectors.length} function(s) that may allow privileged fund transfers or token recovery.`,
      severity: 'high',
      confidence: 'medium',
      evidence: { selectors: suspiciousSelectors.map(s => s.selector) },
      limitations: 'Function names are inferred from selectors. Cannot verify authorization requirements or transfer logic.',
    })
  }

  return findings
}
