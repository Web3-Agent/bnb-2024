export const SMART_CONTRACT = [
    {
        title: 'Simple ERC20 Token',
        description: 'Simple Token. A fixed supply is minted on deployment, and new tokens can never be created.',
        tags: ['Token', 'ERC20', 'Fixed Supply', 'Audited'],
        constructorParameters: [
            { label: 'Name', key: '_TOKEN_NAME_', dataType: 'string' },
            { label: 'Symbol', key: '_TOKEN_SYMBOL_', dataType: 'string' },
            { label: 'Total Supply', key: '_TOTAL_SUPPLY_', dataType: 'uint256' },
        ]
    },
    {
        title: 'Mintable ERC20 Token',
        description: 'Token that allows the owner to mint as many tokens as desired.',
        tags: ['Token', 'ERC20', 'Mintable', 'Audited'],
        constructorParameters: [
            { label: 'Name', key: 'name', dataType: 'string' },
            { label: 'Symbol', key: 'symbol', dataType: 'string' },
            { label: 'Total Supply', key: 'totalSupply', dataType: 'uint256' },
        ]
    },
    {
        title: 'Simple ERC721 NFT Sale',
        description: 'Simple ERC721 NFT with a built in sale.',
        tags: ['NFT', 'ERC721', 'Sale'],
        constructorParameters: [
            { label: 'Name', key: 'name', dataType: 'string' },
            { label: 'Symbol', key: 'symbol', dataType: 'string' },
            { label: 'Uri', key: 'uri', dataType: 'string' },
            { label: 'Price', key: 'price', dataType: 'uint256' },
            { label: 'Max Supply', key: 'maxSupply', dataType: 'uint256' },
        ]
    },
    {
        title: 'Simple ERC1155 NFT',
        description: 'An ERC1155 NFT that supports creating multiple collections.',
        tags: ['NFT', 'ERC1155'],
        constructorParameters: [
            { label: 'Uri', key: 'uri', dataType: 'string' },
        ]
    },
    {
        title: 'Staking Rewards Example',
        description: 'This is a minimal example of a contract that rewards users for staking their token.',
        tags: ['ERC20', 'Staking', 'Rewards'],
        constructorParameters: [
            { label: 'Staking Token', key: 'stakingToken', dataType: 'address' },
            { label: 'Reward Token', key: 'rewardToken', dataType: 'address' },
        ]
    },
    {
        title: 'ERC20Token',
        description: 'Simple Mintable, Burnable and Pausable ERC20 token contract.',
        tags: ['ERC20', 'Mintable'],
        constructorParameters: []
    },
    {
        title: 'ERC721',
        description: 'ERC721 NFT contract with Mintable with auto incremental token id, BASE URI and Ownable contract to manage ownership',
        tags: ['ERC721', 'NFT'],
        constructorParameters: []
    }
]