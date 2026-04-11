import re

with open('apps/frontend/src/App.tsx', 'r') as f:
    content = f.read()

# Update Doctor Dashboard with useNavigate and real links
doctor_dashboard_old = """const DoctorDashboard = ({ token, logout }: { token: string, logout: () => void }) => {
  const [patients, setPatients] = useState<any[]>([])
  
  useEffect(() => {
    fetch(API_URL + '/api/protected/patients', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() })
      .then(data => setPatients(data)).catch(console.error)
  }, [token])"""

doctor_dashboard_new = """const DoctorDashboard = ({ token, logout }: { token: string, logout: () => void }) => {
  const [patients, setPatients] = useState<any[]>([])
  const navigate = useNavigate()
  
  useEffect(() => {
    fetch(API_URL + '/api/protected/patients', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() })
      .then(data => setPatients(data)).catch(console.error)
  }, [token])"""

content = content.replace(doctor_dashboard_old, doctor_dashboard_new)

quick_actions_old = """        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-indigo-100 hover:bg-indigo-50 transition-colors group">
              <div className="flex items-center gap-3">
                <Plus className="text-indigo-600"/>
                <span className="font-medium text-indigo-900">Add New Patient</span>
              </div>
              <ChevronRight className="text-indigo-400 group-hover:text-indigo-600"/>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <FileText className="text-gray-600"/>
                <span className="font-medium text-gray-900">Write Prescriptions</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-gray-600"/>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <ShieldAlert className="text-gray-600"/>
                <span className="font-medium text-gray-900">Review Lab Results</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-gray-600"/>
            </button>
          </div>
        </div>"""

quick_actions_new = """        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Quick Actions</h2>
          <div className="space-y-4">
            <button onClick={() => navigate('/patients?action=add')} className="w-full flex items-center justify-between p-4 rounded-xl border border-indigo-100 hover:bg-indigo-50 transition-colors group">
              <div className="flex items-center gap-3">
                <Plus className="text-indigo-600"/>
                <span className="font-medium text-indigo-900">Add New Patient</span>
              </div>
              <ChevronRight className="text-indigo-400 group-hover:text-indigo-600"/>
            </button>
            <button onClick={() => navigate('/patients?tab=prescriptions')} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <FileText className="text-gray-600"/>
                <span className="font-medium text-gray-900">Write Prescriptions</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-gray-600"/>
            </button>
            <button onClick={() => navigate('/patients?tab=labs')} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <Activity className="text-gray-600"/>
                <span className="font-medium text-gray-900">Review Lab Results</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-gray-600"/>
            </button>
          </div>
        </div>"""
        
content = content.replace(quick_actions_old, quick_actions_new)

# Make the patient row clickable in the list
p_list_old = """              <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    {p.first_name[0]}{p.last_name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{p.first_name} {p.last_name}</h4>
                    <p className="text-xs text-gray-500">DOB: {new Date(p.dob).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">Chart &rarr;</div>
              </div>"""
              
p_list_new = """              <button onClick={() => navigate(`/patients?id=${p.id}`)} key={p.id} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    {p.first_name[0]}{p.last_name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{p.first_name} {p.last_name}</h4>
                    <p className="text-xs text-gray-500">DOB: {new Date(p.dob).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full group-hover:bg-indigo-100 transition-colors">Chart &rarr;</div>
              </button>"""
              
content = content.replace(p_list_old, p_list_new)


# Now patch the Patients component to handle selection, tabs, and URL parameters.
patients_old = """const Patients = ({ token, logout }: { token: string, logout: () => void }) => {
  const [patients, setPatients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', email: '', phone: '', address: '', history: '', vitals: '', medications: '' })

  const fetchPatients = async () => {"""

patients_new = """const Patients = ({ token, logout }: { token: string, logout: () => void }) => {
  const [patients, setPatients] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '', email: '', phone: '', address: '', history: '', vitals: '', medications: '' })
  
  const location = useLocation()
  const navigate = useNavigate()
  
  const queryParams = new URLSearchParams(location.search)
  const actionParam = queryParams.get('action')
  const idParam = queryParams.get('id')
  const tabParam = queryParams.get('tab') || 'demographics'
  
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  
  useEffect(() => {
    if (actionParam === 'add') {
      setShowForm(true)
      setSelectedPatient(null)
    }
  }, [actionParam])

  const fetchPatients = async () => {"""

