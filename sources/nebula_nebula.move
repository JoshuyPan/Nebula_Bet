module nebula::nebula{

    use std::string::{Self, String};

    use sui::table::{Self, Table};
    use sui::sui::{SUI};
    use sui::balance::{Self, Balance};

    // Capability for admins
    public struct NebulaAdmin has key {id: UID}
    
    fun init(ctx: &mut TxContext) {
        transfer::transfer(NebulaAdmin{id: object::new(ctx)}, tx_context::sender(ctx));
    }

    // ======== PUBLIC FUNCTIONS ========= 


    

    
}

