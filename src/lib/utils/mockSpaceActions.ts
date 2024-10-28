import type { Transaction, TransactionOutput, SpaceAction } from '$lib/types/transaction';

export function addMockSpaceActions(transactions: Transaction[]): Transaction[] {
    const actionTypes: Array<SpaceAction['type']> = ['bid', 'register', 'transfer', 'reserve'];
    const testAddresses = [
        'tb1q55ecnuunvpue2tpz06ehyc6ms6y9xhrl9rak7z',
        'tb1p2tnylsra8fntfphs0xhrvyus8avr5amq8lfketszjyxe8jl4zzusyyyfrh',
        'tb1qlw09ycnp3qgqw9alqgx93ed7cg5kmnyucd6knx'
    ];

    return transactions.map(tx => {
        const modifiedTx = { ...tx };

        if (Math.random() < 0.7) {
            const numOutputsToModify = Math.min(
                Math.floor(Math.random() * 2) + 1,
                modifiedTx.outputs.length
            );

            const outputIndices = new Set<number>();
            while (outputIndices.size < numOutputsToModify) {
                outputIndices.add(Math.floor(Math.random() * modifiedTx.outputs.length));
            }

            modifiedTx.outputs = modifiedTx.outputs.map((output, idx) => {
                if (!outputIndices.has(idx)) return output;

                const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
                const spaceAction: SpaceAction = {
                    type: actionType,
                    name: "fakeMockName"
                };

                if (actionType === 'bid') {
                    spaceAction.value = Math.floor(Math.random() * 1000000);
                } else if (actionType === 'transfer') {
                    spaceAction.address = testAddresses[Math.floor(Math.random() * testAddresses.length)];
                }

                return {
                    ...output,
                    space_action: spaceAction
                };
            });
        }

        return modifiedTx;
    });
}

export function addMockSpaceActionsToTransaction(transaction: Transaction): Transaction {
    const modifiedTx = { ...transaction };

    // 70% chance to have space actions for this transaction
    if (Math.random() < 0.7) {
        // Randomly select 1 or 2 outputs to modify
        const numOutputsToModify = Math.min(
            Math.floor(Math.random() * 2) + 1,
            modifiedTx.outputs.length
        );

        const outputIndices = new Set<number>();
        while (outputIndices.size < numOutputsToModify) {
            outputIndices.add(Math.floor(Math.random() * modifiedTx.outputs.length));
        }

        modifiedTx.outputs = modifiedTx.outputs.map((output, idx) => {
            if (!outputIndices.has(idx)) return output;
            return {
                ...output,
                space_action: createMockSpaceAction()
            };
        });
    }

    return modifiedTx;
}

function createMockSpaceAction(): SpaceAction {
    const actionTypes: Array<SpaceAction['type']> = ['bid', 'register', 'transfer', 'reserve'];
    const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];

    const spaceAction: SpaceAction = {
        type: actionType,
        name: "fakeMockName"
    };

    if (actionType === 'bid') {
        spaceAction.value = Math.floor(Math.random() * 1000000);
    } else if (actionType === 'transfer') {
        spaceAction.address = 'tb1q55ecnuunvpue2tpz06ehyc6ms6y9xhrl9rak7z';
    }

    return spaceAction;
}
