# Smart Contract Management Functions

This is a Solidity project with a smart contract simulating a version of an ATM. Its functions are ``deposit(amount)``, ``withdraw(amount)``, ``lock(amount)``and ``unlock(amount)``.

## Description

``Assessment.sol`` has a contract called ``Assessment``, representing the ATM. It has two variables: ```owner```, ```balance```, and ```lockedAmount```, which represent account owner, the account balance, and the locked amount. Its three functions are ``deposit(amount)`` for depositing a specified amount, ``withdraw(amount)`` withdrawing a given amount, ``lock(amount)`` which locks a certain amount from the balance, and ``unlock(amount)``.

## Using the Skills

### Retribution

To finish off a target with Retribution, call the function ``retribution(_enemyHealth)`` with the enemy health as the parameter. The function requires that the target's health is less than 8 and gives an error message if it fails to meet this condition. If the condition is met, the target's health is successfully decreased by 8.

### Damage Buff

To buff the player's damage, call the function ``damageBuff()``. If the player's health is less than or equal to 30 and greater than 25, this function will successfully increase the player's damage by 15 and decrease the player's health by 25. 

### Shoot Foot

To meet the conditions for the Damage Buff skill when the player's health is too high, call the function ``shootFoot()``. This function decreases the player's health by the player's damage. It will only do so if health is greater than damage. Otherwise, an error message will be given. 

## Author

Eonn Domingo


## License

This project is licensed under the MIT License - see the LICENSE file for details.
