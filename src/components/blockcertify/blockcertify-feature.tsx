'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useBlockcertifyProgram } from './blockcertify-data-access'
import { BlockcertifyCreate, BlockcertifyList } from './blockcertify-ui'

export default function BlockcertifyFeature() {
  const { publicKey } = useWallet()
  const { programId } = useBlockcertifyProgram()

  return publicKey ? (
    <div>
      <AppHero
        title="Blockcertify"
        subtitle={
          'Are you BlockCertified?'
        }
      >
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <BlockcertifyCreate />
      </AppHero>
      <BlockcertifyList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
