'use client'

import { getBlockcertifyProgram, getBlockcertifyProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useBlockcertifyProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getBlockcertifyProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getBlockcertifyProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['blockcertify', 'all', { cluster }],
    queryFn: () => program.account.blockcertify.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['blockcertify', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ blockcertify: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useBlockcertifyProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useBlockcertifyProgram()

  const accountQuery = useQuery({
    queryKey: ['blockcertify', 'fetch', { cluster, account }],
    queryFn: () => program.account.blockcertify.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['blockcertify', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ blockcertify: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['blockcertify', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ blockcertify: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['blockcertify', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ blockcertify: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['blockcertify', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ blockcertify: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
