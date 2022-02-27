const truffleAssert = require('truffle-assertions');

var BerkToken = artifacts.require("./BerkToken.sol");

contract("BerkToken", async accounts => {
    var instance;
    it("Should buy 100000 berkcoins and sell them back", async () => {
        instance = await BerkToken.new({ from: accounts[8] });
        const tokenPrice = await instance.getTokenPrice.call();
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
        const tokenPrice = await instance.getTokenPrice.call();
        await instance.deposit(10, { from: accounts[0], value: (10 * tokenPrice) });
        await instance.send(accounts[1], 10, { from: accounts[0] });
        let balance = await instance.getBalance.call(accounts[1]);
        assert.equal(
            balance,
            10,
            "User could not send any funds!"
        );
        await instance.withdraw(10, { from: accounts[1] });
        balance = await instance.getBalance.call(accounts[0]);
        assert.equal(
            balance,
            0,
            "User could send funds but did not lose them!"
        );
    });

    it("Should withdraw after staking", async () => {
        const tokenPrice = await instance.getTokenPrice.call();
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
        await instance.withdraw(10000, { from: accounts[0] });
    })

    it("Contract balance should be 1 ETH", async () => {
        const tokenPrice = await instance.getTokenPrice.call();
        const amount = (1 / tokenPrice) * 10 ** 18;
        await instance.deposit(amount, { from: accounts[0], value: (amount * tokenPrice) });
        let balance = await instance.getContractBalance.call();
        assert.equal(
            Number(balance),
            10 ** 18,
            "Contract balance is not 1 ETH!"
        );
    })

    it("Should burn specified amount of tokens", async () => {
        const tokenPrice = await instance.getTokenPrice.call();
        let balance = await instance.getBalance.call(accounts[0]);
        const amount = 1000000;
        await instance.deposit(amount, { from: accounts[0], value: (amount * tokenPrice) });
        await instance.burnTokens(Number(balance) + amount, { from: accounts[0] });
        balance = await instance.getBalance.call(accounts[0]);
        assert.equal(
            Number(balance),
            0,
            "User could not burn any funds!"
        );
    })

    it("Should pay the collectible register fee", async () => {
        const tokenPrice = await instance.getTokenPrice.call();
        const tokenFee = await instance.getCollectibleFee.call();
        await instance.deposit(tokenFee, { from: accounts[0], value: (tokenFee * tokenPrice) });
        await instance.registerNewCollectible("uri", "description", 1000, true, { from: accounts[0] });
        let balance = await instance.getBalance.call(accounts[0]);
        assert.equal(
            balance,
            0,
            "Collectible fee is not paid!"
        );
    });

    it("Should register new collectible and transfer it", async () => {
        instance = await BerkToken.new({ from: accounts[8] });
        const tokenPrice = await instance.getTokenPrice.call();
        const tokenFee = await instance.getCollectibleFee.call();
        await instance.deposit(tokenFee, { from: accounts[0], value: (tokenFee * tokenPrice) });
        await instance.registerNewCollectible("uri", "description", 1000, true, { from: accounts[0] });

        const priceOFCollectible = await instance.getPriceOfCollectible.call(1);
        await instance.deposit(priceOFCollectible, { from: accounts[1], value: (priceOFCollectible * tokenPrice) });
        await instance.buyCollectible(1, { from: accounts[1] });
        const newOwner = await instance.getTokenOwner.call(1);
        assert.equal(
            newOwner,
            accounts[1],
            "Collectible could not be transferred!"
        );
    })

    it("Should not register a duplicate collectible", async () => {
        const tokenPrice = await instance.getTokenPrice.call();
        const tokenFee = await instance.getCollectibleFee.call() * 2;
        await instance.deposit(tokenFee, { from: accounts[3], value: (tokenFee * tokenPrice) });
        await instance.registerNewCollectible("duplicateURI", "description", 1000, true, { from: accounts[3] });

        await truffleAssert.reverts(
            instance.registerNewCollectible("duplicateURI", "description", 1000, true, { from: accounts[3] }),
            "Token URI is already owned!"
        );
    })
});