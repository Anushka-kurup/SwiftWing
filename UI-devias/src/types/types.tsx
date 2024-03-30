export interface Delivery {
  created_date: string;
  delivery_date: string;
  delivery_timestamp: string;
  destination: string;
  driver_id?: string;
  latitude: number;
  longitude: number;
  package_weight: number;
  recipient: { phone_no: string; recipeint_name: string };
  sender_id: string;
  shipping_id?: string;
  shipping_status?: 'Awaiting Assignment' | 'In_Progress' | 'Delivered' | 'Failed' | 'On_Hold';
  special_handling_instruction: string;
  warehouse: string;
  package_dimension: {
    S: string;
    L: string;
    M: string;
    Pallet: string;
  };
}

export interface Driver {
  name: string;
  user_id: string;
}
