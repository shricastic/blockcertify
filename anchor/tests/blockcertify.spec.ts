import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Blockcertify} from '../target/types/blockcertify'

describe('blockcertify', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Blockcertify as Program<Blockcertify>

  const blockcertifyKeypair = Keypair.generate()

  it('Initialize Blockcertify', async () => {
    await program.methods
      .initialize()
      .accounts({
        blockcertify: blockcertifyKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([blockcertifyKeypair])
      .rpc()

    const currentCount = await program.account.blockcertify.fetch(blockcertifyKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Blockcertify', async () => {
    await program.methods.increment().accounts({ blockcertify: blockcertifyKeypair.publicKey }).rpc()

    const currentCount = await program.account.blockcertify.fetch(blockcertifyKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Blockcertify Again', async () => {
    await program.methods.increment().accounts({ blockcertify: blockcertifyKeypair.publicKey }).rpc()

    const currentCount = await program.account.blockcertify.fetch(blockcertifyKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Blockcertify', async () => {
    await program.methods.decrement().accounts({ blockcertify: blockcertifyKeypair.publicKey }).rpc()

    const currentCount = await program.account.blockcertify.fetch(blockcertifyKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set blockcertify value', async () => {
    await program.methods.set(42).accounts({ blockcertify: blockcertifyKeypair.publicKey }).rpc()

    const currentCount = await program.account.blockcertify.fetch(blockcertifyKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the blockcertify account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        blockcertify: blockcertifyKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.blockcertify.fetchNullable(blockcertifyKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
