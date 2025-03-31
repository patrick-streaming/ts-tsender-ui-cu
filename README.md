1. Create a basic react/nextjs application ✅
2. Connect our wallet, with a nicer connect application ✅
3. Implement this function ✅
```javascript 
function airdropERC20(
        address tokenAddress, // ERC20 token
        address[] calldata recipients, 
        uint256[] calldata amounts,
        uint256 totalAmount
    )
```
4. e2e testing ✅
   1. When we connect, we see the form
   2. When disconnected, we don't
5. Deploy to fleek