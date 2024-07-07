type DataItem = {
    id: string;
    name: string;
    level: string;
    pass?: string;
    sao?: number;
    sgo?: number;
    data?: any;
  };
  

  type DataType = {
    level: DataItem[];
    target: DataItem[];
    cheque: DataItem[];
  };
  
  interface data {
    id: string;
    pass: string;
    name: string;
  }

  export type { DataItem, DataType, data };