import re

with open('apps/frontend/src/App.tsx', 'r') as f:
    content = f.read()

nav_old = """      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {role === 'Patient' ? (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">My Health</div>
            <NavLink to="/" icon={Activity}>My Portal</NavLink>
            <NavLink to="/appointments" icon={Calendar}>My Appointments</NavLink>
          </>
        ) : (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Overview</div>
            <NavLink to="/" icon={Activity}>Dashboard</NavLink>
            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Clinic</div>
            <NavLink to="/patients" icon={Users}>Patient EHR</NavLink>
            <NavLink to="/volunteers" icon={HeartPulse}>Volunteer CRM</NavLink>
            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Finance & Growth</div>
            <NavLink to="/grants" icon={FileText}>AI Grant Writer</NavLink>
          </>
        )}
      </nav>"""

nav_new = """      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {role === 'Patient' && (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">My Health</div>
            <NavLink to="/" icon={Activity}>My Portal</NavLink>
            <NavLink to="/appointments" icon={Calendar}>My Appointments</NavLink>
          </>
        )}
        {role === 'Volunteer' && (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Volunteer Portal</div>
            <NavLink to="/" icon={Activity}>My Dashboard</NavLink>
            <NavLink to="/opportunities" icon={Calendar}>Opportunities</NavLink>
          </>
        )}
        {role === 'Doctor' && (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Overview</div>
            <NavLink to="/" icon={Activity}>My Dashboard</NavLink>
            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Clinic</div>
            <NavLink to="/patients" icon={Users}>Patient EHR</NavLink>
          </>
        )}
        {role === 'Admin' && (
          <>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Overview</div>
            <NavLink to="/" icon={Activity}>Dashboard</NavLink>
            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Clinic</div>
            <NavLink to="/patients" icon={Users}>Patient EHR</NavLink>
            <NavLink to="/volunteers" icon={HeartPulse}>Volunteer CRM</NavLink>
            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Finance & Growth</div>
            <NavLink to="/grants" icon={FileText}>AI Grant Writer</NavLink>
          </>
        )}
      </nav>"""

content = content.replace(nav_old, nav_new)

volunteer_portal = """
const VolunteerPortal = ({ token, logout }: { token: string, logout: () => void }) => {
  const [profile, setProfile] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  
  useEffect(() => {
    fetch(API_URL + '/api/protected/vms/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setProfile(data)).catch(console.error)
      
    fetch(API_URL + '/api/protected/vms/events', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setEvents(data)).catch(console.error)
  }, [token])

  const handleRegister = async (id: string) => {
    await fetch(API_URL + `/api/protected/vms/events/${id}/register`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    alert('Successfully registered for shift!')
    // Refresh profile
    fetch(API_URL + '/api/protected/vms/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setProfile(data)).catch(console.error)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Volunteer Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your hours and upcoming shifts.</p>
        </div>
      </div>
      
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex items-center gap-4 col-span-1">
            <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600"><Clock size={28}/></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Hours Volunteered</p>
              <h2 className="text-3xl font-bold text-gray-900">{profile.total_hours} hrs</h2>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Schedule</h2>
            <div className="space-y-3">
              {profile.shifts && profile.shifts.map((s: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 text-indigo-700 font-bold p-2 px-3 rounded-lg text-center leading-tight">
                      <div className="text-xs uppercase">{new Date(s.date).toLocaleString('default', { month: 'short' })}</div>
                      <div className="text-lg">{new Date(s.date).getDate()}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{s.title}</h4>
                      <p className="text-sm text-gray-500">{s.location}</p>
                    </div>
                  </div>
                  <div>
                    {s.status === 'Pending' && <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">Upcoming</span>}
                    {s.status === 'Confirmed' && <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">Completed</span>}
                    {s.status === 'No-Show' && <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-medium">Missed</span>}
                  </div>
                </div>
              ))}
              {(!profile.shifts || profile.shifts.length === 0) && <p className="text-gray-500 text-sm">No shifts scheduled yet.</p>}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(e => (
            <div key={e.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 p-3 rounded-xl"><Calendar className="text-indigo-600 h-6 w-6"/></div>
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{new Date(e.date).toLocaleDateString()}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{e.title}</h3>
              <p className="text-sm text-gray-500 mt-2 flex-1 line-clamp-2">{e.description}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-600"><MapPin size={14} className="inline mr-1"/> {e.location}</div>
                <button onClick={() => handleRegister(e.id)} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Sign Up</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
"""

routes_old = """      <Routes>
        <Route path="/" element={role === 'Patient' ? <PatientPortal token={token} /> : <Dashboard />} />
        <Route path="/patients" element={<Patients token={token} logout={logout} />} />
        <Route path="/volunteers" element={<VolunteerCRM token={token} logout={logout} />} />
        <Route path="/grants" element={<AIWriter token={token} logout={logout} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>"""

routes_new = """      <Routes>
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

content = content.replace(routes_old, routes_new)

if "const VolunteerPortal =" not in content:
    content = content.replace("const Dashboard = () => (", volunteer_portal + "\nconst Dashboard = () => (")

with open('apps/frontend/src/App.tsx', 'w') as f:
    f.write(content)
