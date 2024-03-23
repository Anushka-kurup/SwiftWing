export interface Delivery {
  created_date: string;
  delivery_date: string;
  delivery_timestamp: string;
  destination: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  package_dimensions: [number, number, number];
  package_weight: number;
  recipient: { phone_no: { S: string }; recipeint_name: { S: string } };
  sender_id: string;
  shipping_id: string;
  shipping_status: string;
  special_handling_instructions: string;
  warehouse: string;
}

export interface Driver {
  name: string;
  user_id: string;
}
