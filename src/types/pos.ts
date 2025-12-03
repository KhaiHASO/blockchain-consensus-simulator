export type ValidatorStatus = 'active' | 'slashed';

export type Validator = {
  id: string;
  name: string;
  avatar: string;
  stake: number;
  effectiveStake: number;
  status: ValidatorStatus;
  rewards: number;
  probability: number;
};

export type PosSlotSelection = {
  epoch: number;
  slot: number;
  validatorId: string;
  validatorName: string;
  reward: number;
  timestamp: string;
};

export type SlashingEvent = {
  id: string;
  validatorId: string;
  validatorName: string;
  epoch: number;
  slot: number;
  burnedAmount: number;
  remainingStake: number;
  timestamp: string;
};


