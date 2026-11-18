export type Role = 'Super Admin'|'Head Office Admin'|'Operations Manager'|'Franchise Manager'|'Loan Processing Executive'|'Relationship Manager'|'Document Verification Executive'|'Accounts Manager'|'Sales Manager'|'Support Executive'|'Auditor'|'Franchise Owner'|'Customer'
export const ROLES: Role[] = ['Super Admin','Head Office Admin','Operations Manager','Franchise Manager','Loan Processing Executive','Relationship Manager','Document Verification Executive','Accounts Manager','Sales Manager','Support Executive','Auditor','Franchise Owner','Customer']
export const FSUB = ['Active Franchises','Pending Approvals','Suspended Franchises','Terminated Franchises']
export const HO_NAV = ['Dashboard','Franchise Management',...FSUB,'Leads','Customers','Loan Applications','Documents','Banks & NBFC','Commissions & Payouts','Marketing','Content','Support & Tickets','Agreements','Employees','Notifications','Reports','Audit Logs','Settings','Territories','Performance','High-Ticket Desk','Permissions']
export const FR_NAV = ['Dashboard','Leads','Customers','Add New Customer','Loan Applications','Document Upload','Application Tracking','My Commissions','Payment History','Marketing Kit','Content','Training & Support','Notifications','My Profile','Helpdesk']
export const CU_NAV = ['Dashboard','Apply for Loan','My Applications','Upload Documents','Track Application','Notifications','Support','Privacy & Consent']
const HO_EXTRA: Partial<Record<Role,string[]>> = {
 'Accounts Manager':['Dashboard','Commissions & Payouts','Reports','Banks & NBFC','Notifications'],
 'Loan Processing Executive':['Dashboard','Loan Applications','Documents','Customers','Support & Tickets','Notifications'],
 'Document Verification Executive':['Dashboard','Documents','Loan Applications','Notifications'],
 'Support Executive':['Dashboard','Support & Tickets','Customers','Notifications'],
 'Sales Manager':['Dashboard','Franchise Management','Leads','Performance','Marketing','Content','Reports','Notifications'],
 'Franchise Manager':['Dashboard','Franchise Management',...FSUB,'Territories','Agreements','Leads','Marketing','Content','Notifications'],
 'Relationship Manager':['Dashboard','Banks & NBFC','Loan Applications','Notifications'],
 'Auditor':['Dashboard','Audit Logs','Reports'],
}
export const navFor = (r: Role): string[] => {
  const b = r==='Franchise Owner'?FR_NAV : r==='Customer'?CU_NAV : HO_EXTRA[r]??HO_NAV
  if (r === 'Super Admin' || r === 'Franchise Owner' || r === 'Customer') return b
  try { const o = JSON.parse(localStorage.getItem('dvp-perm') || '{}')[r]
    if (Array.isArray(o)) return HO_NAV.filter(x => x === 'Dashboard' || o.includes(x) || (FSUB.includes(x) && o.includes('Franchise Management'))) } catch { /* ignore */ }
  return b.filter(x => x !== 'Permissions')
}
export const slug = (s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
export const inr = (n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)
export const LEAD_STATUS = ['New Lead','Contacted','Interested','Documents Pending','Converted','Lost']
export const LOAN_CATS = ['Personal Loan','Business Loan','Home Loan','Loan Against Property','Machinery Loan','Project Finance','Working Capital','Education Loan','Vehicle Loan','Balance Transfer','OD / CC Facility','LAP Top-up']
export const MY_FRANCHISE = 'Akshay Finance'
export type Lead = {id:string;name:string;mobile:string;category:string;amount:number;status:string;franchise:string;source?:string}
export const FRANCHISES = ['Akshay Finance','Satara Capital','Mumbai Credit Hub','Nashik Finserv']
export const readJson = <T,>(k:string, d:T):T => { try { const j = localStorage.getItem(k); if (j) return JSON.parse(j) as T } catch { /* storage unavailable */ } return d }
export const writeJson = (k:string, v:unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }
export const SEED_LEADS: Lead[] = [
 {id:'L-1001',name:'Rohit Deshmukh',mobile:'9822012345',category:'Business Loan',amount:5000000,status:'Interested',franchise:'Akshay Finance'},
 {id:'L-1002',name:'Sneha Kulkarni',mobile:'9890123456',category:'Home Loan',amount:3500000,status:'Documents Pending',franchise:'Akshay Finance'},
 {id:'L-1003',name:'Imran Shaikh',mobile:'9923456789',category:'Machinery Loan',amount:12000000,status:'Contacted',franchise:'Satara Capital'},
 {id:'L-1004',name:'Priya Patil',mobile:'9765432101',category:'Personal Loan',amount:600000,status:'New Lead',franchise:'Akshay Finance'},
 {id:'L-1005',name:'Vikas Jadhav',mobile:'9011223344',category:'Loan Against Property',amount:8000000,status:'Converted',franchise:'Nashik Finserv'},
 {id:'L-1006',name:'Anjali Mehta',mobile:'9988776655',category:'Education Loan',amount:1500000,status:'Lost',franchise:'Mumbai Credit Hub'},
]
export const REVENUE = ['Jun','Jul','Aug','Sep','Oct','Nov'].map((m,i)=>({m,revenue:[18,22,27,25,34,41][i]*100000,commission:[7,9,11,10,14,17][i]*100000}))
export const TREND = ['Jun','Jul','Aug','Sep','Oct','Nov'].map((m,i)=>({m,applied:[42,55,61,58,76,88][i],disbursed:[12,18,21,20,29,35][i]}))
export const CAT_MIX = [{name:'Business',value:34},{name:'Home',value:22},{name:'LAP',value:18},{name:'Personal',value:14},{name:'Other',value:12}]
export const FR_PERF = [{n:'Akshay Finance',v:62},{n:'Mumbai Credit Hub',v:48},{n:'Nashik Finserv',v:35},{n:'Satara Capital',v:27}]
export const STAGES = ['New Inquiry','Documents Pending','File Submitted','Under Verification','Query Raised','Ready for Lender Submission','Submitted to Bank / NBFC','Under Bank Processing','Approved / Sanctioned','Disbursement Pending','Disbursed','Closed / Rejected / Cancelled']
export const L_STATUS = ['Not Submitted','Processing','Query Raised','Approved','Rejected']
export type Lender = { name: string; status: string; amount: number }
export type Loan = { id: string; customer: string; category: string; amount: number; stage: string; franchise: string; lenders: Lender[]; disbursed: number; h?: string[] }
export const SEED_LOANS: Loan[] = [
 { id:'LN-2001', customer:'Rohit Deshmukh', category:'Business Loan', amount:5000000, stage:'Under Bank Processing', franchise:'Akshay Finance', disbursed:0, lenders:[{name:'Bank A',status:'Rejected',amount:0},{name:'NBFC B',status:'Processing',amount:4000000},{name:'Bank C',status:'Query Raised',amount:5000000},{name:'NBFC D',status:'Approved',amount:3500000},{name:'Bank E',status:'Not Submitted',amount:0}] },
 { id:'LN-2002', customer:'Sneha Kulkarni', category:'Home Loan', amount:3500000, stage:'Documents Pending', franchise:'Akshay Finance', disbursed:0, lenders:[] },
 { id:'LN-2003', customer:'Vikas Jadhav', category:'Loan Against Property', amount:8000000, stage:'Disbursed', franchise:'Nashik Finserv', disbursed:7500000, lenders:[{name:'Bank C',status:'Approved',amount:7500000}] },
]
export const DEMO_PASSWORD = 'Dvp@1234'
export const USERS = ROLES.map(r => ({ role: r, email: r.toLowerCase().replace(/[^a-z]/g, '') + '@dvpcapitals.in' }))
export const COMM_STATUS = ['Estimated','Pending Lender Payment','Received by Head Office','Approved for Payout','Payout Processing','Paid','On Hold','Reversed / Adjusted']
export const COMM_SEED = [
 { id:'C-1', franchise:'Nashik Finserv', loan:'LN-2003', expected:150000, received:150000, status:'Received by Head Office' },
 { id:'C-2', franchise:'Akshay Finance', loan:'LN-2001', expected:70000, received:0, status:'Estimated' },
 { id:'C-3', franchise:'Akshay Finance', loan:'LN-1990', expected:120000, received:120000, status:'Paid' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>
export const audit = (user: string, action: string) => {
  const rows = readJson<AnyRow[]>('dvp-m-audit', []); const n = Math.max(200, ...rows.map(r => parseInt(String(r.id).replace(/\D/g, '')) || 0)) + 1
  writeJson('dvp-m-audit', [{ id: 'AL-' + n, user, action, time: new Date().toISOString().slice(0, 16).replace('T', ' ') }, ...rows])
}
export const ensureCommission = (loan: string, franchise: string, disbursed: number) => {
  const rows = readJson<AnyRow[]>('dvp-comm', COMM_SEED); if (rows.some(r => r.loan === loan)) return
  writeJson('dvp-comm', [...rows, { id: 'C-' + Date.now(), franchise, loan, expected: Math.round(disbursed * 0.02), received: 0, status: 'Pending Lender Payment' }])
}
