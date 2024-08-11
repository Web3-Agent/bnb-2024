import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const SYSTEM_PROMPT = `You are an AI assistant that helps users write EVM compatible smart contracts. Use the best security standards.`
const DEFAULT_SYSTEM_PROMPT = "Please write code and return response must be contain code.";
const TEMPLATE_MAPPING = {
    SMART_CONTRACT: 'SMART_CONTRACT',
}
const contractCode = `
return below code with solidity.
"// SPDX-License-Identifier: MIT\n"
"pragma solidity ^0.8.20;\n\n"
"import {ERC20} from \"@openzeppelin/contracts/token/ERC20/ERC20.sol\";\n"
"import {IERC165} from \"@openzeppelin/contracts/utils/introspection/IERC165.sol\";\n"
"import {IERC165} from \"@openzeppelin/contracts/utils/introspection/IERC165.sol\";\n\n"
"/// @title IOptimismMintableERC20\n"
"/// @notice This interface is available on the OptimismMintableERC20 contract.\n"
"///         We declare it as a separate interface so that it can be used in\n"
"///         custom implementations of OptimismMintableERC20.\n"
"interface IOptimismMintableERC20 is IERC165 {\n"
"    function remoteToken() external view returns (address);\n\n"
"    function bridge() external returns (address);\n\n"
"    function mint(address _to, uint256 _amount) external;\n\n"
"    function burn(address _from, uint256 _amount) external;\n"
"}\n\n"
"/// @custom:legacy\n"
"/// @title ILegacyMintableERC20\n"
"/// @notice This interface was available on the legacy L2StandardERC20 contract.\n"
"///         It remains available on the OptimismMintableERC20 contract for\n"
"///         backwards compatibility.\n"
"interface ILegacyMintableERC20 is IERC165 {\n"
"    function l1Token() external view returns (address);\n\n"
"    function mint(address _to, uint256 _amount) external;\n\n"
"    function burn(address _from, uint256 _amount) external;\n"
"}\n\n"
"contract Web3AgentL2Token is IOptimismMintableERC20, ERC20 {\n"
"    /// @notice Address of the corresponding version of this token on the remote chain.\n"
"    address public immutable REMOTE_TOKEN;\n\n"
"    /// @notice Address of the StandardBridge on this network.\n"
"    address public immutable BRIDGE;\n\n"
"    /// @notice Emitted whenever tokens are minted for an account.\n"
"    /// @param account Address of the account tokens are being minted for.\n"
"    /// @param amount  Amount of tokens minted.\n"
"    event Mint(address indexed account, uint256 amount);\n\n"
"    /// @notice Emitted whenever tokens are burned from an account.\n"
"    /// @param account Address of the account tokens are being burned from.\n"
"    /// @param amount  Amount of tokens burned.\n"
"    event Burn(address indexed account, uint256 amount);\n\n"
"    /// @notice A modifier that only allows the bridge to call.\n"
"    modifier onlyBridge() {\n"
"        require(\n"
"            msg.sender == BRIDGE,\n"
"            \"WGeroXL2Token: only bridge can mint and burn\"\n"
"        );\n"
"        _;\n"
"    }\n\n"
"    /// @param _bridge      Address of the L2 standard bridge.\n"
"    /// @param _remoteToken Address of the corresponding L1 token.\n"
"    constructor(\n"
"        string memory tokenName,\n"
"        string memory tokenSymbol,\n"
"        address _bridge,\n"
"        address _remoteToken\n"
"    ) ERC20(tokenName, tokenSymbol) {\n"
"        REMOTE_TOKEN = _remoteToken;\n"
"        BRIDGE = _bridge;\n"
"    }\n\n"
"    /// @custom:legacy\n"
"    /// @notice Legacy getter for REMOTE_TOKEN.\n"
"    function remoteToken() public view returns (address) {\n"
"        return REMOTE_TOKEN;\n"
"    }\n\n"
"    /// @custom:legacy\n"
"    /// @notice Legacy getter for BRIDGE.\n"
"    function bridge() public view returns (address) {\n"
"        return BRIDGE;\n"
"    }\n\n"
"    /// @notice ERC165 interface check function.\n"
"    /// @param _interfaceId Interface ID to check.\n"
"    /// @return Whether or not the interface is supported by this contract.\n"
"    function supportsInterface(\n"
"        bytes4 _interfaceId\n"
"    ) external pure virtual returns (bool) {\n"
"        bytes4 iface1 = type(IERC165).interfaceId;\n"
"        // Interface corresponding to the updated OptimismMintableERC20 (this contract).\n"
"        bytes4 iface2 = type(IOptimismMintableERC20).interfaceId;\n"
"        return _interfaceId == iface1 || _interfaceId == iface2;\n"
"    }\n\n"
"    /// @notice Allows the StandardBridge on this network to mint tokens.\n"
"    /// @param _to     Address to mint tokens to.\n"
"    /// @param _amount Amount of tokens to mint.\n"
"    function mint(\n"
"        address _to,\n"
"        uint256 _amount\n"
"    ) external virtual override(IOptimismMintableERC20) onlyBridge {\n"
"        _mint(_to, _amount);\n"
"        emit Mint(_to, _amount);\n"
"    }\n\n"
"    /// @notice Prevents tokens from being withdrawn to L1.\n"
"    function burn(\n"
"        address,\n"
"        uint256\n"
"    ) external virtual override(IOptimismMintableERC20) onlyBridge {\n"
"        revert(\"MyCustomL2Token cannot be withdrawn\");\n"
"    }\n"
"}"
`

export const config = {
    runtime: 'edge', // Specify edge runtime
};


export default async function POST(request) {
    try {
        const { template, query: { prompt, contractType } } = await request.json();
        if (contractType === 'CROSS_CHAIN_TOKEN') {
            const messages = [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: JSON.stringify(contractCode),
                },
            ]
            const response = await generateResponse(messages);

            return NextResponse.json({ message: 'SMART_CONTRACT_CODE_GENERATED', data: response })
            // return NextResponse.json({ message: 'SMART_CONTRACT_CODE_GENERATED', data: contractCode })
        }
        switch (template) {
            case TEMPLATE_MAPPING.SMART_CONTRACT: {
                const messages = [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT,
                    },
                    {
                        role: "system",
                        content: DEFAULT_SYSTEM_PROMPT,
                    },
                    {
                        role: "user",
                        content: JSON.stringify(prompt),
                    },
                ]
                const response = await generateResponse(messages);

                return NextResponse.json({ message: 'SMART_CONTRACT_CODE_GENERATED', data: response })
            } default: {
                return NextResponse.json({ message: 'UNSUPPORTED_ACTIONS' }, { status: 400 })
            }
        }
    } catch (error) {
        return NextResponse.json({ message: 'SOMETHING_WENT_WRONG', error: error?.message }, { status: 500 })
    }
}

const generateResponse = async (messages) => {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        const configuration = {
            apiKey,
        };
        const openai = new OpenAI(configuration);

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            temperature: 0.2,
            max_tokens: 6000,
            messages,
            // max_tokens: 200,
        });
        console.log(JSON.stringify(response, null, 2))
        return response.choices[0].message.content;
    } catch (err) {
        console.error(err);
        return null;
    }
};



