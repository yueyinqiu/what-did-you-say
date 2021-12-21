import assert from "assert";

export default class Algorithm {
    private offsetFactorCount: number;
    private offsetFactors: Array<number> | null;
    private checkByte: number | null;

    constructor(offsetFactorCount = 2, keepSame = false) {
        if (offsetFactorCount < 1 || offsetFactorCount > 0b1111) {
            throw new RangeError(
                "offsetFactorCount should not be larger than 0b1111(127) or be less than 1.");
        }
        this.offsetFactorCount = offsetFactorCount;
        if (keepSame) {
            this.offsetFactors = this.generateNewOffsetFactors();
            this.checkByte = this.generateNewCheckByte(offsetFactorCount);
        }
        else {
            this.offsetFactors = null;
            this.checkByte = null;
        }
    }

    generateNewOffsetFactors() {
        let offsetFactors = new Array<number>(this.offsetFactorCount);
        for (let i = 0; i < this.offsetFactorCount; i++) {
            offsetFactors[i] = Math.floor(Math.random() * (0b1111_1111 + 1));
            // 0b0000_0000 to 0b1111_1111
        }
        return offsetFactors;
    }

    generateNewCheckByte(offsetFactorCount: number) {
        let checkByte = Math.floor(Math.random() * (0b00001111 + 1));
        // 0b0000_0000 to 0b0000_1111
        return (offsetFactorCount << 4) + checkByte;
        // 0bOSFC_0000 to 0bOSFC_1111 (OSFC: offsetFactorCount)
    }

    encrypt(plaintext: Uint8Array) {
        let offsetFactors: number[];
        let checkByte: number;
        if (this.checkByte !== null) {
            assert(this.offsetFactors !== null);

            checkByte = this.checkByte;
            offsetFactors = this.offsetFactors;
        }
        else {
            checkByte = this.generateNewCheckByte(this.offsetFactorCount);
            offsetFactors = this.generateNewOffsetFactors();
        }

        let ciphertext = new Uint8Array(plaintext.length + this.offsetFactorCount + 2);
        // AIM: (checkByte-CB), (offsetFactor1-F1), (F2), (content1-C1), (C2), (C3), (CB)

        let ciphertextI = 0;
        ciphertext[ciphertextI] = checkByte;
        ciphertextI++;
        // CB, _, _, _, _, _, _

        for (let i = 0; i < this.offsetFactorCount; i++, ciphertextI++)
            ciphertext[ciphertextI] = offsetFactors[i];
        // CB, F1, F2, _, _, _, _

        for (let i = 0; i < plaintext.length; i++, ciphertextI++) {
            let factor = offsetFactors[ciphertextI % this.offsetFactorCount];
            ciphertext[ciphertextI] = (plaintext[i] + factor) % 256;
        }
        // CB, F1, F2, C1, C2, C3, _

        let factor = offsetFactors[ciphertextI % this.offsetFactorCount];
        ciphertext[ciphertextI] = (checkByte + factor) % 256;
        // textI++;
        // CB, F1, F2, C1, C2, C3, CB

        return ciphertext;
    }

    decrypt(ciphertext: Uint8Array) {
        let ciphertextI = 0;
        let checkByte = ciphertext[ciphertextI];
        ciphertextI++;
        let offsetFactorCount = checkByte >> 4;
        let textLength = ciphertext.length;

        let contentLength = textLength - offsetFactorCount - 2;
        if (offsetFactorCount === 0 || contentLength < 0)
            return null;

        let offsetFactors = new Array<number>(offsetFactorCount);
        for (let i = 0; i < offsetFactorCount; i++, ciphertextI++) {
            offsetFactors[i] = ciphertext[ciphertextI];
        }

        let lastPosition = ciphertext.length - 1;
        let lastByte = ciphertext[lastPosition];
        let factor = offsetFactors[lastPosition % offsetFactorCount];
        if ((checkByte + factor) % 256 !== lastByte)
            return null;

        let result = new Uint8Array(contentLength);
        for (let i = 0; i < contentLength; i++, ciphertextI++) {
            let factor = offsetFactors[ciphertextI % this.offsetFactorCount];
            result[i] = (ciphertext[ciphertextI] - factor + 256) % 256;
        }
        return result;
    }
}