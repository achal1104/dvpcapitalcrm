import { useState } from 'react'
import { useStore } from './store'
import { LoanDetail } from './Modules3'
import { COMM_KEY, CommissionSummary, frShare, loadComm } from './Modules4'
import { writeJson } from './data'
import { COMM_SEED, COMM_STATUS, L_STATUS, MY_FRANCHISE, STAGES, inr } from './data'
const card = 'rounded-xl bg-white border border-slate-200 shadow-sm'
const sel = 'rounded-md border border-slate-200 bg-white p-1 text-xs'
export function Loans({ role }: { role: string }) {
  const { loans, setStage, setLender, addLender, submitFile } = useStore(); const [open, setOpen] = useState<string | null>(null); const [nm, setNm] = useState(''); const [det, setDet] = useState<string | null>(null)
  const fr = role === 'Franchise Owner'; const rows = loans.filter(l => !fr || l.franchise === MY_FRANCHISE)
  return <div className="space-y-4"><div><h1 className="text-2xl font-bold text-navy">Loan applications</h1><p className="text-sm text-slate-500">Approved and Disbursed are separate. A file moves to Disbursed only after a lender approves it.</p></div>
    <div className={card + ' overflow-x-auto'}><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{['ID', 'Customer', 'Category', 'Requested', 'Stage', 'Disbursed', ''].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
      <tbody>{rows.map(l => <><tr key={l.id} className="border-t border-slate-100"><td className="px-4 py-3"><button className="text-royal underline" onClick={() => setDet(l.id)}>{l.id}</button></td><td className="px-4 py-3 font-medium">{l.customer}</td><td className="px-4 py-3">{l.category}</td><td className="px-4 py-3">{inr(l.amount)}</td>
        <td className="px-4 py-3">{fr ? <>{l.stage}{l.stage === 'Documents Pending' && <button className="ml-2 rounded bg-royal px-2 py-0.5 text-xs text-white" onClick={() => { const r = submitFile(l.id); if (r) alert(r) }}>Submit file</button>}</> : <select value={l.stage} className={sel} onChange={e => { const r = setStage(l.id, e.target.value); if (r) alert(r) }}>{STAGES.map(s => <option key={s}>{s}</option>)}</select>}</td>
        <td className="px-4 py-3">{l.disbursed ? inr(l.disbursed) : '—'}</td><td className="px-4 py-3"><button className="text-royal" onClick={() => setOpen(open === l.id ? null : l.id)}>Lenders ({l.lenders.length})</button></td></tr>
        {open === l.id && <tr key={l.id + 'x'} className="bg-slate-50"><td colSpan={7} className="p-4"><table className="w-full text-sm"><tbody>{l.lenders.map((x, i) => <tr key={i}><td className="py-1">{x.name}</td><td>{x.amount ? inr(x.amount) : '—'}</td><td>{fr ? x.status : <select value={x.status} className={sel} onChange={e => setLender(l.id, i, e.target.value)}>{L_STATUS.map(s => <option key={s}>{s}</option>)}</select>}</td></tr>)}</tbody></table>
          {l.lenders.length === 0 && <p className="text-sm text-slate-500">No lender submissions yet.</p>}
          {!fr && <div className="mt-2 flex gap-2"><input value={nm} onChange={e => setNm(e.target.value)} placeholder="Bank or NBFC name" className="rounded-md border border-slate-300 p-1.5 text-sm" /><button className="rounded-md bg-navy px-3 text-sm text-white" onClick={() => { if (nm.trim()) { addLender(l.id, nm.trim()); setNm('') } }}>Add lender</button></div>}</td></tr>}</>)}
        {rows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-500">No loan applications yet.</td></tr>}</tbody></table></div>{det && <LoanDetail id={det} role={role} close={() => setDet(null)} />}</div>
}
export function Commissions({ role }: { role: string }) {
  const fr = role === 'Franchise Owner'; const [rows, setRows] = useState(loadComm); const [c, setC] = useState({ disb: 10000000, rate: 2, share: 40, inc: 5, tds: 10 })
  const total = c.disb * c.rate / 100, gross = total * c.share / 100, tds = gross * c.tds / 100, inc = total * c.inc / 100
  const list = rows.filter(r => !fr || r.franchise === MY_FRANCHISE)
  const change = (id: string, s: string) => { const r = rows.find(x => x.id === id)!; if (['Approved for Payout', 'Payout Processing', 'Paid'].includes(s) && r.received < r.expected) return alert('Lender commission has not been fully received by head office yet.'); const n = rows.map(x => x.id === id ? { ...x, status: s } : x); setRows(n); writeJson(COMM_KEY, n) }
  const num = (k: keyof typeof c, l: string) => <label className="text-xs text-slate-500">{l}<input type="number" value={c[k]} onChange={e => setC({ ...c, [k]: +e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 p-1.5 text-sm text-slate-900" /></label>
  return <div className="space-y-5"><h1 className="text-2xl font-bold text-navy">{fr ? 'My commissions' : 'Commissions and payouts'}</h1>
    {fr && <CommissionSummary fr={MY_FRANCHISE} />}
    {!fr && <div className={card + ' p-4'}><label className="flex items-center gap-2 text-sm"><b>Default franchise share %</b><input type="number" aria-label="Default franchise share" defaultValue={frShare()} className={sel + ' w-20'} onChange={e => writeJson('dvp-share', Math.min(100, Math.max(0, +e.target.value)))} /><span className="text-xs text-slate-500">Used in franchise commission summaries.</span></label></div>}
    {!fr && <div className={card + ' p-4'}><b className="text-sm">Commission calculator</b><p className="text-xs text-slate-500">Illustrative. Rates must follow the signed agreements.</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">{num('disb', 'Disbursed amount (₹)')}{num('rate', 'Commission %')}{num('share', 'Franchise share %')}{num('inc', 'Employee incentive %')}{num('tds', 'TDS %')}</div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{[['Lender commission', total], ['Franchise gross', gross], ['TDS', tds], ['Franchise net payable', gross - tds], ['Head office share', total - gross - inc]].map(([l, v]) => <div key={l as string} className="rounded-lg bg-slate-50 p-3"><div className="text-xs text-slate-500">{l}</div><div className="font-bold text-navy">{inr(v as number)}</div></div>)}</div></div>}
    <div className={card + ' overflow-x-auto'}><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{['Loan', 'Franchise', 'Expected from lender', 'Received by HO', 'Status'].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
      <tbody>{list.map(r => <tr key={r.id} className="border-t border-slate-100"><td className="px-4 py-3">{r.loan}</td><td className="px-4 py-3">{r.franchise}</td><td className="px-4 py-3">{inr(r.expected)}</td><td className="px-4 py-3">{fr ? inr(r.received) : <input type="number" aria-label="Received by head office" value={r.received} className={sel + ' w-28'} onChange={e => { const n = rows.map(x => x.id === r.id ? { ...x, received: Math.max(0, +e.target.value) } : x); setRows(n); writeJson(COMM_KEY, n) }} />}</td>
        <td className="px-4 py-3">{fr ? r.status : <select value={r.status} className={sel} onChange={e => change(r.id, e.target.value)}>{COMM_STATUS.map(s => <option key={s}>{s}</option>)}</select>}</td></tr>)}</tbody></table></div></div>
}
