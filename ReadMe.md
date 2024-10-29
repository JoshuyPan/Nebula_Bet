### Nebula

### OVERALL LOGIC

### The Nebula Police:

Its an helper Struct that holds the addresses of the users, so you can't register twice and collects all the fees payed to open a bet (Actually is 1 SUI).
It will handle even more logic in the future.

### Nebula Admin Struct:

Its the capability needed to withdraw funds from the Nebula Police Struct, its necessary cause the nebula is a shared object.
the withdraw fund will revert if you're not the admin of the betting Dapp.

### BET:

Its a shared object, you have to pay a fee to us in order to mint one Bet.

### new_bet
When you create a bet, you have to provide how many sui the users needs to pay, in order to enter the bet, and also, the amount of time in ms, before the pick_winner function can be called.
The creator of the bet, does not enter automatically into the bet, he just pays for minting it (there is a scenario were i want to create a bet for someone but i don't want to partecipate).

### join_bet
Now the user, pass the number he wants to pick, and he pay the entry fee that the creator of the bet decided in order to partecipate. all the funds go inside the bet funds field and will be the reward for the winner (We don't take any fee for that, we let them pay only to open bets, then they can even bet 1 milion at time for free).

### pick_winner

clock argument:
```bash
 @0x6
```

This is my favourite one.

First of all, the winning number will be instanciated in this phase, so there is no chance to know the number before the function runs (i'm horny for that).

Second: The time that the creator of the bet decided, need to be expired in order to generate the number. (Its time needed to attact more user into the bet and let the funds grow. More users, more money).

Third (another thing that makes me horny about lol): One of the users must have choosen the exact number, if the number generated, isn't guessed by anyone ......
rulling drums..... we add 15min to the exiring time and we return!

### You're asking why?


Well, because basically, for 15min, we will have other users joining the bet, the funds grows again, and the winner takes more SUI as reward.
The number is once again not guessed? well, the loop repeats.
Its impossible that one bet remain "unpicked" cause, the more "pick_winner()" returns, more users comes, and if the balance grow, everyone wants to join and take the jackpot.
its not needed to re-enter the bet or changing your guess, cause the "guessMe" re evaluate all the times.


### IF YOU WANT TO WRITE SOME TESTS:

- check if the Nebula Police accumulate currency by creating new bets
- check if reverts if the time of the bet didn't pass
- fuzz test to check with many partecipants and how often the winner is picked
- check the deposit and withdraw function on the user

and more..

