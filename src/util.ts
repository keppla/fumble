

export function range(start: number, end: number): number[] {
    let result = [];
    for (let i = start; i < end; i += 1) {
        result.push(i);
    }
    return result;
}


export function names(map: {[name: string]: any}): string {
    return Object
            .entries(map)
            .filter(([_, value]) => value)
            .map(([name, _]) => name)
            .join(' ')
}
