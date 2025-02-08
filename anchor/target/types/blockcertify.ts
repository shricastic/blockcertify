/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/blockcertify.json`.
 */
export type Blockcertify = {
  "address": "2SrixAo9MU6axFWbkekKvPF2h6pgQSCPUdEmwpM6uYia",
  "metadata": {
    "name": "blockcertify",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with <3 by shri"
  },
  "instructions": [
    {
      "name": "createCertificate",
      "discriminator": [
        238,
        189,
        143,
        29,
        100,
        80,
        70,
        10
      ],
      "accounts": [
        {
          "name": "certificate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "recipientId"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "recipientId",
          "type": "string"
        },
        {
          "name": "recipientName",
          "type": "string"
        },
        {
          "name": "programName",
          "type": "string"
        },
        {
          "name": "institutionName",
          "type": "string"
        },
        {
          "name": "issuedDate",
          "type": "string"
        }
      ]
    },
    {
      "name": "revokeCertificate",
      "discriminator": [
        236,
        5,
        130,
        119,
        9,
        164,
        130,
        122
      ],
      "accounts": [
        {
          "name": "certificate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "recipientId"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "recipientId",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateCertificate",
      "discriminator": [
        235,
        236,
        67,
        125,
        170,
        84,
        113,
        218
      ],
      "accounts": [
        {
          "name": "certificate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "recipientId"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "recipientId",
          "type": "string"
        },
        {
          "name": "recipientName",
          "type": "string"
        },
        {
          "name": "programName",
          "type": "string"
        },
        {
          "name": "institutionName",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "certificate",
      "discriminator": [
        202,
        229,
        222,
        220,
        116,
        20,
        74,
        67
      ]
    }
  ],
  "types": [
    {
      "name": "certificate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "recipientId",
            "type": "string"
          },
          {
            "name": "recipientName",
            "type": "string"
          },
          {
            "name": "programName",
            "type": "string"
          },
          {
            "name": "institutionName",
            "type": "string"
          },
          {
            "name": "issuedDate",
            "type": "string"
          }
        ]
      }
    }
  ]
};
