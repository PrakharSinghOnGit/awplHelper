type DataItem = {
    id: string;
    name: string;
    level: string;
    sao: number;
    sgo: number;
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

  type Data = {
    level: DataItem[];
    target: DataItem[];
    cheque: DataItem[];
  };
  


  export type { DataItem, DataType, data , Data };