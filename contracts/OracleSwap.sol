// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {StringToAddress, AddressToString} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/utils/AddressString.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract OracleSwap is AxelarExecutable, Ownable, ReentrancyGuard {
    using StringToAddress for string;
    using AddressToString for address;
    using SafeERC20 for IERC20;

    error NotAllowedToken();

    event FalseSender(string sourceChain, string sourceAddress);

    IAxelarGasService public immutable gasService;
    IERC20 public immutable AToken;
    IERC20 public immutable BToken;
    IERC20 public immutable SourceAToken; // It's better to create address provider contract to keep token addresses for supported chains
    IERC20 public immutable SourceBToken;
    uint256 public immutable aTokenPrice;
    uint256 public immutable bTokenPrice;
    address public sourceContractAddress;

    constructor(
        address gateway_,
        address gasReceiver_,
        address aToken_,
        address bToken_,
        address sourceAToken_,
        address sourceBToken_
    ) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
        AToken = IERC20(aToken_);
        BToken = IERC20(bToken_);
        SourceAToken = IERC20(sourceAToken_);
        SourceBToken = IERC20(sourceBToken_);

        aTokenPrice = 10 ** 8; // 8 decimals, should be fetched from oracle service
        bTokenPrice = 2 * 10 ** 8;
    }

    function swapRemote(
        string calldata destinationChain,
        string calldata destinationAddress,
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) public payable nonReentrant {
        if (
            (tokenIn != address(AToken) && tokenIn != address(BToken)) ||
            (tokenOut != address(AToken) && tokenOut != address(BToken)) ||
            (tokenIn == tokenOut)
        ) revert NotAllowedToken();

        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        bytes memory payload = abi.encode(
            msg.sender,
            tokenIn,
            tokenOut,
            amountIn
        );
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        if (sourceAddress.toAddress() != sourceContractAddress) {
            emit FalseSender(sourceChain, sourceAddress);
            return;
        }
        (
            address sender,
            address sourceTokenIn,
            address sourceTokenOut,
            uint256 amountIn
        ) = abi.decode(payload, (address, address, address, uint256));

        if (
            (sourceTokenIn != address(SourceAToken) &&
                sourceTokenIn != address(SourceBToken)) ||
            (sourceTokenOut != address(SourceAToken) &&
                sourceTokenOut != address(SourceBToken)) ||
            (sourceTokenIn == sourceTokenOut)
        ) revert NotAllowedToken();

        IERC20 tokenIn = sourceTokenIn == address(SourceAToken)
            ? AToken
            : BToken;
        IERC20 tokenOut = tokenIn == AToken ? BToken : AToken;

        uint256 amountOut = calculateAmountOut(tokenIn, tokenOut, amountIn);
        require(
            tokenOut.balanceOf(address(this)) >= amountOut,
            "Insufficient liquidity"
        );
        tokenOut.safeTransfer(sender, amountOut);
    }

    function calculateAmountOut(
        IERC20 tokenIn,
        IERC20 tokenOut, // Not used, this param is necessary when we support more tokens
        uint256 amountIn
    ) public view returns (uint256 amountOut) {
        if (tokenIn == AToken) {
            amountOut = (aTokenPrice * amountIn) / bTokenPrice; // assume decimal for aToken and bToken is equal
        } else {
            amountOut = (bTokenPrice * amountIn) / aTokenPrice;
        }
    }

    // Admin functions

    function setSourceContractAddress(address addr_) public onlyOwner {
        sourceContractAddress = addr_;
    }

    function emergencyTransferTokens(
        address tokenAddress,
        address to,
        uint256 amount
    ) public onlyOwner {
        require(
            tokenAddress != address(AToken),
            "Not allowed to withdraw this token"
        );
        require(
            tokenAddress != address(BToken),
            "Not allowed to withdraw this token"
        );

        IERC20(tokenAddress).safeTransfer(to, amount);
    }
}
