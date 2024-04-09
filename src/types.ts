export type ValidatorStats = {
  rank: number;
  identity: string;
  vote_identity: string;
  last_vote: number;
  root_slot: number;
  credits: number;
  epoch_credits: number;
  activated_stake: number;
  version: string;
  delinquent: boolean;
  skip_rate: number;
  updated_at: string;
  first_epoch_with_stake: number;
  name: string;
  keybase: string;
  description: string;
  website: string;
  commission: number;
  image: string;
  ip_latitude: string;
  ip_longitude: string;
  ip_city: string;
  ip_country: string;
  ip_asn: string;
  ip_org: string;
  mod: boolean;
  is_jito: boolean;
  jito_commission_bps: number;
  vote_success: number;
  vote_success_score: number;
  wiz_skip_rate: number;
  skip_rate_score: number;
  info_score: number;
  commission_score: number;
  first_epoch_distance: number;
  epoch_distance_score: number;
  stake_weight: number;
  above_halt_line: boolean;
  stake_weight_score: number;
  withdraw_authority_score: number;
  asn: string;
  asn_concentration: number;
  asn_concentration_score: number;
  tpu_ip: string;
  tpu_ip_concentration: number;
  tpu_ip_concentration_score: number;
  uptime: number;
  uptime_score: number;
  wiz_score: number;
  version_valid: boolean;
  city_concentration: number;
  city_concentration_score: number;
  invalid_version_score: number;
  superminority_penalty: number;
  score_version: number;
  no_voting_override: boolean;
  epoch: number;
  epoch_slot_height: number;
  asncity_concentration: number;
  asncity_concentration_score: number;
  skip_rate_ignored: boolean;
  stake_ratio: number;
  credit_ratio: number;
  apy_estimate: number;
};

export interface ActivatingDelta {
  activating: Activating;
  deactivating: Deactivating;
}
interface Activating {
  amount: number;
  count: number;
  stake_accounts: StakeAccountsItem[];
}
interface StakeAccountsItem {
  pubkey: string;
  delegated_amount: string;
  activation_epoch: number;
  deactivation_epoch: number;
}
interface Deactivating {
  amount: number;
  count: number;
  stake_accounts: any[];
}

/*

{
    "activating": {
        "amount": 78.000000001,
        "count": 1,
        "stake_accounts": [
            {
                "pubkey": "ERjNEPeM8p4jutwL2PjUQJNn9bWmhNmn6ZBq5QiDBPRG",
                "delegated_amount": "78.000000001",
                "activation_epoch": 599,
                "deactivation_epoch": 0
            }
        ]
    },
    "deactivating": {
        "amount": 0,
        "count": 0,
        "stake_accounts": []
    }
}

*/
