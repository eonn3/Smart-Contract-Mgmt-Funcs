// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public lockedAmount;

    event Deposit(uint256 amountD);
    event Withdraw(uint256 amountW);
    event AmountLocked (uint256 amountL);
    event AmountUnlocked (uint256 amountU);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amountD) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amountD;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amountD);

        // emit the event
        emit Deposit(_amountD);
    }

    // custom errors
    error InsufficientWBalance(uint256 balance, uint256 withdrawAmount);
    error InsufficientLBalance(uint256 balance, uint256 lockAmount);
    error InsufficientUBalance(uint256 balance, uint256 unlockAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if ((balance - lockedAmount) < _withdrawAmount) {
            revert InsufficientWBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function lock(uint256 _lockAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousLocked = lockedAmount;
        // make sure there is enough balance to lock
        if ((balance - lockedAmount) < _lockAmount) {
            revert InsufficientLBalance({
                balance: balance,
                lockAmount: _lockAmount
            });
        }

        // lock the given amount
        lockedAmount += _lockAmount;

        // assert that the locked amount is correct
        assert(lockedAmount == _previousLocked + _lockAmount);

        // emit the event
        emit AmountLocked(_lockAmount);
    }

    function unlock(uint256 _unlockAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousLocked = lockedAmount;
        // make sure there is enough balance to lock
        if (lockedAmount < _unlockAmount) {
            revert InsufficientUBalance({
                balance: balance,
                unlockAmount: _unlockAmount
            });
        }

        // unlock the given amount
        lockedAmount -= _unlockAmount;
        
        // assert that the locked amount is correct
        assert(lockedAmount == _previousLocked - _unlockAmount);

        // emit the event
        emit AmountUnlocked(_unlockAmount);
    }
}
