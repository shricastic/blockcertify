"use client";

import {
  getBlockcertifyProgram,
  getBlockcertifyProgramId,
} from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

export interface CreateCertificateType {
  owner: PublicKey | null;
  recipient_id: string;
  recipient_name: string;
  program_name: string;
  institution_name: string;
  issued_date: string;
}

export interface UpdateCertificateType{
  owner: PublicKey | null;
  recipient_id: string;
  recipient_name: string;
  program_name: string;
  institution_name: string;
}

export function useBlockcertifyProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBlockcertifyProgramId(cluster.network as Cluster),
    [cluster],
  );
  const program = useMemo(
    () => getBlockcertifyProgram(provider, programId),
    [provider, programId],
  );

  const accounts = useQuery({
    queryKey: ["blockcertify", "all", { cluster }],
    queryFn: () => program.account.certificate.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createCertificate = useMutation<string, Error, CreateCertificateType>({
    mutationKey: ["blockcertify", "create-certificate", { cluster }],
    mutationFn: async ({
      recipient_id,
      recipient_name,
      program_name,
      institution_name,
      issued_date,
      owner,
    }) => {
      const [certificateAccountAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(recipient_id), owner.toBuffer()],
        programId,
      );

      return program.methods
        .createCertificate(
          recipient_id,
          recipient_name,
          program_name,
          institution_name,
          issued_date,
        )
        .accounts({ certificate: certificateAccountAddress })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      console.log("::::::::::Certificate Created::::::::", signature);
      return accounts.refetch();
    },
    onError: () => toast.error("Failed to initialize account"),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createCertificate,
  };
}

export function useBlockcertifyProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { programId, program, accounts } = useBlockcertifyProgram();

  const accountQuery = useQuery({
    queryKey: ["blockcertify", "fetch-certificate", { cluster, account }],
    queryFn: () => program.account.certificate.fetch(account),
  });

  const updateCertificate = useMutation<string, Error, UpdateCertificateType>({
    mutationKey: ["blockcertify", "update-certificate", { cluster, account }],
    mutationFn: async ({
      recipient_id,
      recipient_name,
      program_name,
      institution_name,
      owner,
    }) => {
      const [certificateAccountAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(recipient_id), owner.toBuffer()],
        programId,
      );

      return program.methods
        .updateCertificate(
          recipient_id,
          recipient_name,
          program_name,
          institution_name,
        )
        .accounts({ certificate: certificateAccountAddress })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      console.log("::::::Certificate Updated::::::", tx);
      return accounts.refetch();
    },
  });

  const revokeCertificate = useMutation({
    mutationKey: ["blockcertify", "revoke-certificate", { cluster, account }],
    mutationFn: async (recipient_id: string) =>
      program.methods
        .revokeCertificate(recipient_id)
        .accounts({ certificate: account })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      console.log("::::::Revoked Certificate::::::", tx);
      return accounts.refetch();
    },
    onError: () => toast.error("Failed to update account"),
  });

  return {
    accountQuery,
    updateCertificate,
    revokeCertificate,
  };
}
