module nebula::bet{

    use sui::sui::{SUI};
    use sui::balance::{Self, Balance};
    use sui::table::{Self, Table};
    use sui::clock::{Clock};

    // Struct of a Bet
    public struct Bet has key, store{
        id: UID,
        guessMe: u64, // The number that you should guess
        amountToPartecipate: u64, // Amount of sui to enter the bet
        partecipants: vector<address>, // All the addresses of the partecipants
        guessPerAddress: Table<address, u64>, // Mapping of addresses and their guess
        createdAt: u64, // Created at (Time in ms)
        endsAt: u64, // Bet ends at (Time in ms)
        funds: Balance<SUI> // Balance of the bet itself
    }

    // ======== PUBLIC FUNCTIONS =========
    public fun create_bet(
        amountSuiPerUser: u64,
        duration: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ){
        let createdAt = clock.timestamp_ms();
        let endsAt = createdAt + duration;
        transfer::share_object(Bet {
            id: object::new(ctx),
            guessMe: 0,
            amountToPartecipate: amountSuiPerUser * 1000000000, // In MIST
            partecipants: vector::empty(),
            guessPerAddress: table::new(ctx),
            createdAt: createdAt,
            endsAt: endsAt,
            funds: balance::zero()
        });
    }

    public fun pay_and_entry(bet: &mut Bet, balance: Balance<SUI>, guess: u64, user: address){
        bet.funds.join(balance);
        bet.partecipants.push_back(user);
        bet.guessPerAddress.add(user, guess);
    }

    public fun withdraw_balance(bet: &mut Bet): Balance<SUI>{
        bet.funds.withdraw_all()
    }

    public fun increase_timer_fifteen_min(bet: &mut Bet, clock: &Clock){
        let current_time = clock.timestamp_ms();
        let new_expire = current_time + 900000; // We add 900000 ms to the current time (15 min).
        bet.endsAt = new_expire;
    }

    // ========= GETTERS ============
    public fun get_bet_stats(bet: &Bet): (u64, u64, u64, u64){
        let amount_sui = bet.funds.value();
        (bet.amountToPartecipate, bet.createdAt, bet.endsAt, amount_sui)
    }

    public fun get_guess_per_address(bet: &Bet, partecipant: address): &u64{
        bet.guessPerAddress.borrow(partecipant)
    }

    public fun get_address_partecipant(bet: &Bet, index: u64): address {
        bet.partecipants[index]
    }

    public fun get_partecipants_length(bet: &Bet): u64 {
        bet.partecipants.length()
    }

    public fun user_already_in(bet: &Bet, sender: address): bool{
        bet.guessPerAddress.contains(sender)
    }

    public fun check_bet_expired(bet: &Bet, clock: &Clock): bool{
        let (_, _, ends_at,_) = get_bet_stats(bet);
        let currentTime = clock.timestamp_ms();
        if(ends_at > currentTime){
            return false
        };
        return true
    }

}