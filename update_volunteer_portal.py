import re

with open('apps/frontend/src/App.tsx', 'r') as f:
    content = f.read()

# Replace VolunteerPortal component
portal_old = """const VolunteerPortal = ({ token, logout }: { token: string, logout: () => void }) => {
  const [profile, setProfile] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  
  useEffect(() => {
    fetch(API_URL + '/api/protected/vms/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() }).then(data => setProfile(data)).catch(console.error)
      
    fetch(API_URL + '/api/protected/vms/events', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() }).then(data => setEvents(data)).catch(console.error)
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
}"""

portal_new = """const VolunteerPortal = ({ token, logout }: { token: string, logout: () => void }) => {
  const [profile, setProfile] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const location = useLocation()
  
  const isOpportunities = location.pathname.includes('/opportunities')

  useEffect(() => {
    fetch(API_URL + '/api/protected/vms/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() }).then(data => setProfile(data)).catch(console.error)
      
    fetch(API_URL + '/api/protected/vms/events', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => { if(res.status===401) logout(); return res.json() }).then(data => setEvents(data)).catch(console.error)
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
    setSelectedEvent(null)
  }

  // Check if user is already registered for selected event
  const isRegistered = selectedEvent && profile?.shifts?.some((s: any) => s.title === selectedEvent.title && new Date(s.date).getTime() === new Date(selectedEvent.date).getTime())

  if (selectedEvent) {
    return (
      <div className="animate-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSelectedEvent(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
          <ArrowLeft size={18} /> Back to {isOpportunities ? 'Opportunities' : 'Dashboard'}
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>
          <div className="px-8 pb-8 relative">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center -mt-10 mb-4 border border-gray-100">
              <Calendar className="text-indigo-600 h-10 w-10"/>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Clinical Opportunity</span>
                  {isRegistered && <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12}/> Registered</span>}
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{selectedEvent.title}</h1>
              </div>
              <div className="flex gap-3">
                <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                  <FileText size={20} />
                </button>
                {!isRegistered && (
                  <button onClick={() => handleRegister(selectedEvent.id)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <Sparkles size={18}/> Sign Up for Shift
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 py-8 border-y border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-xl"><Clock className="text-gray-600 h-6 w-6"/></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Date & Time</p>
                  <p className="text-gray-500 text-sm mt-1">{new Date(selectedEvent.date).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-xl"><MapPin className="text-gray-600 h-6 w-6"/></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Location</p>
                  <p className="text-gray-500 text-sm mt-1">{selectedEvent.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-xl"><Users className="text-gray-600 h-6 w-6"/></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Capacity</p>
                  <p className="text-gray-500 text-sm mt-1">{selectedEvent.required_volunteers} volunteers needed</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About this opportunity</h3>
              <div className="text-gray-600 leading-relaxed space-y-4 whitespace-pre-wrap">
                {selectedEvent.description}
              </div>
            </div>
            
            <div className="mt-8 bg-indigo-50 rounded-2xl p-6 flex items-start gap-4 border border-indigo-100">
              <ShieldAlert className="text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-indigo-900 mb-1">Prerequisites & Requirements</h4>
                <p className="text-indigo-700 text-sm">Please ensure you have completed your mandatory compliance training and have your badge ready. Dress code is scrubs or business casual.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{isOpportunities ? 'All Opportunities' : 'Volunteer Dashboard'}</h1>
          <p className="text-gray-500 mt-1">{isOpportunities ? 'Browse and sign up for upcoming clinical and community events.' : 'Track your hours and upcoming shifts.'}</p>
        </div>
      </div>
      
      {!isOpportunities && profile && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex items-center gap-4 col-span-1">
              <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600"><Clock size={28}/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Hours Volunteered</p>
                <h2 className="text-3xl font-bold text-gray-900">{profile.total_hours} hrs</h2>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar size={20} className="text-indigo-500"/> My Schedule</h2>
              <div className="space-y-3">
                {profile.shifts && profile.shifts.map((s: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 text-indigo-700 font-bold p-2 px-3 rounded-lg text-center leading-tight shadow-sm">
                        <div className="text-xs uppercase">{new Date(s.date).toLocaleString('default', { month: 'short' })}</div>
                        <div className="text-lg">{new Date(s.date).getDate()}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{s.title}</h4>
                        <p className="text-sm text-gray-500">{s.location}</p>
                      </div>
                    </div>
                    <div>
                      {s.status === 'Pending' && <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium border border-amber-200">Upcoming</span>}
                      {s.status === 'Confirmed' && <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium border border-emerald-200">Completed</span>}
                      {s.status === 'No-Show' && <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-medium border border-rose-200">Missed</span>}
                    </div>
                  </div>
                ))}
                {(!profile.shifts || profile.shifts.length === 0) && <div className="text-gray-400 text-sm text-center p-6 border border-dashed rounded-xl border-gray-200">No shifts scheduled yet.</div>}
              </div>
            </div>
          </div>
          
          <div className="mt-10 mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Featured Opportunities</h2>
          </div>
        </>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.slice(0, isOpportunities ? undefined : 3).map(e => (
          <div key={e.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg hover:border-indigo-200 transition-all group cursor-pointer" onClick={() => setSelectedEvent(e)}>
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-600 transition-colors"><Calendar className="text-indigo-600 group-hover:text-white transition-colors h-6 w-6"/></div>
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{new Date(e.date).toLocaleDateString()}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{e.title}</h3>
            <p className="text-sm text-gray-500 flex-1 line-clamp-2 mb-4">{e.description}</p>
            
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-500 font-medium flex items-center gap-1"><MapPin size={14}/> {e.location.split(',')[0]}</div>
              <span className="text-indigo-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">Details <ChevronRight size={16}/></span>
            </div>
          </div>
        ))}
        {events.length === 0 && <div className="col-span-full text-center p-10 bg-white rounded-2xl border border-gray-100 text-gray-500">No upcoming events found.</div>}
      </div>
    </div>
  )
}"""

content = content.replace(portal_old, portal_new)

with open('apps/frontend/src/App.tsx', 'w') as f:
    f.write(content)
