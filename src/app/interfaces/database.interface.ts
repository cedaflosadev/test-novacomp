export interface Database {
  config: Config[];
  tables: Table[];
}

export interface Config {
  name: string;
  type: string;
  provider: string;
  url?: string;
}

export interface Table {
  name: string;
  type: string;
  fields: Field[];
}

export interface Field {
  name: string;
  type: string;
  optional: boolean;
  restriction: string;
}
