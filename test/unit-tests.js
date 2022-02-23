var BerkToken = artifacts.require("./BerkToken.sol");
var CollectibleToken = artifacts.require("./CollectibleToken.sol");


contract("BerkToken", async accounts => {
    it("Should buy 100000 berkcoins and sell them back", async () => {
        const instance = await BerkToken.deployed();
        const tokenPrice = await instance.getTokenPrice.call({ from: accounts[0] });
        await instance.deposit(100000, { from: accounts[0], value: (100000 * tokenPrice) });
        let balance = await instance.getBalance.call(accounts[0]);
        assert.equal(
            balance,
            100000,
            "User could not deposit any funds!"
        );

        await instance.withdraw(100000, { from: accounts[0] });
        balance = await instance.getBalance.call(accounts[0]);

        assert.equal(
            balance,
            0,
            "User could not withdraw any funds!"
        );
    });

    it("Should be able to transfer berkcoins between peers", async () => {
        const instance = await BerkToken.deployed();
        const tokenPrice = await instance.getTokenPrice.call({ from: accounts[0] });
        await instance.deposit(10, { from: accounts[0], value: (100000 * tokenPrice) });
        await instance.send(accounts[1], 10, { from: accounts[0] });
        let balance = await instance.getBalance.call(accounts[1]);
        assert.equal(
            balance,
            10,
            "User could not send any funds!"
        );

        balance = await instance.getBalance.call(accounts[0]);
        assert.equal(
            balance,
            0,
            "User could send funds but did not lose them!"
        );
    });

    it("Should withdraw after staking", async () => {
        const instance = await BerkToken.deployed();
        const tokenPrice = await instance.getTokenPrice.call({ from: accounts[0] });
        const amount = 10000;
        await instance.deposit(amount, { from: accounts[0], value: (amount * tokenPrice) });
        await instance.stake(1, amount, { from: accounts[0] });
        let balance = await instance.getBalance.call(accounts[0]);
        assert.equal(
            balance,
            0,
            "User could not stake any funds!"
        );

        const currentTimeStamp = Math.round((new Date()).getTime() / 1000);
        await instance.checkStakeStatus(accounts[0], currentTimeStamp, { from: accounts[0] });
        balance = await instance.getBalance.call(accounts[0]);
        assert.equal(
            balance,
            10000,
            "User could not withdraw staked funds!"
        );
    })

});