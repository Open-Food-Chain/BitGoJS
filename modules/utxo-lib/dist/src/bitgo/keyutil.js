"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKeyBufferFromECPair = exports.privateKeyBufferToECPair = void 0;
/**
 * @prettier
 */
const BigInteger = require('bigi');
const ECPair = require('../ecpair');
/**
 * Create an ECPair from the raw private key bytes
 * @param {Buffer} buffer - Private key for the ECPair. Must be exactly 32 bytes.
 * @param {Network} [network] - Network for the ECPair. Defaults to bitcoin.
 * @return {ECPair}
 */
function privateKeyBufferToECPair(buffer, network) {
    if (!Buffer.isBuffer(buffer) || buffer.length !== 32) {
        throw new Error('invalid private key buffer');
    }
    const d = BigInteger.fromBuffer(buffer);
    return new ECPair(d, null, { network });
}
exports.privateKeyBufferToECPair = privateKeyBufferToECPair;
/**
 * Get the private key as a 32 bytes buffer. If it is smaller than 32 bytes, pad it with zeros
 * @param {ECPair} ecPair
 * @return {Buffer} 32 bytes
 */
function privateKeyBufferFromECPair(ecPair) {
    if (!(ecPair instanceof ECPair)) {
        throw new TypeError(`invalid argument ecpair`);
    }
    if (!ecPair.d)
        throw new Error('Missing private key');
    return ecPair.d.toBuffer(32);
}
exports.privateKeyBufferFromECPair = privateKeyBufferFromECPair;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5dXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9iaXRnby9rZXl1dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBOztHQUVHO0FBQ0gsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUVwQzs7Ozs7R0FLRztBQUNILFNBQWdCLHdCQUF3QixDQUFDLE1BQWdCLEVBQUUsT0FBZ0I7SUFDekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxFQUFFLEVBQUU7UUFDcEQsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0tBQy9DO0lBRUQsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFQRCw0REFPQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQiwwQkFBMEIsQ0FBQyxNQUFxQjtJQUM5RCxJQUFJLENBQUMsQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLEVBQUU7UUFDL0IsTUFBTSxJQUFJLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRXRELE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQVJELGdFQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV0d29yayB9IGZyb20gXCIuLi9uZXR3b3JrVHlwZXNcIjtcblxuLyoqXG4gKiBAcHJldHRpZXJcbiAqL1xuY29uc3QgQmlnSW50ZWdlciA9IHJlcXVpcmUoJ2JpZ2knKTtcbmNvbnN0IEVDUGFpciA9IHJlcXVpcmUoJy4uL2VjcGFpcicpO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBFQ1BhaXIgZnJvbSB0aGUgcmF3IHByaXZhdGUga2V5IGJ5dGVzXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyIC0gUHJpdmF0ZSBrZXkgZm9yIHRoZSBFQ1BhaXIuIE11c3QgYmUgZXhhY3RseSAzMiBieXRlcy5cbiAqIEBwYXJhbSB7TmV0d29ya30gW25ldHdvcmtdIC0gTmV0d29yayBmb3IgdGhlIEVDUGFpci4gRGVmYXVsdHMgdG8gYml0Y29pbi5cbiAqIEByZXR1cm4ge0VDUGFpcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByaXZhdGVLZXlCdWZmZXJUb0VDUGFpcihidWZmZXI6IEJ1ZmZlcltdLCBuZXR3b3JrOiBOZXR3b3JrKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZmZlcikgfHwgYnVmZmVyLmxlbmd0aCAhPT0gMzIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcHJpdmF0ZSBrZXkgYnVmZmVyJyk7XG4gIH1cblxuICBjb25zdCBkID0gQmlnSW50ZWdlci5mcm9tQnVmZmVyKGJ1ZmZlcik7XG4gIHJldHVybiBuZXcgRUNQYWlyKGQsIG51bGwsIHsgbmV0d29yayB9KTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHByaXZhdGUga2V5IGFzIGEgMzIgYnl0ZXMgYnVmZmVyLiBJZiBpdCBpcyBzbWFsbGVyIHRoYW4gMzIgYnl0ZXMsIHBhZCBpdCB3aXRoIHplcm9zXG4gKiBAcGFyYW0ge0VDUGFpcn0gZWNQYWlyXG4gKiBAcmV0dXJuIHtCdWZmZXJ9IDMyIGJ5dGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcml2YXRlS2V5QnVmZmVyRnJvbUVDUGFpcihlY1BhaXI6IHR5cGVvZiBFQ1BhaXIpIHtcbiAgaWYgKCEoZWNQYWlyIGluc3RhbmNlb2YgRUNQYWlyKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYGludmFsaWQgYXJndW1lbnQgZWNwYWlyYCk7XG4gIH1cblxuICBpZiAoIWVjUGFpci5kKSB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgcHJpdmF0ZSBrZXknKTtcblxuICByZXR1cm4gZWNQYWlyLmQudG9CdWZmZXIoMzIpO1xufVxuIl19