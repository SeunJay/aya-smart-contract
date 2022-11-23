async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const AyaContract = await ethers.getContractFactory("AyaContract");

  const ayaContract = await AyaContract.deploy();

  console.log("AyaContract address:", ayaContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
