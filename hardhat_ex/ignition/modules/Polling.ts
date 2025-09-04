import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PollingModule", (m) => {
  const polling = m.contract("Polling");

  return { polling };
});
