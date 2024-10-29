module nebula::bet{

    use nebula::user::{Self, User};

    use std::string::{Self, String};

    use sui::sui::{Self, SUI};
    use sui::balance::{Self, Balance};
    use sui::table::{Self, Table};

    // Struct of a Bet
    public struct Bet has key, store{
        id: UID,
        condition: String,
        amountToPartecipate: u64,
        squadA: Table<address, User>,
        squadB: Table<address, User>,
        timeRemaining: u64,
        funds: Balance<SUI>
    }

    // As soon as the bet is a shared object, by sending this object to the bet creator
    // we grant privileges to special functions 
    public struct BetAdmin has key {id: UID}

    // ======== PUBLIC FUNCTIONS =========
    public fun create_bet(
        user: &mut User,
        condition: String,
        amountSuiPerUser: u64,
        timeExpiring: u64,
        ctx: &mut TxContext
    ){
        transfer::transfer(BetAdmin{id: object::new(ctx)}, tx_context::sender(ctx));
        
        let take_bet = user.split_balance(amountSuiPerUser * 1000000000);

        let bet = Bet {
            id: object::new(ctx),
            condition: condition,
            amountToPartecipate: amountSuiPerUser,
            squadA: table::new(ctx),
            squadB: table::new(ctx),
            timeRemaining: timeExpiring,
            funds: take_bet
        };

        transfer::share_object(bet)
    }

    public fun get_bet_stats(bet: &Bet): (String, u64, u64, u64, u64, u64){
        // We wont to return the adresses of the partecipants, but just the amount for each squad
        let squad_a_partecipants = table::length(&bet.squadA);
        let squad_b_partecipants = table::length(&bet.squadB);
        let funds = balance::value(&bet.funds);

        (bet.condition, bet.amountToPartecipate, squad_a_partecipants, squad_b_partecipants, bet.timeRemaining, funds)
    }
}