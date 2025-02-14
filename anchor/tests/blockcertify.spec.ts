import * as anchor from '@coral-xyz/anchor'
import {Keypair, PublicKey, SystemProgram} from '@solana/web3.js'
import {Blockcertify} from '../target/types/blockcertify'
import { web3, Program } from '@coral-xyz/anchor'

describe('blockcertify', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Blockcertify as Program<Blockcertify>

  //recipient_id: String, recipient_name: String, program_name: String, institution_name: String, issued_date: String
  const recipient_id = "2122010111";
  const recipient_name = "Bhupendra Jogi";
  const program_name = "Diploma in AI Engineering";
  const institution_name = "Whatsapp University, India";
  const issued_date = "12/12/2025";

  const orgPublicKey = new web3.PublicKey("EpEV9oKB6fNXquh8h8Rb4Vx7kWmpakZCW9e1EU68An4d");

  let CertPDA: PublicKey;
  
  let CertificateAccountNew: {
    certificate: PublicKey;
    owner: PublicKey;
    systemProgram: PublicKey;
  }

  beforeEach( async () => {
    [CertPDA] = await PublicKey.findProgramAddress(
      [Buffer.from(recipient_id), payer.publicKey.toBuffer()],
      program.programId
    )

    CertificateAccountNew = {
      certificate: CertPDA,
      owner: payer.publicKey,
      systemProgram: SystemProgram.programId
    }
  })

  //::::::::::::::::::: Create A Certificate ::::::::::::::::::::
  it("Create a certificate", async() => {
    await program.methods
    .createCertificate(recipient_id, recipient_name, program_name, institution_name, issued_date)
    .accounts(CertificateAccountNew)
    .rpc()

    const CertificateAccount = await program.account.certificate.fetch(CertPDA);

    console.log("::::::::::::::: Created A Certificate :::::::::::::")
    console.log(CertificateAccount);

    expect(CertificateAccount.recipientId).toEqual(recipient_id);
    expect(CertificateAccount.recipientName).toEqual(recipient_name);
    expect(CertificateAccount.programName).toEqual(program_name);
    expect(CertificateAccount.institutionName).toEqual(institution_name);
    expect(CertificateAccount.issuedDate).toEqual(issued_date);
  })

  //::::::::::::::::::: Retrieve A Certificate ::::::::::::::::::::
  it("Retrieve a certificate", async() => {

    const [certPDA] = await web3.PublicKey.findProgramAddress(
      [Buffer.from(recipient_id), orgPublicKey.toBuffer()],
      program.programId
    )

    const CreatedCertificate = await program.account.certificate.fetch(certPDA);

    console.log("::::::::::::::: Retrieve A Certificate :::::::::::::")
    console.log(CreatedCertificate);


    expect(CreatedCertificate.recipientId).toEqual(recipient_id);
    expect(CreatedCertificate.recipientName).toEqual(recipient_name);
    expect(CreatedCertificate.programName).toEqual(program_name);
    expect(CreatedCertificate.institutionName).toEqual(institution_name);
    expect(CreatedCertificate.issuedDate).toEqual(issued_date);
  })

  //::::::::::::::::::: Update A Certificate ::::::::::::::::::::
  it("Update a certificate", async() => {
    const recipient_name_new = "Bhupendra Jogi USA"; 

    await program.methods
    .updateCertificate(recipient_id, recipient_name_new, program_name, institution_name)
    .accounts(CertificateAccountNew)
    .rpc()

    const CertificateAccount = await program.account.certificate.fetch(CertPDA);

    console.log("::::::::::::::: Updated A Certificate :::::::::::::")
    console.log(CertificateAccount);

    expect(CertificateAccount.recipientId).toEqual(recipient_id);
    expect(CertificateAccount.recipientName).toEqual(recipient_name_new);
    expect(CertificateAccount.programName).toEqual(program_name);
    expect(CertificateAccount.institutionName).toEqual(institution_name);
    expect(CertificateAccount.issuedDate).toEqual(issued_date);
  })

  //:::::::::::::::::: Delete A Certificate ::::::::::::::::::::::
  it("Revoke a certificate", async() => {
    await program.methods.revokeCertificate(recipient_id).accounts(CertificateAccountNew).rpc() 
    
    const CertificateAccount = await program.account.certificate.fetchNullable(CertPDA); 

    console.log(":::::::::::: Revoked A Certificate ::::::::::::")
    console.log(CertificateAccount)

    expect(CertificateAccount).toBeNull()
  })

})
