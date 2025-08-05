import { describe, it, expect, beforeEach } from "vitest"

type NodeData = {
  nodeType: string
  metadataUri: string
  registeredAt: number
  lastUpdated: number
}

const mockContract = {
  admin: "ST1ADMIN...",
  registry: new Map<string, NodeData>(),
  blockHeight: 1000,
  stakeMap: new Map<string, bigint>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  getStake(principal: string): bigint {
    return this.stakeMap.get(principal) || 0n
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },

  registerNode(caller: string, type: string, uri: string) {
    if (this.registry.has(caller)) return { error: 101 }
    if (!["relay", "rpc", "indexer"].includes(type)) return { error: 104 }
    if (this.getStake(caller) <= 0n) return { error: 103 }

    this.registry.set(caller, {
      nodeType: type,
      metadataUri: uri,
      registeredAt: this.blockHeight,
      lastUpdated: this.blockHeight,
    })
    return { value: true }
  },

  updateMetadata(caller: string, newUri: string) {
    const node = this.registry.get(caller)
    if (!node) return { error: 102 }

    node.metadataUri = newUri
    node.lastUpdated = this.blockHeight
    return { value: true }
  },

  deregisterNode(caller: string) {
    if (!this.registry.has(caller)) return { error: 102 }
    this.registry.delete(caller)
    return { value: true }
  },

  getNode(owner: string) {
    const node = this.registry.get(owner)
    return node ? { value: node } : { error: 102 }
  },
}

describe("Relay Registry Contract", () => {
  const user = "ST2NODE..."
  const uri = "https://node.example.com/meta"
  const altUri = "https://node.example.com/alt-meta"

  beforeEach(() => {
    mockContract.registry.clear()
    mockContract.admin = "ST1ADMIN..."
    mockContract.blockHeight = 1000
    mockContract.stakeMap.set(user, 1000n)
  })

  it("allows admin transfer", () => {
    const result = mockContract.transferAdmin("ST1ADMIN...", "ST1NEW...")
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe("ST1NEW...")
  })

  it("registers a new node", () => {
    const result = mockContract.registerNode(user, "relay", uri)
    expect(result).toEqual({ value: true })

    const node = mockContract.getNode(user)
    expect(node.value?.nodeType).toBe("relay")
    expect(node.value?.metadataUri).toBe(uri)
  })

  it("prevents duplicate registration", () => {
    mockContract.registerNode(user, "rpc", uri)
    const result = mockContract.registerNode(user, "rpc", uri)
    expect(result).toEqual({ error: 101 })
  })

  it("prevents registration without stake", () => {
    mockContract.stakeMap.set(user, 0n)
    const result = mockContract.registerNode(user, "indexer", uri)
    expect(result).toEqual({ error: 103 })
  })

  it("updates metadata URI", () => {
    mockContract.registerNode(user, "rpc", uri)
    const result = mockContract.updateMetadata(user, altUri)
    expect(result).toEqual({ value: true })
    expect(mockContract.registry.get(user)?.metadataUri).toBe(altUri)
  })

  it("deregisters a node", () => {
    mockContract.registerNode(user, "relay", uri)
    const result = mockContract.deregisterNode(user)
    expect(result).toEqual({ value: true })
    expect(mockContract.registry.has(user)).toBe(false)
  })

  it("rejects metadata update if not registered", () => {
    const result = mockContract.updateMetadata(user, uri)
    expect(result).toEqual({ error: 102 })
  })
})
