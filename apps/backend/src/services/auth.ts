import { ethers } from "ethers";
import { prisma } from "../db/prisma";

export interface AuthMessage {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
}

export class AuthService {
  /**
   * Generate a nonce for wallet authentication
   */
  static generateNonce(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Create authentication message for wallet signing
   */
  static createAuthMessage(address: string, nonce: string): string {
    const domain = process.env.DOMAIN || "localhost:3000";
    const uri = process.env.APP_URL || "http://localhost:3000";
    const issuedAt = new Date().toISOString();

    return `${domain} wants you to sign in with your Ethereum account:
${address}

Sign in to Praxis - Social Trading for Polymarket

URI: ${uri}
Version: 1
Chain ID: 137
Nonce: ${nonce}
Issued At: ${issuedAt}`;
  }

  /**
   * Verify wallet signature
   */
  static async verifySignature(
    message: string,
    signature: string,
    expectedAddress: string
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  /**
   * Authenticate user with wallet signature
   * Returns user if signature is valid
   */
  static async authenticateWithSignature(
    walletAddress: string,
    message: string,
    signature: string
  ) {
    // Verify signature
    const isValid = await this.verifySignature(message, signature, walletAddress);
    
    if (!isValid) {
      throw new Error("Invalid signature");
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: { stats: true },
    });

    // If user doesn't exist, they need to register first
    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Generate authentication token (simplified - in production use JWT)
   */
  static generateToken(walletAddress: string): string {
    // For MVP, we'll just use the wallet address as token
    // In production, implement proper JWT with expiration
    return walletAddress.toLowerCase();
  }

  /**
   * Verify authentication token
   */
  static async verifyToken(token: string) {
    // For MVP, token is just the wallet address
    const user = await prisma.user.findUnique({
      where: { walletAddress: token.toLowerCase() },
    });

    return user;
  }
}
