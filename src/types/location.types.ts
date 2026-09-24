export interface ManualLocation {
  stateId: string;
  stateName: string;

  districtId?: string;
  districtName?: string;

  villageId?: string;
  villageName?: string;
}

export interface StateOption {
  id: string;
  name: string;
}

export interface DistrictOption {
  id: string;
  name: string;
}

export interface VillageOption {
  id: string;
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
