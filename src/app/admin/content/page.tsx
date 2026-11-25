"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Save, Search } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { useAdminToast } from "@/components/admin/AdminToastProvider";
import { inputClass, labelClass } from "@/components/admin/form-styles";
import { labelTrees } from "@/lib/labels";
import { encodeKey, decodeKey, type Section } from "@/lib/site-content-shared";
import enMessages from "../../../../messages/en.json";
import esMessages from "../../../../messages/es.json";

type Locale = "en" | "es";
type Kind = "text" | "lines" | "sections";
type Value = string | string[] | Section[];

interface Entry {
  path: string;
  kind: Kind;
  group: string;
  defaults: Record<Locale, Value>;
}

function titleCase(s: string) {
  return s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getAt(tree: unknown, parts: string[]): unknown {
  let cur = tree;
  for (const p of parts) {
    if (typeof cur !== "object" || !cur) return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function collect(
  trees: Record<Locale, unknown>,
  prefix: string,
  groupPrefix: string,
  out: Entry[]
) {
  const walk = (node: unknown, path: string[]) => {
    if (typeof node !== "object" || !node || Array.isArray(node)) return;
    for (const [k, v] of Object.entries(node)) {
      const next = [...path, k];
      const full = next.join(".");
      const top = next.slice(0, next[0] === "pages" ? 2 : 1).join(".");
      const group = `${groupPrefix}${titleCase(top)}`;
      const get = (l: Locale) => (getAt(trees[l], next) ?? v) as Value;
      if (typeof v === "string") {
        out.push({ path: prefix + full, kind: "text", group, defaults: { en: get("en"), es: get("es") } });
      } else if (Array.isArray(v)) {
        const isObj = v.length > 0 && typeof v[0] === "object";
        out.push({
          path: prefix + full,
          kind: isObj ? "sections" : "lines",
          group,
          defaults: { en: get("en"), es: get("es") },
        });
      } else {
        walk(v, next);
      }
    }
  };
  walk(trees.en, []);
}

function buildEntries(): Entry[] {
  const out: Entry[] = [];
  collect({ en: enMessages, es: esMessages }, "", "", out);
  collect({ en: labelTrees.en, es: labelTrees.es }, "labels.", "Labels: ", out);
  return out;
}

const same = (a: Value, b: Value) => JSON.stringify(a) === JSON.stringify(b);

export default function AdminContentPage() {
  const entries = useMemo(() => buildEntries(), []);
  const groups = useMemo(() => [...new Set(entries.map((e) => e.group))], [entries]);
  const [group, setGroup] = useState(groups[0]);
  const [query, setQuery] = useState("");
  const [values, setValues] = useState<Record<Locale, Record<string, Value>>>({ en: {}, es: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useAdminToast();

  useEffect(() => {
    adminFetch<Record<string, Record<string, unknown>>>("/api/admin/settings")
      .then((res) => {
        if (!res.success) return;
        const content = (res.data.content ?? {}) as Partial<Record<Locale, Record<string, Value>>>;
        const next: Record<Locale, Record<string, Value>> = { en: {}, es: {} };
        for (const l of ["en", "es"] as const) {
          for (const [k, v] of Object.entries(content[l] ?? {})) next[l][decodeKey(k)] = v;
        }
        setValues(next);
      })
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return entries.filter(
        (e) =>
          e.path.toLowerCase().includes(q) ||
          JSON.stringify(e.defaults).toLowerCase().includes(q) ||
          JSON.stringify(values.en[e.path] ?? "").toLowerCase().includes(q)
      );
    }
    return entries.filter((e) => e.group === group);
  }, [entries, group, query, values]);

  const current = (e: Entry, l: Locale): Value => values[l][e.path] ?? e.defaults[l];
  const isEdited = (e: Entry, l: Locale) =>
    values[l][e.path] !== undefined && !same(values[l][e.path], e.defaults[l]);
  const setValue = (e: Entry, l: Locale, v: Value) =>
    setValues((prev) => ({ ...prev, [l]: { ...prev[l], [e.path]: v } }));
  const reset = (e: Entry, l: Locale) =>
    setValues((prev) => {
      const copy = { ...prev[l] };
      delete copy[e.path];
      return { ...prev, [l]: copy };
    });

  const changedCount = entries.reduce(
    (n, e) => n + (["en", "es"] as const).filter((l) => isEdited(e, l)).length,
    0
  );

  const save = async () => {
    setSaving(true);
    const content: Record<Locale, Record<string, Value>> = { en: {}, es: {} };
    for (const e of entries) {
      for (const l of ["en", "es"] as const) {
        if (isEdited(e, l)) content[l][encodeKey(e.path)] = values[l][e.path];
      }
    }
    const res = await adminFetch("/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify({ settings: { content } }),
    });
    setSaving(false);
    if (res.success) showToast("Content saved. Live site updated.");
    else showToast(res.error || "Failed to save", "error");
  };

  const renderField = (e: Entry, l: Locale) => {
    const v = current(e, l);
    const modified = isEdited(e, l);
    const head = (
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-label uppercase tracking-wider text-midnight/50">
          {l === "en" ? "English" : "Español"}
          {modified && <span className="ml-2 text-copper">edited</span>}
        </span>
        {modified && (
          <button
            type="button"
            onClick={() => reset(e, l)}
            className="inline-flex items-center gap-1 text-[11px] text-lake hover:underline"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>
    );

    if (e.kind === "sections") {
      const list = v as Section[];
      return (
        <div className="space-y-2">
          {head}
          {list.map((s, i) => (
            <div key={i} className="space-y-1 rounded-lg border border-champagne/40 p-2">
              <input
                className={inputClass}
                value={s.heading}
                onChange={(ev) =>
                  setValue(e, l, list.map((x, j) => (j === i ? { ...x, heading: ev.target.value } : x)))
                }
              />
              <textarea
                className={inputClass}
                rows={3}
                value={s.body}
                onChange={(ev) =>
                  setValue(e, l, list.map((x, j) => (j === i ? { ...x, body: ev.target.value } : x)))
                }
              />
            </div>
          ))}
        </div>
      );
    }

    if (e.kind === "lines") {
      return (
        <div className="space-y-1">
          {head}
          <textarea
            className={inputClass}
            rows={Math.max(3, (v as string[]).length + 1)}
            value={(v as string[]).join("\n")}
            onChange={(ev) => setValue(e, l, ev.target.value.split("\n"))}
          />
          <p className="text-[11px] text-midnight/40">One item per line.</p>
        </div>
      );
    }

    const text = v as string;
    return (
      <div className="space-y-1">
        {head}
        {text.length > 80 ? (
          <textarea className={inputClass} rows={4} value={text} onChange={(ev) => setValue(e, l, ev.target.value)} />
        ) : (
          <input className={inputClass} value={text} onChange={(ev) => setValue(e, l, ev.target.value)} />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lake border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-midnight">Site Content</h1>
          <p className="mt-1 text-sm text-midnight/50">
            Edit every heading, paragraph and button text on the website in English and Spanish.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-copper px-5 py-2.5 text-sm font-semibold text-ivory hover:bg-copper/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : `Save changes${changedCount ? ` (${changedCount})` : ""}`}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight/40" />
            <input
              className={`${inputClass} pl-9`}
              placeholder="Search any text…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <nav className="max-h-[70vh] space-y-0.5 overflow-y-auto rounded-xl border border-champagne/40 bg-white p-2">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGroup(g);
                  setQuery("");
                }}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                  !query && g === group ? "bg-lake/15 font-semibold text-midnight" : "text-midnight/70 hover:bg-lake/5"
                }`}
              >
                {g}
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-4">
          {visible.length === 0 && <p className="text-sm text-midnight/50">No matching content.</p>}
          {visible.map((e) => (
            <div key={e.path} className="space-y-3 rounded-xl border border-champagne/40 bg-white p-4">
              <p className={labelClass}>
                {titleCase(e.path.split(".").slice(-1)[0])}{" "}
                <span className="normal-case tracking-normal text-midnight/30">{e.path}</span>
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {renderField(e, "en")}
                {renderField(e, "es")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
