import { SUPPORT_CHAIN_IDS } from "./enums";

export const ATOKEN_ADDRESS: { [key: number]: string } = {
  [SUPPORT_CHAIN_IDS.MUMBAI]: "0x53A4C2f5f3105eEa5db142618D9c9186c81436E3",
  [SUPPORT_CHAIN_IDS.BINANCE]: "0xb5e94535C70264DAd3e9dEeEC91765792AAe408F",
  [SUPPORT_CHAIN_IDS.AVALANCHE]: "0xA5516E15a0B618237D5C77AaF67008324971eF42",
};

export const BTOKEN_ADDRESS: { [key: number]: string } = {
  [SUPPORT_CHAIN_IDS.MUMBAI]: "0xa5262597eC048E640544ea550834F3F958CbF38E",
  [SUPPORT_CHAIN_IDS.BINANCE]: "0x6ddFf89EcC27208582be68b3f91e0B1AF6686A59",
  [SUPPORT_CHAIN_IDS.AVALANCHE]: "0x169b32fC08B5F765BC444B5e8c16eCCDC77A8908",
};

export const ORACLE_SWAP_ADDRESS: { [key: number]: string } = {
  [SUPPORT_CHAIN_IDS.MUMBAI]: "0x8f62a65851b772491a34cAd28B4E0Ea298e1b6C3",
  [SUPPORT_CHAIN_IDS.BINANCE]: "0x573Df1765F7d85d273F1bdF50377D6695011C416",
  [SUPPORT_CHAIN_IDS.AVALANCHE]: "0x9DB1aCc41263beD6fbB03b3e98d2FB1Bb9D2Ab34",
};

export const tokenOptionsPolygon = [
  { id: 1, name: "TokenA", value: ATOKEN_ADDRESS[SUPPORT_CHAIN_IDS.MUMBAI] },
  { id: 2, name: "TokenB", value: BTOKEN_ADDRESS[SUPPORT_CHAIN_IDS.MUMBAI] }
];

export const tokenOptionsBinance = [
  { id: 1, name: "TokenA", value: ATOKEN_ADDRESS[SUPPORT_CHAIN_IDS.BINANCE] },
  { id: 2, name: "TokenB", value: BTOKEN_ADDRESS[SUPPORT_CHAIN_IDS.BINANCE] }
];

export const tokenOptionsAvalanche = [
  { id: 1, name: "TokenA", value: ATOKEN_ADDRESS[SUPPORT_CHAIN_IDS.AVALANCHE] },
  { id: 2, name: "TokenB", value: BTOKEN_ADDRESS[SUPPORT_CHAIN_IDS.AVALANCHE] }
];

export const networkOptions = [
  { id: 1, name: "Polygon", value: SUPPORT_CHAIN_IDS.MUMBAI },
  { id: 2, name: "Binance", value: SUPPORT_CHAIN_IDS.BINANCE },
  { id: 3, name: "Avalanche", value: SUPPORT_CHAIN_IDS.AVALANCHE },
];
