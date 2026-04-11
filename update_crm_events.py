import re

with open('apps/frontend/src/App.tsx', 'r') as f:
    content = f.read()

# Replace VolunteerCRM events view
crm_events_old = """          {showEventForm && !selectedEvent && (
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
          )}"""

crm_events_new = """          {showEventForm && !selectedEvent && (
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
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Opportunity Title</label>
                        <input type="text" placeholder="e.g. Weekend Flu Clinic Registration" className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required/>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Start Time</label>
                        <input type="datetime-local" className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / Department</label>
                        <input type="text" placeholder="e.g. Main Lobby, Clinic B" className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Volunteers Needed</label>
                        <input type="number" placeholder="Capacity" className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" value={eventForm.requiredVolunteers} onChange={e => setEventForm({...eventForm, requiredVolunteers: parseInt(e.target.value)})} required min="1"/>
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
          )}"""

content = content.replace(crm_events_old, crm_events_new)

with open('apps/frontend/src/App.tsx', 'w') as f:
    f.write(content)
