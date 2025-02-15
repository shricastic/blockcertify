// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import BlockcertifyIDL from '../target/idl/blockcertify.json'
import type { Blockcertify } from '../target/types/blockcertify'

// Re-export the generated IDL and type
export { Blockcertify, BlockcertifyIDL }

// The programId is imported from the program IDL.
export const BLOCKCERTIFY_PROGRAM_ID = new PublicKey(BlockcertifyIDL.address)

// This is a helper function to get the Blockcertify Anchor program.
export function getBlockcertifyProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...BlockcertifyIDL, address: address ? address.toBase58() : BlockcertifyIDL.address } as Blockcertify, provider)
}

// This is a helper function to get the program ID for the Blockcertify program depending on the cluster.
export function getBlockcertifyProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Blockcertify program on devnet and testnet.
      return new PublicKey('2SrixAo9MU6axFWbkekKvPF2h6pgQSCPUdEmwpM6uYia')
    case 'mainnet-beta':
    default:
      return BLOCKCERTIFY_PROGRAM_ID
  }
}
