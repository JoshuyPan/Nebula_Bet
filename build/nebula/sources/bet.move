module nebula::bet{

    use nebula::user::{Self, User};

    use std::string::{Self, String};

    use sui::sui::{Self, SUI};
    use sui::balance::{Self, Balance};
    use sui::table::{Self, Table};

    // Struct of a Bet
    public struct Bet has key, store{
        id: UID,
        guessMe: u64, // The number that you should guess
        amountToPartecipate: u64, // Amount of sui to enter the bet
        guessPerAddress: Table<address, u64>, // Mapping of addresses and their guess
        timeRemaining: u64, // Time remaining before the guessMe is picked
        funds: Balance<SUI> // Balance of the bet itself
    }

    // ======== PUBLIC FUNCTIONS =========
    public fun create_bet(
        amountSuiPerUser: u64,
        timeExpiring: u64,
        ctx: &mut TxContext
    ){
        transfer::share_object(Bet {
            id: object::new(ctx),
            guessMe: 0,
            amountToPartecipate: amountSuiPerUser * 1000000000, // In MIST
            guessPerAddress: table::new(ctx),
            timeRemaining: timeExpiring,
            funds: balance::zero()
        });
    }

    public fun pay_and_entry(bet: &mut Bet, balance: Balance<SUI>, guess: u64, user: address){
        bet.funds.join(balance);
        bet.guessPerAddress.add(user, guess);
    }

    // ========= GETTERS ============
    public fun get_bet_stats(bet: &Bet): (u64, u64, u64){
        let amount_sui = bet.funds.value();
        (bet.amountToPartecipate, bet.timeRemaining, amount_sui)
    }

    public fun user_already_in(bet: &Bet, sender: address): bool{
        bet.guessPerAddress.contains(sender)
    }
}