// Main type for the entire structure
export type NFTResponseType = {
  items: Item[];
  next_page_params: null;
};

// Type for each item in the items array
export type Item = {
  animation_url: null;
  external_app_url: null;
  id: string;
  image_url: string | null;
  is_unique: null;
  metadata: Metadata | null;
  owner: null;
  token: Token;
  token_type: string;
  value: string;
};

// Type for the metadata object
type Metadata = {
  description: string;
  image: string;
  name: string;
};

// Type for the token object
type Token = {
  address: string;
  circulating_market_cap: null;
  decimals: null;
  exchange_rate: null;
  holders: string;
  icon_url: null;
  name: string;
  symbol: string;
  total_supply: null;
  type: string;
  volume_24h: null;
};
