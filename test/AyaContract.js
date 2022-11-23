const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("AyaContract", () => {
  async function deployAyaContractFixture() {
    const AyaContract = await ethers.getContractFactory("AyaContract");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const ayaContract = await AyaContract.deploy();

    const sendValue = ethers.utils.parseEther("1");
    const sendValue2 = ethers.utils.parseEther("2");

    await ayaContract.deployed();

    return {
      AyaContract,
      ayaContract,
      owner,
      addr1,
      addr2,
      sendValue,
      sendValue2,
    };
  }

  describe("deployer", () => {
    it("it should set the owner to be the deployer of the contract", async () => {
      const { owner, ayaContract } = await deployAyaContractFixture();
      expect(await ayaContract.owner()).to.equal(owner.address);
    });
  });

  describe("deposit", () => {
    it("it should update data structure properly for contract deployer", async () => {
      const { ayaContract, sendValue, owner } =
        await deployAyaContractFixture();

      await ayaContract.deposit({ value: sendValue });

      const response = await ayaContract.viewBalance(owner.address);
      expect(response.toString()).to.equal(sendValue.toString());
    });

    it("it should update data structure properly for other account", async () => {
      const { ayaContract, sendValue2, addr1 } =
        await deployAyaContractFixture();

      await ayaContract.connect(addr1).deposit({ value: sendValue2 });

      const response = await ayaContract.viewBalance(addr1.address);
      expect(response.toString()).to.equal(sendValue2.toString());
    });
  });

  describe("withdraw", () => {
    it("it should revert with the right error if account has no eth deposit", async () => {
      const { ayaContract, addr2 } = await deployAyaContractFixture();

      await expect(ayaContract.connect(addr2).withdraw(1)).to.be.revertedWith(
        "You have no deposits"
      );
    });

    it("it should revert with the right error if account's balance is not up to amount to be withdrawn", async () => {
      const { ayaContract, addr2, sendValue2 } =
        await deployAyaContractFixture();

      await ayaContract.connect(addr2).deposit({ value: sendValue2 });

      await expect(ayaContract.connect(addr2).withdraw(3)).to.be.revertedWith(
        "You don't have enough ETH"
      );
    });

    it("it shouldn't revert with any error for other account with deposited eth", async () => {
      const { ayaContract, sendValue2, addr1 } =
        await deployAyaContractFixture();

      await ayaContract.connect(addr1).deposit({ value: sendValue2 });

      const response = await ayaContract.viewBalance(addr1.address);
      // console.log("balance before withdrawing ", response.toString());

      await ayaContract.connect(addr1).withdraw(1);

      const response2 = await ayaContract.viewBalance(addr1.address);
      // console.log("balance after withdrawing ", response2.toString());

      expect(response.toString()).to.equal(sendValue2.toString());
    });
  });
});
