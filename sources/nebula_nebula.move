module nebula::nebula{

    use sui::table::{Self, Table};
    use sui::sui::{SUI};
    use sui::balance::{Self, Balance};
    use sui::clock::{Clock};

    use nebula::user::{Self, User};
    use nebula::bet::{Self, Bet};

    // ========== ERRORS ========
    const E_ALREADY_REGISTRED: u64 = 101; 
    const E_NOT_ENOUGH_SUI: u64 = 102;
    const E_ALREADY_GUESSED: u64 = 103;
    const E_BET_NOT_EXPIRED_YET: u64 = 105;
    
    // ========== CLOCK ==========

    // My Security Checker
    public struct NebulaPolice has key {
        id: UID,
        addressIsRegistred: Table<address, bool>,
        newBetFee: u64, // This is expressed in mist = 1 SUI -> 1000000000 MIST
        balance: Balance<SUI>
    }

    // Only who has the nebula admin can withdraw the funds of the Nebula Dapp.
    public struct NebulaAdmin has key {id: UID}
    // For randon number
    public struct Random_number has key {id: UID}
    
    fun init(ctx: &mut TxContext) {
        // Transfer the Nebula Police to the owner of the Bet DAPP
        transfer::share_object(NebulaPolice{
            id: object::new(ctx),
            addressIsRegistred: table::new(ctx),
            newBetFee: 1 * 1000000000,
            balance: balance::zero()
        });

        // Same for the Admin Capability //The publisher gets admin
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
        clock: &Clock,
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
        bet::create_bet(amountSuiPerUser, timeExpiring, clock, ctx);
    }

    public entry fun join_bet(
        user: &mut User,
        bet: &mut Bet,
        guess: u64
    ){
        // We grab the needed fields:
        let (user_owner, _, _, _, user_balance) = user.get_user_stats();
        let (amount_to_partecipate, _,_,_) = bet.get_bet_stats();

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


    public entry fun pick_winner(
        bet: &mut Bet,
        clock: &Clock,
        ctx: &mut TxContext
    ){
        // First of all we check if the bet is expired or in course
        let is_bet_expired = bet.check_bet_expired(clock);
        if(is_bet_expired){
            // If so, we generate the casual number they should guess
            let number_to_guess = generate_random_number_in_range_ten(ctx);
            // Helper to check if someone did the right choice
            let mut someone_got_the_exact_number: bool = false;
            // Self explanatory
            let number_of_partecipants = bet.get_partecipants_length();
            let mut i = 0;

            while(number_of_partecipants < i){
                let current_address = bet.get_address_partecipant(i);
                // We READ the current address guess
                let guess = bet.get_guess_per_address(current_address);
                if (guess == number_to_guess){
                    someone_got_the_exact_number = true;
                    let balance = bet.withdraw_balance();
                    let sui_coin = balance.into_coin(ctx);
                    transfer::public_transfer(sui_coin, current_address);
                    break
                };
                i = i + 1;
            };
            // Here is the "funny" part, if no one got the exact number, we revert and we add 15 min of waiting time,
            // so other users can join the bet again, and the funds grows and grows util someone guesses the right number.
            if (someone_got_the_exact_number == false){
                bet.increase_timer_fifteen_min(clock);
                return
            }
        }else {
            abort(E_BET_NOT_EXPIRED_YET)
        }
    }

    // ========= OnlyAdmin FUNCTIONS ======
    // only who have the NebulaAdmin Struct in the wallet can call this functions

    /// Function to add another Admin 
    public entry fun give_admin_capability(_: &NebulaAdmin, newAdmin: address, ctx: &mut TxContext){
        transfer::transfer( NebulaAdmin{ // no access control so anyone can call this function.
            id: object::new(ctx)
        }, newAdmin)
    }

    public entry fun withdraw_nebula_funds(_: &NebulaAdmin, police: &mut NebulaPolice, ctx: &mut TxContext){
        let sender = tx_context::sender(ctx);
        let nebula_balance = police.balance.withdraw_all();
        let into_sui = nebula_balance.into_coin(ctx);
        transfer::public_transfer(into_sui, sender);
    }


    // ========= PRIVATE FUNCTIONS ======

    fun generate_random_number_in_range_ten(ctx: &mut TxContext): u64 {
        let new_id = object::new(ctx);
        let id_to_bytes = object::uid_to_bytes(&new_id);
        let bytes = id_to_bytes[0] as u64;
        let number  = bytes % 10;
        let random_number = Random_number {
            id: new_id
        };
        let Random_number {
            id
        } = random_number ;
        object::delete(id);
        number
    }

    public fun generate_random_number_in_range_100(ctx: &mut TxContext): u64 {
        let new_id = object::new(ctx);
        let id_to_bytes = object::uid_to_bytes(&new_id);
        let bytes = id_to_bytes[0] as u64;
        let number  = bytes % 1000;
        let random_number = Random_number {
            id: new_id
        };
        let Random_number {
            id
        } = random_number ;
        object::delete(id);
        number
    }
    public fun generate_random_number_with_random_number(number: u64, ctx: &mut TxContext): u64 {
        let new_id = object::new(ctx);
        let id_to_bytes = object::uid_to_bytes(&new_id);
        let bytes = id_to_bytes[0] as u64;
        let number  = bytes % number;
        let random_number = Random_number {
            id: new_id
        };
        let Random_number {
            id
        } = random_number ;
        object::delete(id);
        number
    }
    #[test]
    public fun test_get_admin_has_no_access_control() {
        let random_address = @0xCAFE;
        let mut ctx = tx_context::dummy();
        let mut _police = NebulaPolice{
            id: object::new(&mut ctx),
            addressIsRegistred: table::new(&mut ctx),
            newBetFee: 1 * 1000000000,
            balance: balance::zero()
        };
        let admin =  NebulaAdmin{
            id: object::new(&mut ctx)
        };
        give_admin_capability(&admin, random_address, &mut ctx );

        transfer::share_object(_police);
        transfer::share_object(admin);

    }
}


