module nebula::nebula{

    use std::string::{Self, String};

    use sui::table::{Self, Table};
    use sui::sui::{SUI};
    use sui::balance::{Self, Balance};

    use nebula::user::{Self, User};
    use nebula::bet::{Self, Bet};

    // ========== ERRORS ========
    const E_ALREADY_REGISTRED: u64 = 101; 
    const E_NOT_ENOUGH_SUI: u64 = 102;
    const E_ALREADY_GUESSED: u64 = 103;

    // My Security Checker
    public struct NebulaPolice has key {
        id: UID,
        addressIsRegistred: Table<address, bool>,
        newBetFee: u64, // This is expressed in mist = 1 SUI -> 1000000000 MIST
        balance: Balance<SUI>
    }

    // Only who has the nebula admin can withdraw the funds of the Nebula Dapp.
    public struct NebulaAdmin has key {id: UID}
    
    fun init(ctx: &mut TxContext) {
        // Transfer the Nebula Police to the owner of the Bet DAPP
        transfer::share_object(NebulaPolice{
            id: object::new(ctx),
            addressIsRegistred: table::new(ctx),
            newBetFee: 1 * 1000000000,
            balance: balance::zero()
        });

        // Same for the Admin Capability
        transfer::transfer(NebulaAdmin{
            id: object::new(ctx)
        }, tx_context::sender(ctx))
    }

    // ======== PUBLIC ENTRY FUNCTIONS ========= 
    public entry fun register(police: &mut NebulaPolice, ctx: &mut TxContext){
        let sender = tx_context::sender(ctx);
        // Check if the address is in the table
        let registred = police.addressIsRegistred.contains(sender);
        // If so revert
        if(registred){
            abort(E_ALREADY_REGISTRED)
        }else{
            // Otherwise we add the address to the table
            police.addressIsRegistred.add(sender, true);
            // We estanciate a new user
            let newUser = user::new_user(ctx);
            // And we send it to the caller
            transfer::public_transfer(newUser, sender);
            }
    }

    public entry fun new_bet(
        user: &mut User,
        police: &mut NebulaPolice, 
        amountSuiPerUser: u64, // You have to input how many SUI to partecipate (MIN is 1 SUI)
        timeExpiring: u64, // Provide the bet duration before the number is picked
        ctx: &mut TxContext
        )
    {
        // The Fee for opening new bet
        let bet_fee = police.newBetFee;
        // Lets Grab the user field that we need (balance amount)
        let (_, _, _, _, amount_available) = user.get_user_stats();
        // Now we want the sender to pay for the opening bet fee so lets check if it has that amount or we revert
        assert!(amount_available >= bet_fee, E_NOT_ENOUGH_SUI);
        // If it has enough sui, we take our fee and we give it to the police
        let balance_fee_to_take = user.split_balance(bet_fee);
        police.balance.join(balance_fee_to_take);
        // Then Create new BET
        bet::create_bet(amountSuiPerUser, timeExpiring, ctx);
    }

    public entry fun join_bet(
        user: &mut User,
        bet: &mut Bet,
        guess: u64
    ){
        // We grab the needed fields:
        let (user_owner, _, _, _, user_balance) = user.get_user_stats();
        let (amount_to_partecipate, _,_) = bet.get_bet_stats();

        // First of all, we want to check that the user is not already inside the bet.
        let already_guessed = bet.user_already_in(user_owner);
        // If it is, we revert
        if (already_guessed){
            abort(E_ALREADY_GUESSED)
        } else {
            // So first of all, we want to check if the user have enough SUI to join the bet.
            assert!(user_balance >= amount_to_partecipate, E_NOT_ENOUGH_SUI);
            // If so, we take the amount and we merge it inside the bet funds
            let balance_to_take = user.split_balance(amount_to_partecipate);
            bet.pay_and_entry(balance_to_take, guess, user_owner);
        }
    }
}


