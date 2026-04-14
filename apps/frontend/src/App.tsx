import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { Activity, Users, FileText, LogOut, Calendar, Plus, Search, Bell, TrendingUp, ShieldAlert, HeartPulse, Clock, Sparkles, CheckCircle2, AlertTriangle, ChevronRight, ArrowLeft, XCircle, MapPin, Package, Beaker } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API_URL = 'https://envision-health-backend.sahastasai.workers.dev'

// --- Mock Data for Dashboard ---
const chartData = [
  { name: 'Jan', patients: 400, volunteers: 24 },
  { name: 'Feb', patients: 600, volunteers: 28 },
  { name: 'Mar', patients: 800, volunteers: 35 },
  { name: 'Apr', patients: 750, volunteers: 40 },
  { name: 'May', patients: 900, volunteers: 42 },
  { name: 'Jun', patients: 1248, volunteers: 50 },
]

// --- Components ---
const AuthPage = ({ setToken, setRole }: { setToken: (t: string) => void, setRole: (r: string) => void }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setFormRole] = useState('Admin')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    try {
      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: isLogin ? undefined : role })
      })
      const data = await res.json()
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('role', data.user.role)
          setRole(data.user.role)
          setToken(data.token)
          navigate('/')
        } else {
          setMsg('Registration successful! Please log in.')
          setIsLogin(true)
        }
      } else {
        setMsg(data.error || 'Authentication failed')
      }
    } catch (err) {
      setMsg('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <HeartPulse className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Envision</h2>
          </div>
          <h2 className="mt-8 text-2xl font-bold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Join the mission'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Or " : "Already registered? "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              {isLogin ? 'create a new account' : 'sign in instead'}
            </button>
          </p>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all" />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <div className="mt-1">
                    <select value={role} onChange={e => setFormRole(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all">
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Patient">Patient (Portal Access)</option>
                    </select>
                  </div>
                </div>
              )}

              {msg && <div className={`p-3 rounded-lg text-sm ${msg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{msg}</div>}

              <button type="submit" disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all">
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Medical clinic" />
        <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-[2px] mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl lg:text-6xl drop-shadow-lg">
              Healthcare, revolutionized.
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl drop-shadow">
              A unified platform for managing patients, empowering volunteers, and securing funding through AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const NavLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
   const location = useLocation()
   const isActive = location.pathname === to
   return (
     <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600/10 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
       <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
       {children}
     </Link>
   )
}

const SearchHeader = ({ token, role }: { token: string, role: string }) => {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState<any>(null)
   const [open, setOpen] = useState(false)

   const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value
     setQuery(value)
     
     if (value.length < 2) {
       setResults(null)
       return
     }

     try {
       const res = await fetch(`${API_URL}/api/protected/search?q=${encodeURIComponent(value)}`, {
         headers: { 'Authorization': `Bearer ${token}` }
       })
       const data = await res.json()
       setResults(data)
       setOpen(true)
     } catch (err) {
       console.error('Search error:', err)
     }
   }

   return (
     <div className="relative w-96">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
       <input
         type="text"
         value={query}
         onChange={handleSearch}
         onFocus={() => query && setOpen(true)}
         onBlur={() => setTimeout(() => setOpen(false), 200)}
         placeholder={
           role === 'Doctor' || role === 'Admin'
             ? 'Search patients, volunteers, events...'
             : 'Search events or opportunities...'
         }
         className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
       />
       {open && results && (
         <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
           {results.patients && results.patients.length > 0 && (
             <div className="p-2 border-b border-gray-100">
               <p className="text-xs font-semibold text-gray-500 px-2 py-1">Patients</p>
               {results.patients.map((p: any) => (
                 <div key={p.id} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                   {p.first_name} {p.last_name}
                 </div>
               ))}
             </div>
           )}
           {results.volunteers && results.volunteers.length > 0 && (
             <div className="p-2 border-b border-gray-100">
               <p className="text-xs font-semibold text-gray-500 px-2 py-1">Volunteers</p>
               {results.volunteers.map((v: any) => (
                 <div key={v.id} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                   {v.email} - {v.total_hours}h
                 </div>
               ))}
             </div>
           )}
           {results.events && results.events.length > 0 && (
             <div className="p-2">
               <p className="text-xs font-semibold text-gray-500 px-2 py-1">Events</p>
               {results.events.map((e: any) => (
                 <div key={e.id} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                   {e.title}
                 </div>
               ))}
             </div>
           )}
         </div>
       )}
     </div>
   )
}

const Layout = ({ children, logout, role }: { children: React.ReactNode, logout: () => void, role: string }) => (
  <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-100">
    {/* Sidebar */}
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-200 shadow-lg">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
            Envision Hub
          </span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
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
            <NavLink to="/inventory" icon={Package}>Inventory</NavLink>
            <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">Finance & Growth</div>
            <NavLink to="/grants" icon={FileText}>AI Grant Writer</NavLink>
          </>
        )}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {role.charAt(0)}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{role}</p>
              <p className="text-gray-500 text-xs">Logged In</p>
            </div>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col overflow-hidden relative">
       {/* Top Header */}
       <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
         <div className="flex items-center gap-4 flex-1">
           <SearchHeader token={localStorage.getItem('token') || ''} role={role} />
         </div>
         <div className="flex items-center gap-4">
           <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors" title="View notifications">
             <Bell size={20} />
             <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
           </button>
         </div>
       </header>
      
      {/* Scrollable Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  </div>
)

const StatCard = ({ title, value, trend, icon: Icon, trendUp }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-md transition-all">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
      <div className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
        <TrendingUp className={`h-4 w-4 ${!trendUp && 'rotate-180'}`} />
        <span className="font-medium">{trend}</span>
        <span className="text-gray-400 ml-1">vs last month</span>
      </div>
    </div>
    <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-100 transition-colors">
      <Icon className="h-6 w-6 text-indigo-600" />
    </div>
  </div>
)

const PatientPortal = ({ token }: { token: string }) => {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    fetch(API_URL + '/api/protected/patient/me', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setData(d))
  }, [token])

  if (!data) return <div className="p-8 text-center text-gray-500">Loading your medical records...</div>
  if (data.error) return <div className="p-8 text-center text-red-500">{data.error}</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">My Health Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{data.first_name} {data.last_name}</p></div>
            <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-medium">{new Date(data.dob).toLocaleDateString()}</p></div>
            <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{data.phone || 'Not provided'}</p></div>
            <div><p className="text-sm text-gray-500">Address</p><p className="font-medium">{data.address || 'Not provided'}</p></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold mb-2">Upcoming Appointment</h2>
          <p className="text-3xl font-light mb-1">None Scheduled</p>
          <button className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">Request Appointment</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <ShieldAlert className="text-indigo-600 h-5 w-5" />
          <h2 className="text-lg font-bold text-gray-900">Encrypted Health Summary</h2>
        </div>
        <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-xl font-mono text-sm border border-gray-100">
          {data.medicalData?.history ? (
            <div>
              <p><strong>Clinical History:</strong> {data.medicalData.history}</p>
              {data.medicalData.vitals && <p><strong>Recent Vitals:</strong> {data.medicalData.vitals}</p>}
              {data.medicalData.medications && <p><strong>Medications:</strong> {data.medicalData.medications}</p>}
            </div>
          ) : (
             <p>{data.medicalData?.history || 'No detailed records found. Please consult your physician.'}</p>
          )}
        </div>
      </div>
    </div>
  )
}


const VolunteerPortal = ({ token, logout }: { token: string, logout: () => void }) => {
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
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{selectedEvent.category || 'Opportunity'}</span>
                  {selectedEvent.is_recurring === 1 && <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1"><Activity size={12}/> Recurring: {selectedEvent.recurrence_pattern}</span>}
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
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(selectedEvent.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    {selectedEvent.end_date ? ` - ${new Date(selectedEvent.end_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}` : ''}
                  </p>
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

       {!isOpportunities && <VolunteerApplication token={token} />}
       
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
              <div className="flex gap-2">
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{new Date(e.date).toLocaleDateString()}</span>
                {e.category && <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">{e.category}</span>}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              {e.title}
              {e.is_recurring === 1 && <span title={`Recurring: ${e.recurrence_pattern}`}><Activity size={14} className="text-purple-500" /></span>}
            </h3>
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
}


const DoctorDashboard = ({ token, logout }: { token: string, logout: () => void }) => {
  const [patients, setPatients] = useState<any[]>([])
  const navigate = useNavigate()
  
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
              <button onClick={() => navigate(`/patients?id=${p.id}`)} key={p.id} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group">
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
              </button>
            ))}
            {patients.length === 0 && <p className="text-gray-500 text-sm">No patients found.</p>}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => (
  <>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clinic Overview</h1>
        <p className="text-gray-500 mt-1">Here's what's happening at Envision today.</p>
      </div>
      <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
        <Calendar size={16} /> Last 30 Days
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Patients" value="1,248" trend="+12.5%" icon={Users} trendUp={true} />
      <StatCard title="Active Volunteers" value="42" trend="+4.1%" icon={Activity} trendUp={true} />
      <StatCard title="Grants Secured" value="$124.5k" trend="+22.4%" icon={FileText} trendUp={true} />
      <StatCard title="Avg Wait Time" value="14m" trend="-2.5%" icon={Clock} trendUp={true} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Patient & Volunteer Growth</h2>
        </div>
        <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="patients" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="flex-1 space-y-6">
          {[
            { title: 'New patient registered', time: '10 mins ago', type: 'patient', color: 'bg-blue-50 text-blue-600' },
            { title: 'Volunteer shift completed', time: '1 hour ago', type: 'volunteer', color: 'bg-emerald-50 text-emerald-600' },
            { title: 'Grant proposal generated', time: '3 hours ago', type: 'grant', color: 'bg-purple-50 text-purple-600' },
            { title: 'Inventory: Supplies low', time: '5 hours ago', type: 'alert', color: 'bg-rose-50 text-rose-600' },
            { title: 'New appointment booked', time: '1 day ago', type: 'appointment', color: 'bg-orange-50 text-orange-600' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${activity.color}`}>
                {activity.type === 'patient' && <Users size={16} />}
                {activity.type === 'volunteer' && <Activity size={16} />}
                {activity.type === 'grant' && <FileText size={16} />}
                {activity.type === 'alert' && <ShieldAlert size={16} />}
                {activity.type === 'appointment' && <Calendar size={16} />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)


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

const Patients = ({ token, logout }: { token: string, logout: () => void }) => {
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

  const fetchPatients = async () => {
    try {
      const res = await fetch(API_URL + '/api/protected/patients', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      })
      if (res.ok) {
        setPatients(await res.json())
      } else if (res.status === 401) {
        logout() // Auto logout if token is invalid/expired
      }
    } catch (e) {
      console.error(e)
    } finally {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      dob: form.dob,
      email: form.email,
      phone: form.phone,
      address: form.address,
      medicalData: {
        history: form.history,
        vitals: form.vitals,
        medications: form.medications
      }
    }
    const res = await fetch(API_URL + '/api/protected/patients', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.status === 401) return logout()
    
    setShowForm(false)
    setForm({ firstName: '', lastName: '', dob: '', email: '', phone: '', address: '', history: '', vitals: '', medications: '' })
    fetchPatients()
  }

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Directory</h1>
          <p className="text-gray-500 mt-1">Manage electronic health records. Data is securely AES-256 encrypted.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors">
          {showForm ? 'Cancel' : <><Plus size={18} /> Add Patient</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300 mb-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">New Patient Record</h2>
              <p className="text-xs text-gray-500">All medical history input here is encrypted prior to database storage.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h3 className="font-semibold text-gray-700 uppercase tracking-wider text-xs">Demographics (Unencrypted Linking)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" className="w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Portal Email</label>
                <input type="email" placeholder="Optional. If Patient registered." className="w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})}/>
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 uppercase tracking-wider text-xs border-t pt-4">Clinical Data (AES-256 Encrypted)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recent Vitals</label>
                <input type="text" placeholder="BP: 120/80, HR: 72, Temp: 98.6" className="w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.vitals} onChange={e => setForm({...form, vitals: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                <input type="text" placeholder="Lisinopril 10mg" className="w-full border border-gray-300 p-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.medications} onChange={e => setForm({...form, medications: e.target.value})}/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinical History / Notes</label>
              <textarea placeholder="e.g. History of hypertension, allergic to penicillin..." className="w-full border border-gray-300 p-3 rounded-lg shadow-sm h-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" value={form.history} onChange={e => setForm({...form, history: e.target.value})} required/>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
                {loading ? 'Encrypting & Saving...' : 'Save Secure Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!selectedPatient ? (
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
                    <tr key={p.id} onClick={() => {navigate(`/patients?id=${p.id}`); setSelectedPatient(p); setShowForm(false);}} className="hover:bg-indigo-50 transition-colors cursor-pointer group">
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
                        <button onClick={(e) => {e.stopPropagation(); navigate(`/patients?id=${p.id}`); setSelectedPatient(p); setShowForm(false);}} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
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
             <button onClick={() => navigate(`/patients?id=${selectedPatient.id}&tab=consent`)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${tabParam === 'consent' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}><ShieldAlert size={16}/> Consent</button>
           </div>
          
          {tabParam === 'demographics' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Encrypted Clinical Data</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm whitespace-pre-wrap text-gray-700">
                {(() => {
                  try {
                    const parsed = JSON.parse(selectedPatient.medical_history)
                    return `Vitals: ${parsed.vitals || 'None recorded'}

Current Medications: ${parsed.medications || 'None recorded'}

Clinical History:
${parsed.history || 'No notes'}`
                  } catch {
                    return selectedPatient.medical_history || 'No secure data found.'
                  }
                })()}
              </div>
            </div>
          )}
          
          {tabParam === 'prescriptions' && (
            <PatientPrescriptions patientId={selectedPatient.id} token={token} patientHistory={selectedPatient.medical_history} onUpdate={fetchPatients} />
          )}
          
          {tabParam === 'labs' && (
             <PatientLabs patientId={selectedPatient.id} token={token} patientHistory={selectedPatient.medical_history} onUpdate={fetchPatients} />
           )}
           
           {tabParam === 'consent' && (
             <div className="space-y-4">
               <ConsentForm patientId={selectedPatient.id} token={token} />
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                 <h3 className="font-bold text-gray-900 mb-4">Consent Status</h3>
                 <p className="text-sm text-gray-600">Patient must provide explicit consent for all PHI access in accordance with HIPAA regulations.</p>
               </div>
             </div>
           )}
        </div>
      )}
    </>
  )
}


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

const VolunteerCRM = ({ token, logout }: { token: string, logout: () => void }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [events, setEvents] = useState<any[]>([])
  const [volunteers, setVolunteers] = useState<any[]>([])
  const [pendingHours, setPendingHours] = useState<any[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', endDate: '', category: 'General', isRecurring: false, recurrencePattern: '', location: '', requiredVolunteers: 1 })
  
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
    setEventForm({ title: '', description: '', date: '', endDate: '', category: 'General', isRecurring: false, recurrencePattern: '', location: '', requiredVolunteers: 1 })
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
           <button onClick={() => {setActiveTab('applications'); setSelectedEvent(null)}} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'applications' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Applications</button>
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
            <div className="bg-white rounded-3xl shadow-sm border border-indigo-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-indigo-100 flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm"><Sparkles className="text-indigo-600"/></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create Opportunity</h2>
                  <p className="text-sm text-gray-500">Draft a new clinical or community event for volunteers.</p>
                </div>
              </div>
              <form onSubmit={handleCreateEvent} className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2"><FileText size={16} className="text-indigo-500"/> Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Opportunity Title</label>
                          <input type="text" placeholder="e.g. Weekend Flu Clinic Registration" className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required/>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value})}>
                            <option value="General">General</option>
                            <option value="Clinical">Clinical</option>
                            <option value="Community">Community</option>
                            <option value="Administrative">Administrative</option>
                          </select>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Description & Expectations</label>
                        <textarea placeholder="Describe the responsibilities, what to wear, who to report to..." className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32 transition-shadow" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} required/>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2"><Clock size={16} className="text-indigo-500"/> Logistics & Capacity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                        <input type="datetime-local" className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                        <input type="datetime-local" className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.endDate} onChange={e => setEventForm({...eventForm, endDate: e.target.value})} required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / Department</label>
                        <input type="text" placeholder="e.g. Main Lobby, Clinic B" className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Volunteers Needed</label>
                        <input type="number" placeholder="Capacity" className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.requiredVolunteers} onChange={e => setEventForm({...eventForm, requiredVolunteers: parseInt(e.target.value)})} required min="1"/>
                      </div>
                      <div className="md:col-span-2 flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" checked={eventForm.isRecurring} onChange={e => setEventForm({...eventForm, isRecurring: e.target.checked})} />
                          Recurring Event
                        </label>
                        {eventForm.isRecurring && (
                          <select className="flex-1 border border-gray-300 p-2.5 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.recurrencePattern} onChange={e => setEventForm({...eventForm, recurrencePattern: e.target.value})}>
                            <option value="">Select Pattern...</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowEventForm(false)} className="px-6 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center gap-2">
                    Publish Opportunity <ChevronRight size={18}/>
                  </button>
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
                    <div className="flex gap-2">
                      <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{new Date(e.date).toLocaleDateString()}</span>
                      {e.category && <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">{e.category}</span>}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {e.title}
                    {e.is_recurring === 1 && <span title={`Recurring: ${e.recurrence_pattern}`}><Activity size={14} className="text-purple-500" /></span>}
                  </h3>
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

       {activeTab === 'applications' && (
         <VolunteerApplicationsDashboard token={token} logout={logout} />
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
}

const AIWriter = ({ token, logout }: { token: string, logout: () => void }) => {
  const [metrics, setMetrics] = useState('We served 500 low-income patients last month across 3 mobile clinics. We need $50,000 for new portable ultrasound equipment to expand our prenatal care division. Our volunteer retention is 92%.')
  const [prompt, setPrompt] = useState('Write an executive summary for a federal healthcare grant proposal.')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isMatchMode, setIsMatchMode] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const endpoint = isMatchMode ? '/api/protected/grants/match' : '/api/protected/grants/generate'
      const payload = isMatchMode ? { metrics } : { metrics, prompt }
      
      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.status === 401) return logout()
      const data = await res.json()
      setResult(isMatchMode ? data.matches : (data.proposal || data.error))
    } catch (e) {
      setResult("Error connecting to AI engine.")
    }
    setLoading(false)
  }

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Grant Writer & Scraper</h1>
          <p className="text-gray-500 mt-1">Match with live grants and auto-generate proposals using Llama-3.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => {setIsMatchMode(false); setResult(null)}} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${!isMatchMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Proposal Writer</button>
          <button onClick={() => {setIsMatchMode(true); setResult(null)}} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${isMatchMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>Scraper & Matcher</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-[600px]">
        {/* Left Side - Inputs */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-700">
                {isMatchMode ? <Search size={20} /> : <FileText size={20} />}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{isMatchMode ? 'Matching Parameters' : 'Proposal Parameters'}</h2>
            </div>
            
            <div className="flex-1 flex flex-col gap-5">
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Context & Metrics</label>
                <textarea 
                  className="w-full flex-1 min-h-[150px] border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none text-sm text-gray-700 bg-gray-50/50" 
                  value={metrics} 
                  onChange={e => setMetrics(e.target.value)} 
                />
              </div>
              {!isMatchMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Prompt / Instruction</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm" 
                    value={prompt} 
                    onChange={e => setPrompt(e.target.value)} 
                  />
                </div>
              )}
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={loading} 
              className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Activity className="animate-spin" size={18} /> {isMatchMode ? 'Matching...' : 'Generating...'}</>
              ) : (
                <>{isMatchMode ? <Sparkles size={18} /> : <FileText size={18} />} {isMatchMode ? 'Find Best Grants' : 'Generate Proposal'}</>
              )}
            </button>
          </div>
        </div>

        {/* Right Side - Output */}
        <div className="xl:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{isMatchMode ? 'Top Grant Matches' : 'Generated Output'}</h2>
            {result && typeof result === 'string' && <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Copy Output</button>}
          </div>
          <div className="flex-1 p-6 overflow-y-auto bg-[#fafafa]">
            {result ? (
              isMatchMode && Array.isArray(result) ? (
                <div className="space-y-4">
                  {result.map((match: any, idx: number) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-lg">{match.title || 'Unknown Grant'}</h3>
                        <span className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-sm">{match.match_score || 0}% Match</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{match.agency || 'Unknown Agency'}</p>
                      <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">{match.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="prose prose-indigo max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap font-serif">
                  {result}
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                {isMatchMode ? <Search size={48} className="text-gray-300 opacity-50" /> : <FileText size={48} className="text-gray-300 opacity-50" />}
                <p>Fill out the parameters on the left and click {isMatchMode ? 'Find Best Grants' : 'Generate'}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Consent Management Component
const ConsentForm = ({ patientId, token }: { patientId: string, token: string }) => {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleConsent = async (consentType: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/protected/patients/${patientId}/consent`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentType })
      })
      if (res.ok) {
        setStatus('Consent recorded successfully')
      }
    } catch (err) {
      setStatus('Error recording consent')
    }
    setLoading(false)
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 mb-2">Privacy & Consent</h3>
      <p className="text-sm text-blue-800 mb-4">Please approve access to your medical records for HIPAA compliance.</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleConsent('PHI')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Approve Access
        </button>
        <button
          onClick={() => handleConsent('Decline')}
          disabled={loading}
          className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
        >
          Decline
        </button>
      </div>
      {status && <p className="text-sm mt-2 text-blue-900">{status}</p>}
    </div>
  )
}

// Volunteer Application Component
const VolunteerApplication = ({ token }: { token: string }) => {
  const [qualifications, setQualifications] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/protected/volunteers/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualifications })
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Error submitting application:', err)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-green-900 font-semibold">Application Submitted!</p>
        <p className="text-sm text-green-800 mt-1">Your application is pending admin approval.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Volunteer Application</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Qualifications & Experience
          </label>
          <textarea
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            placeholder="Describe your medical background, certifications, and volunteer experience..."
            required
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !qualifications.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}

// Volunteer Applications Dashboard (Admin/Doctor view)
const VolunteerApplicationsDashboard = ({ token, logout }: { token: string, logout: () => void }) => {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/protected/volunteers/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.status === 401) return logout()
      const data = await res.json()
      setApplications(data)
    } catch (err) {
      console.error('Error fetching applications:', err)
    }
    setLoading(false)
  }

  const handleApprove = async (appId: string) => {
    try {
      await fetch(`${API_URL}/api/protected/volunteers/applications/${appId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ approval_notes: 'Approved' })
      })
      fetchApplications()
    } catch (err) {
      console.error('Error approving application:', err)
    }
  }

  const handleReject = async (appId: string) => {
    try {
      await fetch(`${API_URL}/api/protected/volunteers/applications/${appId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ approval_notes: 'Rejected' })
      })
      fetchApplications()
    } catch (err) {
      console.error('Error rejecting application:', err)
    }
  }

  const filteredApplications = applications.filter(
    (app) =>
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.qualifications.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="p-8 text-center">Loading applications...</div>

  const pendingApps = filteredApplications.filter((a) => a.status === 'Pending')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Volunteer Applications</h1>
        <p className="text-gray-500 mt-1">Review and approve volunteer applications</p>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by email or qualifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid gap-4">
        {pendingApps.length > 0 ? (
          pendingApps.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{app.email}</h3>
                  <p className="text-sm text-gray-500">Applied {new Date(app.created_at).toLocaleDateString()}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{app.qualifications}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(app.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(app.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No pending applications</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Event Time Slots Component
// @ts-ignore - Component used for future event management features
const EventTimeSlots = ({ eventId, token }: { eventId: string, token: string }) => {
  const [timeSlots, setTimeSlots] = useState<any[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [capacity, setCapacity] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTimeSlots()
  }, [eventId])

  const fetchTimeSlots = async () => {
    try {
      const res = await fetch(`${API_URL}/api/protected/events/${eventId}/time-slots`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setTimeSlots(data)
    } catch (err) {
      console.error('Error fetching time slots:', err)
    }
  }

  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/protected/events/${eventId}/time-slots`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_time: startTime, end_time: endTime, capacity })
      })
      if (res.ok) {
        setStartTime('')
        setEndTime('')
        setCapacity(1)
        fetchTimeSlots()
      }
    } catch (err) {
      console.error('Error adding time slot:', err)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Available Time Slots</h3>
      
      <form onSubmit={handleAddTimeSlot} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            {[1, 2, 5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n} slots
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Add Time Slot
        </button>
      </form>

      <div className="space-y-2">
        {timeSlots.map((slot) => (
          <div key={slot.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">
                {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-500">{slot.capacity} available slots</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {slot.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [role, setRole] = useState(localStorage.getItem('role') || 'Admin')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken('')
  }

  // Basic check for token format to avoid immediate 401s if clearly malformed
  useEffect(() => {
    if (token && token.split('.').length !== 3) {
      logout()
    }
  }, [token])

  if (!token) return <AuthPage setToken={setToken} setRole={setRole} />

  return (
    <Layout logout={logout} role={role}>
      <Routes>
        <Route path="/" element={
          role === 'Patient' ? <PatientPortal token={token} /> : 
          role === 'Volunteer' ? <VolunteerPortal token={token} logout={logout} /> : 
          role === 'Doctor' ? <DoctorDashboard token={token} logout={logout} /> :
          <Dashboard />
        } />
        <Route path="/opportunities" element={role === 'Volunteer' ? <VolunteerPortal token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/patients" element={['Doctor', 'Admin'].includes(role) ? <Patients token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/volunteers" element={role === 'Admin' ? <VolunteerCRM token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/inventory" element={['Admin', 'Doctor'].includes(role) ? <Inventory token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="/grants" element={role === 'Admin' ? <AIWriter token={token} logout={logout} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}
