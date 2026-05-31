/** XOR + base64 obfuscation — not secret from the client bundle, only avoids plain text in source. */
const ENCODED = "DhcBQlNDEBFAUUZE";

function decodeKey(): string {
  return String.fromCharCode(99, 115, 50, 48, 50, 55);
}

export function getExpectedPassphrase(): string {
  const key = decodeKey();
  const bytes = Uint8Array.from(atob(ENCODED), (c) => c.charCodeAt(0));
  return String.fromCharCode(
    ...[...bytes].map((b, i) => b ^ key.charCodeAt(i % key.length)),
  );
}
