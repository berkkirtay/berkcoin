import abiDecoder from 'abi-decoder';
import BerkToken from "../contracts/BerkToken";

export const getCollectibles = async (account, contract) => {
    const collectibles = [];

    const tokenCount = await contract.methods.getTokenCount()
        .call({ from: account });

    for (var i = 1; i <= tokenCount; i++) {
        const accessibility = await contract.methods.getAccessibility(i)
            .call({ from: account });
        if (accessibility === false) {
            continue;
        }

        const collectible = await getCollectible(contract, account, i);
        collectibles.push(collectible);
    }
    return collectibles;
};

export const findUserCollectible = async (account, contract) => {
    const tokenCount = await contract.methods.getTokenCount()
        .call({ from: account });

    for (var i = 1; i <= tokenCount; i++) {
        const accessibility = await contract.methods.getAccessibility(i)
            .call({ from: account });
        if (accessibility === false) {
            continue;
        }

        const tokenOwner = await contract.methods.getTokenOwner(i)
            .call({ from: account });
        if (tokenOwner === account) {
            return await getCollectible(contract, account, i);
        }
    }
    return await getCollectible(contract, account, 1);
}

export const getCollectible = async (contract, account, collectibleIndex) => {
    const tokenURI = await contract.methods.getTokenURI(collectibleIndex)
        .call({ from: account });
    const tokenOwner = await contract.methods.getTokenOwner(collectibleIndex)
        .call({ from: account });
    const tokenCreator = await contract.methods.getTokenCreator(collectibleIndex)
        .call({ from: account });
    const tokenDescription = await contract.methods.getTokenDescription(collectibleIndex)
        .call({ from: account });
    const priceOfCollectible = await contract.methods.getPriceOfCollectible(collectibleIndex)
        .call({ from: account });
    const collectibleHash = await contract.methods.getTokenHash(collectibleIndex)
        .call({ from: account });
    const availability = await contract.methods.getAvailabilityOfToken(collectibleIndex)
        .call({ from: account });

    // Price level:
    var priceLevel = "green";
    if (priceOfCollectible >= 200000) {
        priceLevel = "darkviolet";
    }
    else if (priceOfCollectible >= 100000) {
        priceLevel = "#ff5202";
    }
    else if (priceOfCollectible >= 50000) {
        priceLevel = "red";
    }
    else if (priceOfCollectible >= 10000) {
        priceLevel = "blue";
    }

    return {
        "tokenID": collectibleIndex,
        "tokenURI": tokenURI,
        "tokenCreator": tokenCreator,
        "tokenOwner": tokenOwner,
        "tokenDescription": tokenDescription,
        "priceOfCollectible": priceOfCollectible,
        "collectibleHash": collectibleHash,
        "priceLevel": priceLevel,
        "availability": availability
    }
};

export const getTransactions = async (account, contract, web3) => {
    const contractAddress = "0x8Bc1df7C214a04B61264882469490650C3A229C3";

    abiDecoder.addABI(BerkToken.abi);
    const transactions = [];
    // We can easily fetch indexed transactions:
    const pastLogs = await web3.eth.getPastLogs(
        { fromBlock: '0x0', address: contractAddress });
    // Decoding transactions inputs:
    const filteredTransactions = new Set();
    pastLogs.forEach(async (log) => {
        const transaction = await web3.eth.getTransaction(log.transactionHash);
        if (transaction.from === account) {
            const decodedLog = abiDecoder.decodeMethod(transaction.input);
            if (decodedLog !== undefined) {
                if (filteredTransactions.has(transaction.hash) === false) {
                    filteredTransactions.add(transaction.hash);
                    var value = 0;
                    if (decodedLog.name === "send"
                        || decodedLog.name === "stake") {
                        const params = decodedLog.params;
                        value = params[1].value;
                    }
                    transactions.push({
                        "hash": transaction.hash,
                        "log": decodedLog,
                        "value": value
                    });
                }
            }
        }
    })
    return transactions;
};

export const getPosts = async (account, contract) => {
    const posts = [];

    const postCount = await contract.methods.getPostCount()
        .call({ from: account });

    for (var i = postCount; i >= 0; i--) {
        const postAuthor = await contract.methods.getPostAuthor(i)
            .call({ from: account });
        const postText = await contract.methods.getPostText(i)
            .call({ from: account });
        const postDate = await contract.methods.getPostDate(i)
            .call({ from: account });
        const postUpvotes = await contract.methods.getPostUpvotes(i)
            .call({ from: account });

        const post = {
            "id": i,
            "author": postAuthor,
            "text": postText,
            "date": postDate,
            "upvotes": postUpvotes
        };
        posts.push(post);
    }
    return posts;
};