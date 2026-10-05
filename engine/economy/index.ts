/** Money is stored as whole naira (integers) to avoid floating-point drift. */
export interface Wallet {
  cash: number
  bank: number
}

/** Price table supplied by a university data pack: itemId -> naira. */
export type PriceTable = Record<string, number>

export function createWallet(initial: Partial<Wallet> = {}): Wallet {
  return {
    cash: Math.max(0, Math.floor(initial.cash ?? 0)),
    bank: Math.max(0, Math.floor(initial.bank ?? 0)),
  }
}

export function canAfford(wallet: Wallet, amount: number): boolean {
  return wallet.cash >= amount
}

export function spendCash(wallet: Wallet, amount: number): Wallet | null {
  const cost = Math.floor(amount)
  if (cost < 0 || !canAfford(wallet, cost)) return null
  return { ...wallet, cash: wallet.cash - cost }
}

export function earnCash(wallet: Wallet, amount: number): Wallet {
  return { ...wallet, cash: wallet.cash + Math.max(0, Math.floor(amount)) }
}

export function getPrice(prices: PriceTable, itemId: string, fallback: number): number {
  return prices[itemId] ?? fallback
}
