import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api/events';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorTestResult, setErrorTestResult] = useState(null);

  // Form state for creating a new event
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    capacity: 100,
    registered: 0
  });

  // Fetch all events from MongoDB API
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        setError(data.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Make sure server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch single event by MongoDB ObjectId
  const fetchEventById = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedEvent(data.data);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      alert('Error fetching event details: ' + err.message);
    }
  };

  // Create new event via POST
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert('Event successfully saved to MongoDB database!');
        setShowAddModal(false);
        setFormData({
          name: '',
          date: '',
          location: '',
          description: '',
          capacity: 100,
          registered: 0
        });
        fetchEvents();
      } else {
        alert('Validation Error: ' + (data.message || JSON.stringify(data.errors)));
      }
    } catch (err) {
      alert('Error creating event: ' + err.message);
    }
  };

  // Delete event via DELETE
  const handleDeleteEvent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from MongoDB?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert('Event successfully deleted from MongoDB!');
        fetchEvents();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Error deleting event: ' + err.message);
    }
  };

  // Run Error Handling Tests
  const runErrorTest = async (testType) => {
    try {
      let res;
      let url = API_BASE_URL;
      let title = '';

      if (testType === 'invalid-id') {
        title = 'Test: Invalid MongoDB ObjectId Format';
        url = `${API_BASE_URL}/invalid-mongo-id-123`;
        res = await fetch(url);
      } else if (testType === 'not-found') {
        title = 'Test: Non-Existent 24-character ObjectId';
        url = `${API_BASE_URL}/654321654321654321654321`;
        res = await fetch(url);
      } else if (testType === 'validation-fail') {
        title = 'Test: Missing Required Schema Fields (POST)';
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: 'Missing required fields' })
        });
      }

      const json = await res.json();
      setErrorTestResult({
        title,
        status: res.status,
        statusText: res.statusText,
        data: json
      });
    } catch (err) {
      setErrorTestResult({
        title: 'Network / Server Error',
        status: 500,
        statusText: 'Internal Error',
        data: { error: err.message }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                MongoDB Atlas + Mongoose Persistent Storage
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Event Management RESTful API
              </h1>
              <p className="mt-1 text-slate-400 text-sm">
                FSD Experiment 5 &bull; Full CRUD with MongoDB, Mongoose, Express.js & Postman
              </p>
            </div>
            
            {/* Student Details Card */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 text-right md:text-left self-start md:self-auto">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Student Details</p>
              <p className="text-sm font-bold text-white mt-1">Kirteesh D. Rakshe</p>
              <p className="text-xs text-indigo-400 font-mono">Class: D15A &bull; Roll No: 43</p>
            </div>
          </div>

          {/* Database Connection Status Bar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse"></div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Database Status</p>
                <p className="text-sm font-semibold text-emerald-400">Connected to MongoDB</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Backend Endpoint</p>
              <p className="text-sm font-mono text-indigo-300">GET /api/events (Port 5000)</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Documents in Collection</p>
              <p className="text-sm font-bold text-white">{events.length} Events Loaded</p>
            </div>
          </div>
        </header>

        {/* Action Controls & Error Testing Suite */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 backdrop-blur p-4 rounded-xl border border-slate-700/70">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchEvents}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              + Add New Event (POST)
            </button>
          </div>

          {/* Quick Error Handling Test Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold uppercase mr-1">Error Tests:</span>
            <button
              onClick={() => runErrorTest('invalid-id')}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono transition"
            >
              400 Bad ObjectId
            </button>
            <button
              onClick={() => runErrorTest('not-found')}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-mono transition"
            >
              404 Not Found
            </button>
            <button
              onClick={() => runErrorTest('validation-fail')}
              className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-mono transition"
            >
              400 Validation
            </button>
          </div>
        </div>

        {/* Live Error Test Result Modal / Callout */}
        {errorTestResult && (
          <div className="bg-slate-800 rounded-xl p-5 border border-amber-500/50 shadow-2xl relative">
            <button
              onClick={() => setErrorTestResult(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                errorTestResult.status === 400 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                errorTestResult.status === 404 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-red-500/20 text-red-400'
              }`}>
                HTTP {errorTestResult.status} {errorTestResult.statusText}
              </span>
              <h3 className="font-bold text-white">{errorTestResult.title}</h3>
            </div>
            <p className="text-xs text-slate-400 mb-2">Mongoose / Express server handled request and returned JSON error structure:</p>
            <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800">
              {JSON.stringify(errorTestResult.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6 text-center space-y-3">
            <p className="text-rose-400 font-semibold">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm font-medium">Fetching documents from MongoDB...</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id || event.id}
                className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* MongoDB ObjectId badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700 truncate" title={`MongoDB ObjectId: ${event._id || event.id}`}>
                      _id: {event._id || event.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      MongoDB Doc
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.name}</h3>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">{event.description || 'No description provided.'}</p>

                  <div className="space-y-2 text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Date: <strong className="text-slate-200">{event.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">Location: <strong className="text-slate-200">{event.location}</strong></span>
                    </div>
                  </div>

                  {/* Attendance Progress */}
                  <div className="mt-4 pt-3 border-t border-slate-700/50">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Capacity & Registered</span>
                      <span className="text-indigo-400 font-bold">{event.registered || 0} / {event.capacity || 100}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, ((event.registered || 0) / (event.capacity || 100)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => fetchEventById(event._id || event.id)}
                    className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold text-slate-200 transition text-center"
                  >
                    View Details (GET)
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event._id || event.id, event.name)}
                    className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold transition"
                    title="Delete document from MongoDB"
                  >
                    Delete (DELETE)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Single Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-700 shadow-2xl relative space-y-5">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  GET /api/events/:id
                </span>
                <h2 className="text-2xl font-bold text-white">Event Document Details</h2>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 border border-slate-700/80 space-y-2">
                <p className="text-xs text-slate-400">MongoDB Document _id:</p>
                <p className="text-sm font-mono text-emerald-400 font-bold">{selectedEvent._id || selectedEvent.id}</p>
                <p className="text-sm font-bold text-white text-lg">{selectedEvent.name}</p>
                <p className="text-xs text-slate-300">{selectedEvent.description}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-400">
                  <div>Date: <span className="text-white font-medium">{selectedEvent.date}</span></div>
                  <div>Location: <span className="text-white font-medium">{selectedEvent.location}</span></div>
                  <div>Capacity: <span className="text-white font-medium">{selectedEvent.capacity}</span></div>
                  <div>Registered: <span className="text-white font-medium">{selectedEvent.registered}</span></div>
                </div>
              </div>

              <div>
                <p className="text-xs font-mono text-slate-400 mb-1">Mongoose JSON Response Body:</p>
                <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto border border-slate-800 max-h-48">
                  {JSON.stringify(selectedEvent, null, 2)}
                </pre>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold transition"
              >
                Close Details
              </button>
            </div>
          </div>
        )}

        {/* Add Event Modal (POST) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-700 shadow-2xl relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="mb-6">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  POST /api/events
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">Create New MongoDB Event</h2>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Event Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. NextGen Web Summit 2025"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Tech Auditorium"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief overview of the event"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Registered</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.registered}
                      onChange={(e) => setFormData({ ...formData, registered: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/30"
                  >
                    Save to MongoDB
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

