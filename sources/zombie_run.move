module nebula::zombie_run{ 

    use sui::balance::{Self, Balance};
    use sui::sui::{SUI};
    use sui::coin::{value, Coin, split, Self};
    use nebula::nebula::{generate_random_number_in_range_100,
    generate_random_number_with_random_number};

    // fee constants
    const ZOMBIE_PLAY_FEE: u64 = 100000000; // 0.1 sui token

    // error constants
    const INSUFFICIENT_FUNDS: u64 = 201; // user does not have enough sui tokens to run this function.

    // idea; zombie run,
    // a user sets how many meters they are expecting to get before the zombies eat him, 
    // the idea would be that the user runs away from the zombies, the longer the run the 
    // higher the multiplier goes. this would be a graphics type of thing but we could always
    // upgrade the graphics over time.

    // the most important part of this is the logic and how the user 
    // interacts with the package as well as determining the winner.

    public struct Zombie_pool has key, store { 
        id: UID,
        pool_balanace: Balance<SUI>,
        devs_wallet: address
        // may need more information for setting and determining winners.
    }

    fun init(ctx: &mut TxContext) {
        let deployer = tx_context::sender(ctx);
        let zombie_pool = Zombie_pool {
            id: object::new(ctx),
            pool_balanace: balance::zero(),
            devs_wallet: deployer,

        }; // should this be public?
        transfer::share_object(zombie_pool);

    }

    public fun play_zombie_run(distance: u64, bet_amount: u64, coin: &mut Coin<SUI>, 
    zombie_pool: &mut Zombie_pool, ctx: &mut TxContext) 
    {
        let balance = value(coin);
        if(balance < bet_amount + ZOMBIE_PLAY_FEE) {
            abort(INSUFFICIENT_FUNDS)
        };
        let transaction_amount = split(coin, bet_amount, ctx);
        let fee_amount = split(coin, ZOMBIE_PLAY_FEE, ctx);

        let transaction_into_balance = coin::into_balance(transaction_amount);
        zombie_pool.pool_balanace.join(transaction_into_balance);

        let deployer = zombie_pool.devs_wallet;

        transfer::public_transfer(fee_amount, deployer);
        // game logic
        let mut inital_random_number_one = generate_random_number_in_range_100(ctx);
        let mut final_random_number_one = generate_random_number_with_random_number(inital_random_number_one, ctx);

        let mut inital_random_number_two = generate_random_number_in_range_100(ctx);
        let mut final_random_number_two = generate_random_number_with_random_number(inital_random_number_two, ctx);

        let mut final_random_number = final_random_number_two + final_random_number_one /2;
        /// below is not tested //TODO
        
        /// perhaps, we should make it so we call multiple random numbers to increase the risk,
        /// we should have a random number be called 4 times and those 4 numbers should be * to eachother and then divided by 4? 
        let mut pool_has_enough = calculate_pool_has_enough_for_win(final_random_number, bet_amount, zombie_pool);

        while(pool_has_enough == false) { // while it is false, it will re run.
            inital_random_number_one = generate_random_number_in_range_100(ctx);
            final_random_number_one = generate_random_number_with_random_number(inital_random_number_one, ctx);
            inital_random_number_two = generate_random_number_in_range_100(ctx);
            final_random_number_two = generate_random_number_with_random_number(inital_random_number_two, ctx);
            final_random_number = final_random_number_two + final_random_number_one /2;
            pool_has_enough = calculate_pool_has_enough_for_win(final_random_number, bet_amount, zombie_pool);
        }
        /// up until this point, we are only doing checks to see if the user wins, will he have enough, and if not
        /// we call a new number to ensur if they win, we do have enough to pay them out. 
        /// its fairness with expectation...

        //TODO check if the user won and then convert balance to coins and transfer winnings.
        // we should also do a smaller fee for the user to receive the money. 

    }

    fun calculate_pool_has_enough_for_win(random_number: u64, bet_amount: u64, zombie_pool: &mut Zombie_pool): bool {
        let pool_balance = balance::value(&zombie_pool.pool_balanace);
        let random_number_into_mulitplier = random_number % 100; // making the user go only up to a possible of 10x, user can bet 1.5x or less. 
        let potenital_winnings = random_number_into_mulitplier * bet_amount;
        if(potenital_winnings < pool_balance) {
            return true
        };
        return false
    }
}