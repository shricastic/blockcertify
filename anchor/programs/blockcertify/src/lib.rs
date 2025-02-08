#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("2SrixAo9MU6axFWbkekKvPF2h6pgQSCPUdEmwpM6uYia");

#[program]
pub mod blockcertify {
    use super::*;

    pub fn create_certificate(
        ctx: Context<CreateCertificate>, 
        recipient_id: String, 
        recipient_name: String, 
        program_name: String, 
        institution_name: String, 
        issued_date: String
    ) -> Result<()> {
        let certificate = &mut ctx.accounts.certificate;
        certificate.owner = ctx.accounts.owner.key();
        certificate.recipient_id = recipient_id;
        certificate.recipient_name = recipient_name;
        certificate.program_name = program_name;
        certificate.institution_name = institution_name;
        certificate.issued_date = issued_date;

        Ok(())
    }

    pub fn update_certificate(
        ctx: Context<UpdateCertificate>,  
        _recipient_id: String, 
        recipient_name: String, 
        program_name: String, 
        institution_name: String
    ) -> Result<()> {
        let certificate = &mut ctx.accounts.certificate;
        certificate.recipient_name = recipient_name;
        certificate.program_name = program_name;
        certificate.institution_name = institution_name;

        Ok(())
    }

    pub fn revoke_certificate(
        _ctx: Context<RevokeCertificate>, 
        _recipient_id: String
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(recipient_id: String, recipient_name: String, program_name: String, institution_name: String, issued_date: String)]
pub struct CreateCertificate<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Certificate::INIT_SPACE,
        seeds = [recipient_id.as_bytes(), owner.key().as_ref()],
        bump
    )]
    pub certificate: Account<'info, Certificate>,

    #[account(mut)]
    pub owner: Signer<'info>, 

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(recipient_id: String, recipient_name: String, program_name: String, institution_name: String)]
pub struct UpdateCertificate<'info> {
    #[account(
        mut,
        seeds = [recipient_id.as_bytes(), owner.key().as_ref()],
        bump
    )]
    pub certificate: Account<'info, Certificate>,

    #[account(mut)]
    pub owner: Signer<'info>, 

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(recipient_id: String)]
pub struct RevokeCertificate<'info> {
    #[account(
        mut,
        seeds = [recipient_id.as_bytes(), owner.key().as_ref()],
        close = owner,
        bump
    )]
    pub certificate: Account<'info, Certificate>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct Certificate{
    pub owner: Pubkey,

    #[max_len(15)]
    pub recipient_id: String,

    #[max_len(25)]
    pub recipient_name: String,
    
    #[max_len(50)]
    pub program_name: String,

    #[max_len(50)]
    pub institution_name: String,

    #[max_len(10)]
    pub issued_date: String
}
