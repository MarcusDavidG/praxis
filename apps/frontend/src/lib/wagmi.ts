import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon, polygonAmoy } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Praxis",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [polygon, polygonAmoy],
  ssr: true,
});
