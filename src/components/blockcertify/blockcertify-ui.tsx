"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import {
  CreateCertificateType,
  UpdateCertificateType,
  useBlockcertifyProgram,
  useBlockcertifyProgramAccount,
} from "./blockcertify-data-access";
import { useWallet } from "@solana/wallet-adapter-react";

export function BlockcertifyCreate() {
  const { createCertificate } = useBlockcertifyProgram();
  const { publicKey } = useWallet();
  const [recipientId, setRecipientId] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [programName, setProgramName] = useState<string>("");
  const [institutionName, setInstitutionName] = useState<string>("");
  const [issuedDate, setIssuedDate] = useState<string>("");

  const isFormValid =
    recipientName.trim() != "" &&
    recipientName.trim() != "" &&
    programName.trim() != "" &&
    issuedDate.trim() != "" &&
    publicKey != null;

  let certificate: CreateCertificateType = {
    recipient_id: recipientId,
    recipient_name: recipientName,
    program_name: programName,
    institution_name: institutionName,
    issued_date: issuedDate,
    owner: publicKey,
  };

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createCertificate.mutateAsync(certificate);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient Name"
        value={recipientName}
        className="p-2 m-2 text-center"
        onChange={(e) => setRecipientName(e.target.value)}
      ></input>{" "}
      <br />
      <input
        type="text"
        placeholder="Recipient Id"
        value={recipientId}
        className="p-2 m-2 text-center"
        onChange={(e) => setRecipientId(e.target.value)}
      ></input>{" "}
      <br />
      <input
        type="text"
        placeholder="Program Name"
        value={programName}
        className="p-2 m-2 text-center"
        onChange={(e) => setProgramName(e.target.value)}
      ></input>{" "}
      <br />
      <input
        type="text"
        placeholder="institution Name"
        value={institutionName}
        className="p-2 m-2 text-center"
        onChange={(e) => setInstitutionName(e.target.value)}
      ></input>{" "}
      <br />
      <input
        type="text"
        placeholder="Issued Date"
        value={issuedDate}
        className="p-2 m-2 text-center"
        onChange={(e) => setIssuedDate(e.target.value)}
      ></input>{" "}
      <br />
      <button
        className="btn btn-xs lg:btn-md btn-primary mt-2"
        onClick={handleSubmit}
        disabled={createCertificate.isPending}
      >
        create certificate {createCertificate.isPending && "..."}
      </button>
    </div>
  );
}

export function BlockcertifyList() {
  const { accounts, getProgramAccount } = useBlockcertifyProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account: any) => (
            <BlockcertifyCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function BlockcertifyCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateCertificate, revokeCertificate } =
    useBlockcertifyProgramAccount({
      account,
    });

  const {publicKey} = useWallet();

  const [recipientId, setRecipientId] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [programName, setProgramName] = useState<string>("");
  const [institutionName, setInstitutionName] = useState<string>("");

  const isFormValid =
    recipientName.trim() != "" &&
    programName.trim() != "" &&
    institutionName.trim() != '' &&
    publicKey != null;

  let certificate: UpdateCertificateType= {
    recipient_id: accountQuery.data?.recipientId || "",
    recipient_name: accountQuery.data?.recipientName || "",
    program_name: accountQuery.data?.programName || "",
    institution_name: accountQuery.data?.institutionName || "",
    owner: publicKey,
  };

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      updateCertificate.mutateAsync(certificate);
    }
  };

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            {accountQuery.data?.recipientName}
          </h2>
          <p>{accountQuery.data?.programName}</p>
          <div className="card-actions justify-around">
            <textarea
              placeholder="Update message here"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={handleSubmit}
              disabled={updateCertificate.isPending}
            >
              Update Entry {updateCertificate.isPending && "..."}
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    "Are you sure you want to close this account?",
                  )
                ) {
                  return;
                }
                const recipientId = accountQuery.data?.recipientId;
                if (recipientId) {
                  return revokeCertificate.mutateAsync(recipientId);
                }
              }}
              disabled={revokeCertificate.isPending}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
