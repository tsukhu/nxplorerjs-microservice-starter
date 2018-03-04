/**
 * Security Service Interface
 * Reads the RSA private key and provides the value
 */
interface ISecurity {
  getPrivateKey(): any;
}

export default ISecurity;
