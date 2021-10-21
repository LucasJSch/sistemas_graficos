// NOTICE 2020-04-18
// Please see the comments below about why this is not a great PRNG.

// Read summary by @bryc here:
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md

// Have a look at js-arbit which uses Alea:
// https://github.com/blixt/js-arbit

/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
class Random {
    constructor(seed) {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) {
            this.seed += 2147483646;
        }
    }

    // Returns a pseudo-random value between 1 and 2^32 - 2.
    next() {
        return this.seed = this.seed * 16807 % 2147483647;
    }

    // Returns a pseudo-random floating point number in range [0, 1).
    nextFloat() {
        return (this.next() - 1) / 2147483646;
    }
}