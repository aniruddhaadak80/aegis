/**
 * AEGIS — shareable PRA configuration.
 *
 * The workbench's state is small (a handful of controls plus two scalars) and
 * entirely local, so a full configuration fits in a URL fragment. That makes
 * any "here is why this stack is stronger than that one" argument linkable
 * and reproducible — which matters, because the whole point of the app is that
 * the assumptions are inspectable.
 *
 * Encoding rules:
 *   - Only DEVIATIONS from the default stack are encoded. This keeps links
 *     short and keeps them stable if the defaults are ever retuned.
 *   - Probabilities are permille integers (0–1000) so a value survives a
 *     float round-trip exactly.
 *   - Malformed input is rejected wholesale. A bad link must degrade to the
 *     default stack rather than half-apply a configuration.
 */

export const DEFAULT_P_BASE = 0.6;
export const DEFAULT_BETA = 0.12;

/** The minimal shape of a control the codec needs. */
export interface ConfigSlot {
  id?: string;
  v: number;
  on: boolean;
  redundancy: number;
}

export type St = Record<string, ConfigSlot>;

/** float → integer permille */
const k = (x: number) => Math.round(x * 1000);
/** integer permille → float */
const unk = (x: number) => x / 1000;

/** Baseline the deviation encoding is measured against. */
export function defaultState(): St {
  return {};
}

export function encodeConfig(
  st: St,
  pBase: number,
  beta: number,
  base: St,
): string {
  const parts: string[] = [];

  if (Math.abs(pBase - DEFAULT_P_BASE) > 1e-9) parts.push(`p=${k(pBase)}`);
  if (Math.abs(beta - DEFAULT_BETA) > 1e-9) parts.push(`b=${k(beta)}`);

  const dev: string[] = [];
  for (const id of Object.keys(st)) {
    const d = base[id];
    const s = st[id];
    if (!d || !s) continue;
    if (
      Math.abs(s.v - d.v) > 1e-9 ||
      s.on !== d.on ||
      s.redundancy !== d.redundancy
    ) {
      dev.push(`${id}.${k(s.v)}.${s.on ? 1 : 0}.${s.redundancy}`);
    }
  }
  if (dev.length) parts.push(`d=${dev.join(",")}`);

  return parts.join("&");
}

export interface DecodedConfig {
  pBase: number;
  beta: number;
  state: St;
}

/**
 * Parse a fragment produced by `encodeConfig`. `validIds` is the set of control
 * ids the codec will accept; anything outside it makes the whole parse fail.
 */
export function decodeConfig(
  fragment: string,
  validIds: ReadonlySet<string>,
): DecodedConfig | null {
  const raw = fragment.replace(/^#/, "");
  if (!raw) return null;

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(raw);
  } catch {
    return null;
  }

  let pBase = DEFAULT_P_BASE;
  let beta = DEFAULT_BETA;

  const p = params.get("p");
  if (p !== null) {
    const n = Number(p);
    if (!Number.isFinite(n) || n < 0 || n > 1000) return null;
    pBase = unk(n);
  }

  const b = params.get("b");
  if (b !== null) {
    const n = Number(b);
    if (!Number.isFinite(n) || n < 0 || n > 1000) return null;
    beta = unk(n);
  }

  const state: St = {};

  const d = params.get("d");
  if (d) {
    for (const chunk of d.split(",")) {
      const fields = chunk.split(".");
      if (fields.length !== 4) return null;
      const [id, vRaw, onRaw, redRaw] = fields;

      if (!id || !validIds.has(id)) return null;

      const v = Number(vRaw);
      const on = Number(onRaw);
      const red = Number(redRaw);

      if (!Number.isFinite(v) || v < 0 || v > 1000) return null;
      if (on !== 0 && on !== 1) return null;
      if (!Number.isInteger(red) || red < 1 || red > 9) return null;

      state[id] = { id, v: unk(v), on: on === 1, redundancy: red };
    }
  }

  return { pBase, beta, state };
}

/** True when `fragment` is a fragment this codec produced (or a clean no-op). */
export function isEncodable(fragment: string, validIds: ReadonlySet<string>) {
  return decodeConfig(fragment, validIds) !== null;
}
