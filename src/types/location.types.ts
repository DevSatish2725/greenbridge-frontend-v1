export interface ManualLocation {
  stateId: string;
  stateName: string;

  districtId?: string;
  districtName?: string;

  villageId?: string;
  villageName?: string;
}

export interface StateOption {
  _id: string;
  name: string;
}

export interface DistrictOption {
  _id: string;
  name: string;
}

export interface VillageOption {
  _id: string;
  name: string;
}

export type SearchLocation =
  | {
      mode: "CURRENT";
      latitude: number;
      longitude: number;
    }
  | {
      mode: "MANUAL";
      state: string;
      district?: string;
      village?: string;
    };
