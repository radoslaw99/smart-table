"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

type Row = {
  id: number;
  group: string;
  name: string;
  qty: number;
  price: number;
};

const initialRows: Row[] = [
  { id: 1, group: "A", name: "Alpha", qty: 2, price: 120 },
  { id: 2, group: "A", name: "Amber", qty: 1, price: 80 },
  { id: 3, group: "A", name: "Atlas", qty: 4, price: 55 },

  { id: 4, group: "B", name: "Beta", qty: 1, price: 200 },
  { id: 5, group: "B", name: "Brick", qty: 3, price: 40 },

  { id: 6, group: "C", name: "Cobalt", qty: 2, price: 90 },
  { id: 7, group: "C", name: "Cedar", qty: 5, price: 25 },
];

type SortKey = "group" | "name" | "qty" | "price" | "total";
type SortDir = "none" | "asc" | "desc";

export default function ComponentsPage() {
  // --- AUTH CHECK ONLY ---
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return <div>Checking authentication…</div>;
  }

  return <TableView />;
}

type RowWithTotal = Row & { total: number };

type DisplayItem =
  | { kind: "row"; row: RowWithTotal }
  | { kind: "collapsed"; group: string; count: number };

function TableView() {
  // --- TABLE STATE ---
  const [rows, setRows] = useState<Row[]>(initialRows);

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>("group");
  const [sortDir, setSortDir] = useState<SortDir>("none");

  // collapse + selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // cloud
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudMsg, setCloudMsg] = useState<string | null>(null);

  function cycleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    setSortDir((prev) => (prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"));
  }

  function resetSort() {
    setSortKey("group");
    setSortDir("none");
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key || sortDir === "none") return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  }

  // base + sorting
  const computedRows: RowWithTotal[] = useMemo(() => {
    const withTotal: RowWithTotal[] = rows.map((r) => ({ ...r, total: r.qty * r.price }));

    if (sortDir === "none") return withTotal;

    return [...withTotal].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }

      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [rows, sortKey, sortDir]);

  // FOOTER reflect what user currently sees (expanded rows only)
  const footer = useMemo(() => {
    const visible = computedRows.filter((r) => !collapsedGroups.has(r.group));
    const totalQty = visible.reduce((sum, r) => sum + r.qty, 0);
    const totalValue = visible.reduce((sum, r) => sum + r.total, 0);
    return { totalQty, totalValue };
  }, [computedRows, collapsedGroups]);

  // Build list with "collapsed placeholder rows" (one per adjacent run)
  const displayItems: DisplayItem[] = useMemo(() => {
    const items: DisplayItem[] = [];
    let i = 0;

    while (i < computedRows.length) {
      const r = computedRows[i];

      if (!collapsedGroups.has(r.group)) {
        items.push({ kind: "row", row: r });
        i += 1;
        continue;
      }

      // collapsed run for SAME group (adjacent rows)
      const group = r.group;
      let count = 0;
      let j = i;

      while (j < computedRows.length && computedRows[j].group === group && collapsedGroups.has(group)) {
        count += 1;
        j += 1;
      }

      items.push({ kind: "collapsed", group, count });
      i = j;
    }

    return items;
  }, [computedRows, collapsedGroups]);

  function toggleSelected(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function collapseSelected() {
    if (selectedIds.size === 0) return;

    const groupsToCollapse = new Set<string>();
    for (const r of computedRows) {
      if (selectedIds.has(r.id)) groupsToCollapse.add(r.group);
    }

    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      for (const g of groupsToCollapse) next.add(g);
      return next;
    });

    setSelectedIds(new Set());
  }

  function expandGroup(group: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.delete(group);
      return next;
    });
  }

  function expandAll() {
    setCollapsedGroups(new Set());
  }

  // -------- BACKEND: SAVE / LOAD --------
  async function loadFromCloud() {
    setCloudLoading(true);
    setCloudMsg(null);

    const { data: u, error: uErr } = await supabase.auth.getUser();
    const userId = u.user?.id;

    if (uErr || !userId) {
      setCloudLoading(false);
      setCloudMsg("Not signed in.");
      return;
    }

    const { data, error } = await supabase
      .from("smart_tables")
      .select("data")
      .eq("user_id", userId)
      .maybeSingle();

    setCloudLoading(false);

    if (error) {
      setCloudMsg("Load failed.");
      return;
    }

    if (!data?.data) {
      setCloudMsg("No saved table found (using demo data).");
      return;
    }

    const payload = data.data as any;

    if (payload?.rows && Array.isArray(payload.rows)) {
      setRows(payload.rows as Row[]);
      setSelectedIds(new Set());
      setCollapsedGroups(new Set());
      setCloudMsg("Loaded from cloud.");
    } else {
      setCloudMsg("Saved data format is invalid.");
    }
  }

  async function saveToCloud() {
    setCloudLoading(true);
    setCloudMsg(null);

    const { data: u, error: uErr } = await supabase.auth.getUser();
    const userId = u.user?.id;

    if (uErr || !userId) {
      setCloudLoading(false);
      setCloudMsg("Not signed in.");
      return;
    }

    const payload = { rows };

    const { error } = await supabase
      .from("smart_tables")
      .upsert({ user_id: userId, data: payload, updated_at: new Date().toISOString() });

    setCloudLoading(false);

    if (error) {
      setCloudMsg("Save failed.");
      return;
    }

    setCloudMsg("Saved to cloud.");
  }

  // auto-load once
  useEffect(() => {
    loadFromCloud();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCount = selectedIds.size;
  const collapsedCount = collapsedGroups.size;

  return (
    <div className="card" style={{ padding: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Table</h1>
          <p style={{ marginTop: 6, color: "var(--muted)" }}>
            Sorting: click headers. Collapse: select rows → collapse groups. Cloud: save/load per user.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={resetSort}>
            Reset sorting
          </button>

          <button className="btn" onClick={clearSelection} disabled={selectedCount === 0}>
            Clear selection ({selectedCount})
          </button>

          <button className="btn btn-primary" onClick={collapseSelected} disabled={selectedCount === 0}>
            Collapse selected
          </button>

          <button className="btn" onClick={expandAll} disabled={collapsedCount === 0}>
            Expand all ({collapsedCount})
          </button>

          <button className="btn" onClick={loadFromCloud} disabled={cloudLoading}>
            Load
          </button>

          <button className="btn btn-primary" onClick={saveToCloud} disabled={cloudLoading}>
            Save
          </button>
        </div>
      </div>

      {cloudMsg && (
        <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 13 }}>
          {cloudMsg}
        </div>
      )}

      <div className="table-wrap" style={{ marginTop: 14 }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 48 }}>Sel</th>
              <th onClick={() => cycleSort("group")}>Group {sortIcon("group")}</th>
              <th onClick={() => cycleSort("name")}>Name {sortIcon("name")}</th>
              <th onClick={() => cycleSort("qty")}>Qty {sortIcon("qty")}</th>
              <th onClick={() => cycleSort("price")}>Price {sortIcon("price")}</th>
              <th onClick={() => cycleSort("total")}>Total {sortIcon("total")}</th>
            </tr>
          </thead>

          <tbody>
            {displayItems.map((item, idx) => {
              if (item.kind === "row") {
                const r = item.row;
                const checked = selectedIds.has(r.id);

                return (
                  <tr key={`row-${r.id}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelected(r.id)}
                        aria-label={`Select row ${r.id}`}
                      />
                    </td>
                    <td>{r.group}</td>
                    <td>{r.name}</td>
                    <td>{r.qty}</td>
                    <td>{r.price}</td>
                    <td>{r.total}</td>
                  </tr>
                );
              }

              return (
                <tr key={`collapsed-${item.group}-${idx}`}>
                  <td style={{ color: "var(--muted)" }}>—</td>
                  <td colSpan={5}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ color: "var(--muted)" }}>
                        Group <b>{item.group}</b> is collapsed ({item.count} rows hidden).
                      </div>

                      <button className="btn" onClick={() => expandGroup(item.group)}>
                        Expand group {item.group}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={3}>Footer</td>
              <td>{footer.totalQty}</td>
              <td style={{ color: "var(--muted)" }}>Sum (visible)</td>
              <td>{footer.totalValue}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
