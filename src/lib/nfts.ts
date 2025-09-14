
export interface PlaceholderNft {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  aiHint: string;
  collection: string;
  rarity: string;
  purchaseUrl: string;
}

const CRYPTO_COM_BASE_URL = "https://crypto.com/nft/collection/";
const MOCK_COLLECTION_SLUG = "alliance-forge-founders-edition-01a2b3c4d5";

export const placeholderNfts: PlaceholderNft[] = [
  {
    id: "AF-001",
    name: "Aegis Class Frigate",
    description: "A nimble escort vessel, the Aegis is the first line of defense for any major fleet operation. Its speed is its greatest asset.",
    imageUrl: "https://i.imgur.com/bB4B1xW.jpeg",
    aiHint: "small fast spaceship",
    collection: "Founder's Edition",
    rarity: "Uncommon",
    purchaseUrl: `${CRYPTO_COM_BASE_URL}${MOCK_COLLECTION_SLUG}`,
  },
  {
    id: "AF-002",
    name: "Javelin Class Destroyer",
    description: "Engineered for aggressive planetary assaults and breaking enemy lines. A symbol of the Alliance's might.",
    imageUrl: "https://i.imgur.com/KzYJzT4.jpeg",
    aiHint: "medium attack spaceship",
    collection: "Founder's Edition",
    rarity: "Rare",
    purchaseUrl: `${CRYPTO_COM_BASE_URL}${MOCK_COLLECTION_SLUG}`,
  },
  {
    id: "AF-003",
    name: "Leviathan Class Carrier",
    description: "The heart of the fleet. A mobile command center and drone deployment platform, capable of sustaining long-term operations.",
    imageUrl: "https://i.imgur.com/dK3fA3D.jpeg",
    aiHint: "large carrier spaceship",
    collection: "Founder's Edition",
    rarity: "Epic",
    purchaseUrl: `${CRYPTO_COM_BASE_URL}${MOCK_COLLECTION_SLUG}`,
  },
  {
    id: "AF-004",
    name: "Star-Forge Ark",
    description: "The pinnacle of human engineering. A colossal vessel designed to carry the last of humanity to a new home among the stars.",
    imageUrl: "https://i.imgur.com/L4mUaT8.jpeg",
    aiHint: "massive colony spaceship",
    collection: "Founder's Edition",
    rarity: "Legendary",
    purchaseUrl: `${CRYPTO_COM_BASE_URL}${MOCK_COLLECTION_SLUG}`,
  },
];
