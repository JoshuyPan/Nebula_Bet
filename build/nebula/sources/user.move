module nebula::user{

    use std::string::{Self, String};

    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::sui::{Self, SUI};

    // Struct for the users
    public struct User has key, store{
        id: UID,
        owner: address,
        betWin: u64,
        betLost: u64,
        grade: String,
        balance: Balance<SUI>
    }

    // ======== PUBLIC FUNCTIONS =========
    public fun new_user(ctx: &mut TxContext): User {
        User{
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            betWin: 0,
            betLost: 0,
            grade: b"Rookie".to_string(),
            balance: balance::zero()
        }
    }

    public fun deposit(user: &mut User, sui: Coin<SUI>){
        let balance_to_add = coin::into_balance(sui);
        user.balance.join(balance_to_add);
    }

    public fun withdraw(user: &mut User, ctx: &mut TxContext){
        assert!(user.owner == tx_context::sender(ctx));
        let user_balance = user.balance.withdraw_all();
        let balance_into_sui = user_balance.into_coin(ctx);
        transfer::public_transfer(balance_into_sui, tx_context::sender(ctx))
    }

    public fun split_balance(user: &mut User, amount: u64): Balance<SUI>{
        user.balance.split(amount)
    }

    // ======= GETTERS =========
    public fun get_user_stats(user: &User): (address, u64, u64, String, u64){
        (user.owner, user.betWin, user.betLost, user.grade, balance::value(&user.balance))
    }
}