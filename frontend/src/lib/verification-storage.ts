// In-memory storage for verification codes
// In production, use Redis or database for scalability and persistence

interface VerificationData {
  code: string;
  expiresAt: Date;
}

class VerificationStorage {
  private codes: Map<string, VerificationData>;

  constructor() {
    this.codes = new Map();
  }

  set(email: string, code: string, expiresAt: Date): void {
    this.codes.set(email, { code, expiresAt });
  }

  get(email: string): VerificationData | undefined {
    const data = this.codes.get(email);

    // Check if code has expired
    if (data && data.expiresAt < new Date()) {
      this.codes.delete(email);
      return undefined;
    }

    return data;
  }

  delete(email: string): void {
    this.codes.delete(email);
  }

  verify(email: string, code: string): boolean {
    const data = this.get(email);

    if (!data) {
      return false;
    }

    if (data.code !== code) {
      return false;
    }

    // Code is valid, delete it so it can't be reused
    this.delete(email);
    return true;
  }
}

// Singleton instance
export const verificationStorage = new VerificationStorage();