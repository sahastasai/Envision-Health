import re

with open('apps/frontend/src/App.tsx', 'r') as f:
    content = f.read()

doctor_dashboard = """
const DoctorDashboard = ({ token, logout }: { token: string, logout: () => void }) => {
  const [patients, setPatients] = useState<any[]>([])
  
  useEffect(() => {
    fetch(API_URL + '/api/protected/patients', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() })
      .then(data => setPatients(data)).catch(console.error)
  }, [token])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Physician Dashboard</h1>
          <p className="text-gray-500 mt-1">Your daily clinical overview.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg transition-colors font-medium">
            <Calendar size={18} /> Today's Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex items-center gap-4">
          <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600"><Users size={28}/></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Patients</p>
            <h2 className="text-3xl font-bold text-gray-900">{patients.length}</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-center gap-4">
          <div className="bg-amber-50 p-4 rounded-xl text-amber-600"><Clock size={28}/></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
            <h2 className="text-3xl font-bold text-gray-900">4</h2>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-4">
          <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600"><Activity size={28}/></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Charts Updated</p>
            <h2 className="text-3xl font-bold text-gray-900">12</h2>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-3">Recently Added Patients</h2>
          <div className="space-y-3">
            {patients.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
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
              </div>
            ))}
            {patients.length === 0 && <p className="text-gray-500 text-sm">No patients found.</p>}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
        </div>
      </div>
    </div>
  )
}
"""

routes_old = """      <Routes>
        <Route path="/" element={
          role === 'Patient' ? <PatientPortal token={token} /> : 
          role === 'Volunteer' ? <VolunteerPortal token={token} logout={logout} /> : 
          <Dashboard />
        } />
        <Route path="/opportunities" element={role === 'Volunteer' ? <VolunteerPortal token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/patients" element={<Patients token={token} logout={logout} />} />
        <Route path="/volunteers" element={<VolunteerCRM token={token} logout={logout} />} />
        <Route path="/grants" element={<AIWriter token={token} logout={logout} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>"""

routes_new = """      <Routes>
        <Route path="/" element={
          role === 'Patient' ? <PatientPortal token={token} /> : 
          role === 'Volunteer' ? <VolunteerPortal token={token} logout={logout} /> : 
          role === 'Doctor' ? <DoctorDashboard token={token} logout={logout} /> :
          <Dashboard />
        } />
        <Route path="/opportunities" element={role === 'Volunteer' ? <VolunteerPortal token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/patients" element={['Doctor', 'Admin'].includes(role) ? <Patients token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/volunteers" element={role === 'Admin' ? <VolunteerCRM token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/grants" element={role === 'Admin' ? <AIWriter token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>"""

content = content.replace(routes_old, routes_new)

if "const DoctorDashboard =" not in content:
    content = content.replace("const Dashboard = () => (", doctor_dashboard + "\nconst Dashboard = () => (")

with open('apps/frontend/src/App.tsx', 'w') as f:
    f.write(content)
