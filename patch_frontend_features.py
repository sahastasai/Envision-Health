import re

with open('apps/frontend/src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add Package to icons
content = content.replace("import { Activity, Users, FileText, LogOut, Calendar, Plus, Search, Bell, TrendingUp, ShieldAlert, HeartPulse, Clock, Sparkles, CheckCircle2, AlertTriangle, ChevronRight, ArrowLeft, XCircle, MapPin } from 'lucide-react'", 
                          "import { Activity, Users, FileText, LogOut, Calendar, Plus, Search, Bell, TrendingUp, ShieldAlert, HeartPulse, Clock, Sparkles, CheckCircle2, AlertTriangle, ChevronRight, ArrowLeft, XCircle, MapPin, Package, Beaker } from 'lucide-react'")

# 2. Add Inventory to Navigation
nav_old = """            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Clinic</div>
            <NavLink to="/patients" icon={Users}>Patient EHR</NavLink>
            <NavLink to="/volunteers" icon={HeartPulse}>Volunteer CRM</NavLink>
            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Finance & Growth</div>"""

nav_new = """            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Clinic</div>
            <NavLink to="/patients" icon={Users}>Patient EHR</NavLink>
            <NavLink to="/volunteers" icon={HeartPulse}>Volunteer CRM</NavLink>
            <NavLink to="/inventory" icon={Package}>Inventory</NavLink>
            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Finance & Growth</div>"""

content = content.replace(nav_old, nav_new)

# 3. Create Inventory Component
inventory_component = """
const Inventory = ({ token, logout }: { token: string, logout: () => void }) => {
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ itemName: '', category: 'Medication', quantity: 0, expirationDate: '' })

  const fetchInventory = async () => {
    try {
      const res = await fetch(API_URL + '/api/protected/inventory', { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.status === 401) return logout()
      setItems(await res.json())
    } catch(e) { console.error(e) }
  }

  useEffect(() => { fetchInventory() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(API_URL + '/api/protected/inventory', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowForm(false)
    setForm({ itemName: '', category: 'Medication', quantity: 0, expirationDate: '' })
    fetchInventory()
  }

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    await fetch(API_URL + `/api/protected/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity })
    })
    fetchInventory()
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clinic Inventory</h1>
          <p className="text-gray-500 mt-1">Manage medications, supplies, and equipment.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors">
          {showForm ? 'Cancel' : <><Plus size={18} /> Add Item</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-in fade-in">
          <h2 className="text-lg font-bold text-gray-900 mb-4">New Inventory Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Item Name" className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} required/>
            <select className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option>Medication</option>
              <option>Supply</option>
              <option>Equipment</option>
            </select>
            <input type="number" placeholder="Quantity" className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} required min="0"/>
            <input type="date" className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.expirationDate} onChange={e => setForm({...form, expirationDate: e.target.value})} />
            <div className="md:col-span-4 flex justify-end mt-2">
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700">Save Item</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Name</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiration</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.category === 'Medication' ? 'bg-rose-50 text-rose-600' : item.category === 'Equipment' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      <Package size={16} />
                    </div>
                    {item.item_name}
                  </div>
                </td>
                <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{item.category}</span></td>
                <td className="p-4">
                  <span className={`font-mono font-bold ${item.quantity < 10 ? 'text-rose-600' : 'text-gray-700'}`}>{item.quantity}</span>
                  {item.quantity < 10 && <span className="ml-2 text-xs text-rose-500 font-medium">Low Stock</span>}
                </td>
                <td className="p-4 text-sm text-gray-500">{item.expiration_date ? new Date(item.expiration_date).toLocaleDateString() : 'N/A'}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">-</button>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">+</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No inventory items found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
"""

content = content.replace("const VolunteerCRM =", inventory_component + "\nconst VolunteerCRM =")

# 4. Add Route
route_old = """        <Route path="/volunteers" element={role === 'Admin' ? <VolunteerCRM token={token} logout={logout} /> : <Navigate to="/" />} />"""
route_new = """        <Route path="/volunteers" element={role === 'Admin' ? <VolunteerCRM token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/inventory" element={['Admin', 'Doctor'].includes(role) ? <Inventory token={token} logout={logout} /> : <Navigate to="/" />} />"""
content = content.replace(route_old, route_new)


# 5. Fix Patient Row Click & Add Prescriptions / Labs
patient_row_old = """                      <td className="p-4">
                        <button onClick={() => {navigate(`/patients?id=${p.id}`); setSelectedPatient(p); setShowForm(false);}} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                          Open Chart
                        </button>
                      </td>
                    </tr>"""

patient_row_new = """                      <td className="p-4">
                        <button onClick={(e) => {e.stopPropagation(); navigate(`/patients?id=${p.id}`); setSelectedPatient(p); setShowForm(false);}} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                          Open Chart
                        </button>
                      </td>
                    </tr>"""
content = content.replace(patient_row_old, patient_row_new)
content = content.replace('<tr key={p.id} className="hover:bg-gray-50 transition-colors">', '<tr key={p.id} onClick={() => {navigate(`/patients?id=${p.id}`); setSelectedPatient(p); setShowForm(false);}} className="hover:bg-indigo-50 transition-colors cursor-pointer group">')

# 6. Add actual Patient functionality for prescribing and labs
# Let's completely replace the patients component return rendering for prescriptions/labs
prescriptions_old = """          {tabParam === 'prescriptions' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Active Prescriptions</h3>
                <button className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 flex items-center gap-1 font-medium"><Plus size={16}/> New Rx</button>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <FileText size={32} className="mx-auto text-gray-400 mb-3"/>
                <p className="text-gray-500 font-medium">e-Prescribing Module initializing...</p>
                <p className="text-gray-400 text-sm mt-1">Surescripts integration pending deployment.</p>
              </div>
            </div>
          )}
          
          {tabParam === 'labs' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Laboratory Results</h3>
                <button className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 flex items-center gap-1 font-medium"><Plus size={16}/> Order Labs</button>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Activity size={32} className="mx-auto text-gray-400 mb-3"/>
                <p className="text-gray-500 font-medium">HL7 Interface initializing...</p>
                <p className="text-gray-400 text-sm mt-1">No recent lab results found in the HL7 listener.</p>
              </div>
            </div>
          )}"""

prescriptions_new = """          {tabParam === 'prescriptions' && (
            <PatientPrescriptions patientId={selectedPatient.id} token={token} patientHistory={selectedPatient.medical_history} onUpdate={fetchPatients} />
          )}
          
          {tabParam === 'labs' && (
            <PatientLabs patientId={selectedPatient.id} token={token} patientHistory={selectedPatient.medical_history} onUpdate={fetchPatients} />
          )}"""

content = content.replace(prescriptions_old, prescriptions_new)

# Define subcomponents
rx_labs_components = """
const PatientPrescriptions = ({ patientId, token, patientHistory, onUpdate }: any) => {
  const [showForm, setShowForm] = useState(false)
  const [med, setMed] = useState('')
  const [sig, setSig] = useState('')
  const [loading, setLoading] = useState(false)

  let parsed = { prescriptions: [] }
  try { parsed = JSON.parse(patientHistory) } catch(e) {}
  const prescriptions = parsed.prescriptions || []

  const handleAdd = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    await fetch(API_URL + `/api/protected/patients/${patientId}/medicalData`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'prescription', payload: { medication: med, sig } })
    })
    setMed(''); setSig(''); setShowForm(false); setLoading(false)
    onUpdate()
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Active Prescriptions</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 flex items-center gap-1 font-medium"><Plus size={16}/> New Rx</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-indigo-50 p-4 rounded-xl mb-6 border border-indigo-100 flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Medication</label>
            <input type="text" placeholder="e.g. Amoxicillin 500mg" className="w-full border-none p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" value={med} onChange={e => setMed(e.target.value)} required/>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Sig (Instructions)</label>
            <input type="text" placeholder="e.g. Take 1 PO TID for 10 days" className="w-full border-none p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" value={sig} onChange={e => setSig(e.target.value)} required/>
          </div>
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-50">Save & Sign</button>
        </form>
      )}

      {prescriptions.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <FileText size={32} className="mx-auto text-gray-400 mb-3"/>
          <p className="text-gray-500 font-medium">No active prescriptions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((rx: any, i: number) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mt-1"><FileText size={20}/></div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{rx.medication}</h4>
                <p className="text-gray-600 text-sm font-medium mt-1">Sig: {rx.sig}</p>
                <p className="text-xs text-gray-400 mt-2">Prescribed on: {new Date(rx.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const PatientLabs = ({ patientId, token, patientHistory, onUpdate }: any) => {
  const [showForm, setShowForm] = useState(false)
  const [testName, setTestName] = useState('')
  const [results, setResults] = useState('')
  const [loading, setLoading] = useState(false)

  let parsed = { labs: [] }
  try { parsed = JSON.parse(patientHistory) } catch(e) {}
  const labs = parsed.labs || []

  const handleAdd = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    await fetch(API_URL + `/api/protected/patients/${patientId}/medicalData`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'lab', payload: { testName, results } })
    })
    setTestName(''); setResults(''); setShowForm(false); setLoading(false)
    onUpdate()
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Laboratory Results</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 flex items-center gap-1 font-medium"><Plus size={16}/> Record Result</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-indigo-50 p-4 rounded-xl mb-6 border border-indigo-100 flex gap-3 items-start flex-col">
          <div className="w-full">
            <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Test Name (Panel)</label>
            <input type="text" placeholder="e.g. Comprehensive Metabolic Panel" className="w-full border-none p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" value={testName} onChange={e => setTestName(e.target.value)} required/>
          </div>
          <div className="w-full">
            <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Results & Notes</label>
            <textarea placeholder="e.g. Glucose: 95 mg/dL (Normal)..." className="w-full border-none p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 resize-none h-20" value={results} onChange={e => setResults(e.target.value)} required/>
          </div>
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 self-end disabled:opacity-50">Save to Chart</button>
        </form>
      )}

      {labs.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Activity size={32} className="mx-auto text-gray-400 mb-3"/>
          <p className="text-gray-500 font-medium">No lab results on file.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {labs.map((lab: any, i: number) => (
            <div key={i} className="p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-2"><Beaker size={18} className="text-indigo-600"/> {lab.testName}</h4>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full">{new Date(lab.date).toLocaleDateString()}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono text-sm text-gray-700 whitespace-pre-wrap">
                {lab.results}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
"""

content = content.replace("const Patients =", rx_labs_components + "\nconst Patients =")

with open('apps/frontend/src/App.tsx', 'w') as f:
    f.write(content)
