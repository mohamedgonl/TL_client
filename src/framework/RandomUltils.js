


var RandomUtils = RandomUtils || {};
RandomUtils.createRandom = function (quantity_of_nums) {
    var milliseconds = new Date().getMilliseconds();
    return Math.floor(milliseconds * quantity_of_nums / 1000);
}

// Define the Murmur3Hash function
RandomUtils.MurmurHash3 = function (string) {
    let i = 0;
    for (i, hash = 1779033703 ^ string.length; i < string.length; i++) {
        let bitwise_xor_from_character = hash ^ string.charCodeAt(i);
        hash = Math.imul(bitwise_xor_from_character, 3432918353);
        hash = hash << 13 | hash >>> 19;
    } return () => {
        // Return the hash that you can use as a seed
        hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
        hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
        return (hash ^= hash >>> 16) >>> 0;
    }
}
RandomUtils.JenkinsSimpleFast32 = function (seed_1, seed_2, seed_3, seed_4) {
    return () => {
        seed_1 |= 0; seed_2 |= 0; seed_3 |= 0; seed_4 |= 0;
        let t = seed_1 - (seed_2 << 27 | seed_2 >>> 5) | 0;
        seed_1 = seed_2 ^ (seed_3 << 17 | seed_3 >>> 15);
        seed_2 = seed_3 + seed_4 | 0;
        seed_3 = seed_4 + t | 0;
        seed_4 = seed_1 + t | 0;
        return (seed_4 >>> 0) / 4294967296;
    }
}

RandomUtils.hashCode = function (strInput) {
    let hash = 0;
    let str = strInput.toString();
    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    cc.log("HASH : " + hash)

    return hash;
}

RandomUtils.generateRandomBySeed = function (min = 0, max = 1, seed, isInteger = false) {
    cc.log(min + " " +  max + " " +  seed + " " + isInteger)
    let randomNumber = Math.abs(Math.sin(RandomUtils.hashCode(seed)));
    const scaledRandom = min + randomNumber * (max - min);
    let rd = isInteger ? Math.round(scaledRandom) : scaledRandom;
    cc.log("RANDOM : " + rd)
    return rd;
}



