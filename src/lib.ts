

export interface NumberGenerator {
    int(min: number, max: number): number;
}


export class XorShiftNumberGenerator implements NumberGenerator {
    // cribbed without using much brain from
    // https://en.wikipedia.org/wiki/Xorshift

    private state: Uint32Array;

    constructor(seed: number) {
        this.state = new Uint32Array(1);
        this.state[0] = seed;
    }

    private next() {
        this.state[0] ^= this.state[0] << 13;
        this.state[0] ^= this.state[0] >> 17;
        this.state[0] ^= this.state[0] << 5;
    }

    public int(min: number, max: number): number {
        this.next();
        return min + this.state[0] % (1 + max - min);
    }
}
