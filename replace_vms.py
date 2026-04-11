import re

with open('apps/frontend/src/App.tsx', 'r') as f:
    content = f.read()

new_vms = """const VolunteerCRM = ({ token, logout }: { token: string, logout: () => void }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [events, setEvents] = useState<any[]>([])
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [pendingHours, setPendingHours] = useState<any[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', requiredVolunteers: 1 })
  
  const [stats, setStats] = useState<any>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [eventParticipants, setEventParticipants] = useState<any[]>([])

  const [flierData, setFlierData] = useState({ eventDetails: '', tone: 'Professional & Urgency' })
  const [flierResult, setFlierResult] = useState<any>(null)
  const [flierLoading, setFlierLoading] = useState(false)

  const fetchData = async () => {
    try {
      const [eventsRes, volRes, hoursRes, statsRes] = await Promise.all([
        fetch(API_URL + '/api/protected/vms/events', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(API_URL + '/api/protected/vms/volunteers', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(API_URL + '/api/protected/vms/hours/pending', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(API_URL + '/api/protected/vms/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      ])
      
      if (eventsRes.status === 401) return logout()
      
      setEvents(await eventsRes.json())
      setVolunteers(await volRes.json())
      setPendingHours(await hoursRes.json())
      setStats(await statsRes.json())
    } catch(e) { console.error(e) }
  }

  useEffect(() => { fetchData() }, [])

  const fetchParticipants = async (eventId: string) => {
    const res = await fetch(API_URL + `/api/protected/vms/events/${eventId}/participants`, { headers: { 'Authorization': `Bearer ${token}` } })
    setEventParticipants(await res.json())
  }
  
  const handleManageEvent = (e: any) => {
    setSelectedEvent(e)
    fetchParticipants(e.id)
  }

  const handleUpdateAttendance = async (eventId: string, userId: string, status: string, hours: number = 0) => {
    await fetch(API_URL + `/api/protected/vms/events/${eventId}/attendance/${userId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, hours })
    })
    fetchParticipants(eventId)
    fetchData()
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(API_URL + '/api/protected/vms/events', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(eventForm)
    })
    setShowEventForm(false)
    setEventForm({ title: '', description: '', date: '', location: '', requiredVolunteers: 1 })
    fetchData()
  }

  const handleConfirmHours = async (id: string) => {
    await fetch(API_URL + `/api/protected/vms/hours/confirm/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchData()
  }

  const handleRegisterEvent = async (id: string) => {
    await fetch(API_URL + `/api/protected/vms/events/${id}/register`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    alert('Successfully registered for event!')
  }

  const handleGenerateFlier = async () => {
    setFlierLoading(true)
    const res = await fetch(API_URL + '/api/protected/vms/fliers/generate', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(flierData)
    })
    const data = await res.json()
    setFlierResult(data.flierCopy)
    setFlierLoading(false)
  }

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Volunteer CRM</h1>
          <p className="text-gray-500 mt-1">Engage volunteers, manage attendance, and track participation.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => {setActiveTab('dashboard'); setSelectedEvent(null)}} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Dashboard</button>
          <button onClick={() => {setActiveTab('events'); setSelectedEvent(null)}} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'events' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Events</button>
          <button onClick={() => {setActiveTab('directory'); setSelectedEvent(null)}} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'directory' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Directory</button>
          <button onClick={() => {setActiveTab('hours'); setSelectedEvent(null)}} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'hours' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            Pending Hours {pendingHours.length > 0 && <span className="ml-2 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs">{pendingHours.length}</span>}
          </button>
          <button onClick={() => {setActiveTab('marketing'); setSelectedEvent(null)}} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'marketing' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Marketing</button>
        </div>
      </div>
      
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 p-3 rounded-xl"><Users className="text-indigo-600 h-6 w-6"/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Volunteers</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.total_volunteers}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-xl"><Calendar className="text-blue-600 h-6 w-6"/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Events</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.active_events}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 p-3 rounded-xl"><CheckCircle2 className="text-emerald-600 h-6 w-6"/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.completion_rate}%</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="bg-rose-50 p-3 rounded-xl"><AlertTriangle className="text-rose-600 h-6 w-6"/></div>
              <div>
                <p className="text-sm font-medium text-gray-500">No-Show Rate</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.no_show_rate}%</h3>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="text-indigo-500" size={20}/> Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => {setActiveTab('events'); setShowEventForm(true)}} className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors flex items-center justify-between group">
                  <span className="font-medium text-gray-700 group-hover:text-indigo-700">Create a New Event</span>
                  <Plus size={18} className="text-gray-400 group-hover:text-indigo-600"/>
                </button>
                <button onClick={() => setActiveTab('hours')} className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors flex items-center justify-between group">
                  <span className="font-medium text-gray-700 group-hover:text-emerald-700">Review Pending Hours</span>
                  <CheckCircle2 size={18} className="text-gray-400 group-hover:text-emerald-600"/>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Schedule</h2>
              <div className="space-y-4">
                {events.slice(0, 3).map(e => (
                  <div key={e.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {setActiveTab('events'); handleManageEvent(e)}}>
                    <div className="bg-gray-100 p-2.5 rounded-lg text-center min-w-[50px]">
                      <div className="text-xs font-bold text-gray-500 uppercase">{new Date(e.date).toLocaleString('default', { month: 'short' })}</div>
                      <div className="text-lg font-bold text-gray-900 leading-none">{new Date(e.date).getDate()}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{e.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14}/> {e.location}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 ml-auto"/>
                  </div>
                ))}
                {events.length === 0 && <div className="text-gray-500 text-sm">No upcoming events scheduled.</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6">
          {!selectedEvent && <div className="flex justify-end">
            <button onClick={() => setShowEventForm(!showEventForm)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors">
              {showEventForm ? 'Cancel' : <><Plus size={18} /> Create Event</>}
            </button>
          </div>}
          
          {showEventForm && !selectedEvent && (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-in fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-4">New Volunteer Event</h2>
              <form onSubmit={handleCreateEvent} className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Event Title" className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required/>
                <input type="datetime-local" className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} required/>
                <input type="text" placeholder="Location" className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} required/>
                <input type="number" placeholder="Required Volunteers" className="border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={eventForm.requiredVolunteers} onChange={e => setEventForm({...eventForm, requiredVolunteers: parseInt(e.target.value)})} required min="1"/>
                <textarea placeholder="Event Description" className="col-span-2 border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} required/>
                <div className="col-span-2 flex justify-end">
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700">Save Event</button>
                </div>
              </form>
            </div>
          )}

          {!selectedEvent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map(e => (
                <div key={e.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-100 transition-colors"><Calendar className="text-indigo-600 h-6 w-6"/></div>
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{new Date(e.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{e.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 flex-1 line-clamp-2">{e.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-600"><span className="font-semibold text-gray-900">{e.required_volunteers}</span> needed</div>
                    <div className="flex gap-2">
                      <button onClick={() => handleRegisterEvent(e.id)} className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors">Join</button>
                      <button onClick={() => handleManageEvent(e)} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">Manage <ChevronRight size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">No upcoming events.</div>}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <button onClick={() => setSelectedEvent(null)} className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm font-medium mb-2 transition-colors">
                    <ArrowLeft size={16} /> Back to Events
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1"><MapPin size={14}/> {selectedEvent.location} &bull; {new Date(selectedEvent.date).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Volunteers</div>
                  <div className="text-2xl font-bold text-indigo-600">{eventParticipants.length} <span className="text-gray-400 text-lg font-normal">/ {selectedEvent.required_volunteers}</span></div>
                </div>
              </div>
              
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Participant</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Attendance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {eventParticipants.map(p => (
                    <tr key={p.registration_id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">{p.email.charAt(0).toUpperCase()}</div>
                        {p.email}
                      </td>
                      <td className="p-4">
                        {p.status === 'Pending' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-max"><Clock size={12}/> Pending</span>}
                        {p.status === 'Confirmed' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Attended</span>}
                        {p.status === 'No-Show' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 w-max"><XCircle size={12}/> No-Show</span>}
                      </td>
                      <td className="p-4 text-gray-600 font-mono">{p.hours_logged || 0}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleUpdateAttendance(selectedEvent.id, p.user_id, 'Confirmed', 4)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors tooltip-trigger" title="Mark Attended">
                            <CheckCircle2 size={20} />
                          </button>
                          <button onClick={() => handleUpdateAttendance(selectedEvent.id, p.user_id, 'No-Show', 0)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors tooltip-trigger" title="Mark No-Show">
                            <XCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {eventParticipants.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No volunteers registered yet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'directory' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Volunteer Email</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {volunteers.map(v => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">{v.email.charAt(0).toUpperCase()}</div>
                    {v.email}
                  </td>
                  <td className="p-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">{v.role}</span></td>
                  <td className="p-4 text-gray-600 font-mono font-medium">{v.total_hours} hrs</td>
                </tr>
              ))}
              {volunteers.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-gray-500">No volunteers registered.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'hours' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Volunteer</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logged Hours</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingHours.map(h => (
                <tr key={h.registration_id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{h.volunteer_email}</td>
                  <td className="p-4 text-gray-600">{h.event_title}</td>
                  <td className="p-4 font-mono text-indigo-600 font-semibold">{h.hours_logged} hrs</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleConfirmHours(h.registration_id)} className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-emerald-200">
                      <CheckCircle2 size={16} /> Confirm
                    </button>
                  </td>
                </tr>
              ))}
              {pendingHours.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No pending hours to approve.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'marketing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="text-indigo-500"/> AI Flier Generator</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Details & Roles Needed</label>
                <textarea className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none" value={flierData.eventDetails} onChange={e => setFlierData({...flierData, eventDetails: e.target.value})} placeholder="e.g. Free flu shot clinic this Saturday at Main St. Need 5 nurses and 2 coordinators." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Tone</label>
                <select className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={flierData.tone} onChange={e => setFlierData({...flierData, tone: e.target.value})}>
                  <option>Professional & Urgency</option>
                  <option>Friendly & Community-Focused</option>
                  <option>Student/Academic (Internship Focus)</option>
                </select>
              </div>
              <button onClick={handleGenerateFlier} disabled={flierLoading} className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                {flierLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <><Sparkles size={18}/> Generate Flier Copy</>}
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Generated Preview</h2>
            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-6 overflow-y-auto whitespace-pre-wrap font-serif text-gray-800 shadow-inner">
              {flierResult || <div className="h-full flex items-center justify-center text-gray-400 text-sm">Your generated flier copy will appear here.</div>}
            </div>
            {flierResult && <button className="mt-4 w-full bg-gray-900 text-white px-4 py-3 rounded-xl font-medium shadow-sm hover:bg-gray-800 transition-colors">Export Content</button>}
          </div>
        </div>
      )}
    </>
  )
}"""

start_idx = content.find("const VolunteerCRM =")
end_idx = content.find("const AIWriter =", start_idx)

if start_idx != -1 and end_idx != -1:
    new_file = content[:start_idx] + new_vms + "\n\n" + content[end_idx:]
    with open('apps/frontend/src/App.tsx', 'w') as f:
        f.write(new_file)
    print("Replaced VolunteerCRM successfully.")
else:
    print("Failed to find boundaries.")
