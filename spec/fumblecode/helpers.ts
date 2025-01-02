
interface AsymmetricMatcher {
    asymmetricMatch(actual: any): boolean
}


export function aFumbleNumber(expected: number): AsymmetricMatcher {
    return {
        asymmetricMatch: (actual) => actual.asNumber && actual.asNumber() === expected,
    }
}

export function aFumbleList(expected: number[]): AsymmetricMatcher {
    return {
        asymmetricMatch: (actual) => {
            return actual.items
              && (actual.items as any[]).every((item, index) =>
                                      item.asNumber() === expected[index]);
        }
    }
}
