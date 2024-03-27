export interface Delivery {
  created_date: string;
  delivery_date: string;
  delivery_timestamp: string;
  destination: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  package_weight: number;
  recipient: { phone_no: string; recipeint_name: string };
  sender_id: string;
  shipping_id: string;
  shipping_status: string;
  special_handling_instruction: string;
  warehouse: string;
  package_dimension: {
    S: string;
    L: string;
    M: string;
    Pallet: string;
  };
}

export interface Order {
  sender_id: string;
  order_id: string;
  warehouse: string;
  destination: string;
  package_dimension: {
    S: string;
    L: string;
    M: string;
    Pallet: string;
  };
  package_weight: number;
  special_handling_instruction: string;
  latitude: number;
  longitude: number;
  recipient: { phone_no: string; recipeint_name: string };
  created_date: string;
  delivery_date: string;
  delivery_timestamp: string;
}

// {
//   "sender_id": "19a44c3a-fc8d-40bb-a041-c739d75ba813",
//   "warehouse": "313@Somerset, 313 Orchard Road, Singapore 238895",
//   "destination": "15 Beach Road, Singapore 189670",
//   "package_dimension": {
//       "S": "2",
//       "L": "1",
//       "M": "3",
//       "Pallet": "0"
//   },
//   "package_weight": 10,
//   "special_handling_instruction": "Special Instruction 6",
//   "latitude": 1.3122508,
//   "longitude": 103.6971501,
//   "recipient": {
//       "recipeint_name": "Tan Ah Kao",
//       "phone_no": "88888888"
//   },
//   "created_date": "2024-03-26T18:04:55.795079",
//   "delivery_date": "2024-03-22T04:41:17.004Z",
//   "delivery_timestamp": null,
//   "order_id": "2187fb00-c0c4-4c4d-b64c-36c683738c18"
// }

export interface Driver {
  name: string;
  user_id: string;
}
