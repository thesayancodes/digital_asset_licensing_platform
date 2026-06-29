# Security Policy — Lumina

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: security@lumina.example.com
3. Include: description, reproduction steps, potential impact
4. We will respond within 48 hours

## Smart Contract Security

### Access Control
- All privileged operations require `require_auth()` from the admin or asset owner
- Admin role is set during `initialize()` and can only be transferred by the current admin
- RBAC is enforced at the contract level — frontend checks are defense-in-depth only

### Storage Security
- **Instance storage** for admin/config data — tied to contract lifecycle
- **Persistent storage** for asset/license records — survives archival, restorable
- TTL extension is permissionless; do NOT rely on TTL for security-sensitive expiration
- Custom timestamp-based expiration is used for license duration enforcement

### Inter-Contract Communication
- LicenseManager validates assets via AssetRegistry before any license operation
- Contract addresses are set during initialization and can only be updated by admin
- Cross-contract calls inherit the caller's authorization context

### Input Validation
- All numeric inputs are bounds-checked (royalty_bps ≤ 10000, price > 0, etc.)
- String inputs are length-limited to prevent storage bloat
- Asset IDs and license IDs are sequentially generated — no user-controlled keys

### Upgrade Strategy
- Contracts support WASM upgrade via `env.deployer().update_current_contract_wasm()`
- Only admin can trigger upgrades
- Version number is incremented on each upgrade for tracking

## Frontend Security

### Wallet Integration
- **Never handle or store private keys** — all signing is delegated to the wallet
- Transaction XDR is displayed to the user before signing
- Network passphrase is validated before transaction submission

### Transaction Safety
- All transactions are simulated before submission to catch errors early
- Failed simulations are surfaced to the user with clear error messages
- Transaction lifecycle is tracked end-to-end (Building → Simulating → Signing → Submitting → Confirmed/Failed)

### Data Handling
- No sensitive data is stored in localStorage (only wallet preference, theme, network)
- Contract state is read directly from the blockchain — no centralized database
- Event data is ephemeral and polled from RPC (24-hour retention)

### Environment Variables
- Server-side secrets (deployer keys) are NEVER prefixed with `NEXT_PUBLIC_`
- All client-exposed env vars use the `NEXT_PUBLIC_` prefix
- `.env.example` documents all required variables without values

## Dependencies

- All dependencies are pinned to specific versions
- `npm audit` is run in CI pipeline
- Rust dependencies use `cargo audit` (recommended as pre-commit hook)
- No dependencies with known critical vulnerabilities are accepted

## Network Security

- All RPC communication uses HTTPS
- CORS is configured on the frontend (Next.js defaults)
- No custom API routes handle user authentication — all auth is on-chain

## Deployment

- CI/CD pipeline includes lint, build, and test gates
- Testnet deployment is automated; mainnet requires manual approval
- Contract WASM hashes are logged for audit trail
- Deployment scripts validate network before executing
