import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEMO_PASSWORD, Lead, Loan, Role, SEED_LEADS, SEED_LOANS, USERS, audit, ensureCommission } from './data'
type S = { role: Role|null; email: string; pw: Record<string,string>; leads: Lead[]; loans: Loan[]
 login:(e:string,p:string)=>string|null; logout:()=>void; changePw:(o:string,n:string)=>string|null
 addLead:(l:Omit<Lead,'id'>)=>void; setStatus:(id:string,s:string)=>void; removeLead:(id:string)=>void
 addLoan:(l:Omit<Loan,'id'>)=>string; submitFile:(id:string)=>string|null; setStage:(id:string,s:string)=>string|null; setLender:(id:string,i:number,status:string)=>void; addLender:(id:string,name:string)=>void }
const upd = (loans: Loan[], id: string, f: (l: Loan) => Loan) => loans.map(l => l.id === id ? f(l) : l)
export const useStore = create<S>()(persist((set,get)=>({
 role:null, email:'', pw:{}, leads:SEED_LEADS, loans:SEED_LOANS,
 addLoan:l=>{ const n=Math.max(2000,...get().loans.map(x=>parseInt(x.id.replace(/\D/g,''))||0))+1; const id=`LN-${n}`
  set({loans:[{...l,id,h:[`${l.stage} (${new Date().toLocaleDateString('en-IN')})`]},...get().loans]}); return id },
 login:(e,p)=>{ const email=e.trim().toLowerCase(); const u=USERS.find(x=>x.email===email)
  if(!u || (get().pw[email]??DEMO_PASSWORD)!==p) return 'Incorrect email or password.'
  set({role:u.role,email}); audit(u.role,'Signed in'); return null },
 logout:()=>set({role:null,email:''}),
 submitFile:id=>{ const l=get().loans.find(x=>x.id===id); if(!l||l.stage!=='Documents Pending') return 'Only files in Documents Pending can be submitted.'; return get().setStage(id,'File Submitted') },
 changePw:(o,n)=>{ const {email,pw}=get(); if((pw[email]??DEMO_PASSWORD)!==o) return 'Current password is incorrect.'
  if(n.length<8||!/\d/.test(n)||!/[A-Za-z]/.test(n)) return 'New password needs 8+ characters with a letter and a number.'
  set({pw:{...pw,[email]:n}}); return null },
 addLead:l=>set({leads:[{...l,id:`L-${Math.max(1000,...get().leads.map(x=>parseInt(x.id.replace(/\D/g,''))||0))+1}`},...get().leads]}),
 setStatus:(id,s)=>set({leads:get().leads.map(l=>l.id===id?{...l,status:s}:l)}),
 removeLead:id=>set({leads:get().leads.filter(l=>l.id!==id)}),
 setStage:(id,s)=>{ const loan=get().loans.find(l=>l.id===id)!; const ok=loan.lenders.filter(x=>x.status==='Approved')
  if((s==='Disbursed'||s==='Disbursement Pending'||s==='Approved / Sanctioned')&&!ok.length) return 'No lender has approved this file yet.'
  set({loans:upd(get().loans,id,l=>({...l,stage:s,h:[...(l.h||[]),`${s} (${new Date().toLocaleDateString('en-IN')})`],disbursed:s==='Disbursed'?Math.max(...ok.map(x=>x.amount)):l.disbursed}))}); audit(get().role||'System',`${id} moved to ${s}`); if(s==='Disbursed') ensureCommission(id,loan.franchise,Math.max(...ok.map(x=>x.amount))); return null },
 setLender:(id,i,st)=>set({loans:upd(get().loans,id,l=>({...l,lenders:l.lenders.map((x,j)=>j===i?{...x,status:st}:x)}))}),
 addLender:(id,name)=>set({loans:upd(get().loans,id,l=>({...l,lenders:[...l.lenders,{name,status:'Not Submitted',amount:l.amount}]}))}),
}),{name:'dvp-crm-v2'}))