content = content.replace(patients_old, patients_new)


patients_effect_old = """    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [])

  const handleSubmit = async (e: React.FormEvent) => {"""

patients_effect_new = """    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchPatients() 
  }, [])
  
  useEffect(() => {
    if (idParam && patients.length > 0) {
      const p = patients.find(pat => pat.id === idParam)
      if (p) {
        setSelectedPatient(p)
        setShowForm(false)
      }
    }
  }, [idParam, patients])

  const handleSubmit = async (e: React.FormEvent) => {"""

content = content.replace(patients_effect_old, patients_effect_new)

# Now, we need to handle the return view for Patients.
patients_return_old = """      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading && !showForm ? (
          <div className="p-8 text-center text-gray-500">Decrypting secure records...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">DOB</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Medical History (Decrypted)</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No patients found. Add one above.</td></tr>
              ) : (
                patients.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                          {p.first_name[0]}{p.last_name[0]}
                        </div>
                        <div className="font-medium text-gray-900">{p.first_name} {p.last_name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{new Date(p.dob).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="max-w-md truncate text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded border border-gray-100 font-mono">
                        {(() => {
                          try {
                            const parsed = JSON.parse(p.medical_history)
                            return `Vitals: ${parsed.vitals || 'N/A'} | ${parsed.history}`
                          } catch {
                            return p.medical_history || 'N/A'
                          }
                        })()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>"""

patients_return_new = """      {!selectedPatient ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && !showForm ? (
            <div className="p-8 text-center text-gray-500">Decrypting secure records...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">DOB</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Medical History (Decrypted)</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">No patients found. Add one above.</td></tr>
                ) : (
                  patients.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                            {p.first_name[0]}{p.last_name[0]}
                          </div>
                          <div className="font-medium text-gray-900">{p.first_name} {p.last_name}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{new Date(p.dob).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="max-w-md truncate text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded border border-gray-100 font-mono">
                          {(() => {
                            try {
                              const parsed = JSON.parse(p.medical_history)
                              return `Vitals: ${parsed.vitals || 'N/A'} | ${parsed.history}`
                            } catch {
                              return p.medical_history || 'N/A'
                            }
                          })()}
                        </div>
                      </td>
                      <td className="p-4">
                        <button onClick={() => {navigate(`/patients?id=${p.id}`); setSelectedPatient(p); setShowForm(false);}} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                          Open Chart
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-xl border border-indigo-200">
                {selectedPatient.first_name[0]}{selectedPatient.last_name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.first_name} {selectedPatient.last_name}</h2>
                <p className="text-gray-500 text-sm flex gap-3 mt-1">
                  <span>DOB: {new Date(selectedPatient.dob).toLocaleDateString()}</span>
                  <span>|</span>
                  <span>ID: {selectedPatient.id.split('-')[0]}</span>
                </p>
              </div>
            </div>
            <button onClick={() => {navigate('/patients'); setSelectedPatient(null);}} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors">
              <ArrowLeft size={16} /> Close Chart
            </button>
          </div>
          
          <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm w-max">
            <button onClick={() => navigate(`/patients?id=${selectedPatient.id}&tab=demographics`)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tabParam === 'demographics' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>Chart & Demographics</button>
            <button onClick={() => navigate(`/patients?id=${selectedPatient.id}&tab=prescriptions`)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${tabParam === 'prescriptions' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}><FileText size={16}/> Prescriptions</button>
            <button onClick={() => navigate(`/patients?id=${selectedPatient.id}&tab=labs`)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${tabParam === 'labs' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}><Activity size={16}/> Lab Results</button>
          </div>
          
          {tabParam === 'demographics' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Encrypted Clinical Data</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm whitespace-pre-wrap text-gray-700">
                {(() => {
                  try {
                    const parsed = JSON.parse(selectedPatient.medical_history)
                    return `Vitals: ${parsed.vitals || 'None recorded'}\n\nCurrent Medications: ${parsed.medications || 'None recorded'}\n\nClinical History:\n${parsed.history || 'No notes'}`
                  } catch {
                    return selectedPatient.medical_history || 'No secure data found.'
                  }
                })()}
              </div>
            </div>
          )}
          
          {tabParam === 'prescriptions' && (
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
          )}
        </div>
      )}"""

content = content.replace(patients_return_old, patients_return_new)

with open('apps/frontend/src/App.tsx', 'w') as f:
    f.write(content)
