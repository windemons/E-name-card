import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faFilter,
  faSearch,
  faEye,
  faEdit,
  faTrash,
  faStickyNote,
  faUser,
  faBriefcase,
  faEnvelope,
  faPhone,
  faCalendar,
  faTimes,
  faCheck,
  faMars,
  faVenus,
  faGenderless,
  faChartLine,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

export default function ContactsDashboard() {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('cosma_contacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'edit', 'add'
  const [editingContact, setEditingContact] = useState(null);

  // Filter states
  const [filterGender, setFilterGender] = useState('all');
  const [filterSort, setFilterSort] = useState('name'); // 'name', 'date', 'company'

  // Save contacts to localStorage
  useEffect(() => {
    localStorage.setItem('cosma_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Calculate stats for visualization
  const stats = {
    total: contacts.length,
    male: contacts.filter(c => c.gender === 'male').length,
    female: contacts.filter(c => c.gender === 'female').length,
    withCompany: contacts.filter(c => c.company).length,
    recentlyAdded: contacts.filter(c => {
      const addedDate = new Date(c.addedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return addedDate > weekAgo;
    }).length
  };

  // Filter and search contacts
  const filteredContacts = contacts
    .filter(contact => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        contact.firstName?.toLowerCase().includes(searchLower) ||
        contact.lastName?.toLowerCase().includes(searchLower) ||
        contact.company?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;

      // Gender filter
      if (filterGender !== 'all' && contact.gender !== filterGender) return false;

      return true;
    })
    .sort((a, b) => {
      switch (filterSort) {
        case 'name':
          return (a.firstName || '').localeCompare(b.firstName || '');
        case 'date':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        default:
          return 0;
      }
    });

  const handleAddContact = () => {
    setEditingContact({
      id: Date.now(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      company: '',
      gender: 'other',
      notes: '',
      addedAt: new Date().toISOString()
    });
    setViewMode('add');
  };

  const handleEditContact = (contact) => {
    setEditingContact({ ...contact });
    setViewMode('edit');
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setViewMode('detail');
  };

  const handleSaveContact = () => {
    if (!editingContact.firstName || !editingContact.email) {
      alert('Vui lòng điền First Name và Email!');
      return;
    }

    if (viewMode === 'add') {
      setContacts(prev => [...prev, editingContact]);
    } else if (viewMode === 'edit') {
      setContacts(prev => prev.map(c => 
        c.id === editingContact.id ? editingContact : c
      ));
    }

    setEditingContact(null);
    setViewMode('list');
  };

  const handleDeleteContact = (contactId) => {
    if (confirm('Bạn có chắc muốn xóa contact này?')) {
      setContacts(prev => prev.filter(c => c.id !== contactId));
      setViewMode('list');
    }
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    setViewMode('list');
  };

  const renderStatCard = (icon, label, value, color) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <FontAwesomeIcon icon={icon} className="text-xl text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/60">{label}</p>
        </div>
      </div>
    </div>
  );

  // Render LIST view
  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {renderStatCard(faUsers, 'Total Contacts', stats.total, '#3b82f6')}
          {renderStatCard(faBriefcase, 'With Company', stats.withCompany, '#10b981')}
          {renderStatCard(faCalendar, 'Added This Week', stats.recentlyAdded, '#f59e0b')}
          {renderStatCard(faChartLine, 'Growth Rate', '+12%', '#ec4899')}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
          </div>
          
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>Filter</span>
          </button>

          <button
            onClick={handleAddContact}
            className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: '#ffcb66', color: '#000' }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>New Contact</span>
          </button>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#003540] border border-white/10 text-white focus:outline-none focus:border-[#ffcb66] appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="all" className="bg-[#003540] text-white">All</option>
                  <option value="male" className="bg-[#003540] text-white">Male</option>
                  <option value="female" className="bg-[#003540] text-white">Female</option>
                  <option value="other" className="bg-[#003540] text-white">Other</option>
                </select>
              </div>
              
              <div>
                <label className="text-white text-sm mb-2 block">Sort By</label>
                <select
                  value={filterSort}
                  onChange={(e) => setFilterSort(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#003540] border border-white/10 text-white focus:outline-none focus:border-[#ffcb66] appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="name" className="bg-[#003540] text-white">Name</option>
                  <option value="date" className="bg-[#003540] text-white">Date Added</option>
                  <option value="company" className="bg-[#003540] text-white">Company</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3 text-white text-sm font-semibold">Name</th>
                <th className="text-left px-4 py-3 text-white text-sm font-semibold">Job Title</th>
                <th className="text-left px-4 py-3 text-white text-sm font-semibold">Company</th>
                <th className="text-left px-4 py-3 text-white text-sm font-semibold">Email</th>
                <th className="text-left px-4 py-3 text-white text-sm font-semibold">Added</th>
                <th className="text-left px-4 py-3 text-white text-sm font-semibold">Gender</th>
                <th className="text-center px-4 py-3 text-white text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-white/40">
                    {searchQuery ? 'No contacts found' : 'No contacts yet. Add your first contact!'}
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr 
                    key={contact.id} 
                    className="border-t border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                    onClick={() => handleViewContact(contact)}
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {contact.firstName} {contact.lastName}
                    </td>
                    <td className="px-4 py-3 text-white/70">{contact.jobTitle || '-'}</td>
                    <td className="px-4 py-3 text-white/70">{contact.company || '-'}</td>
                    <td className="px-4 py-3 text-white/70">{contact.email || '-'}</td>
                    <td className="px-4 py-3 text-white/70">
                      {new Date(contact.addedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/70 capitalize">{contact.gender}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewContact(contact);
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditContact(contact);
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContact(contact.id);
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-white/70 hover:text-red-400 transition-all"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render DETAIL view
  if (viewMode === 'detail' && selectedContact) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Contact Details</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Back
              </button>
              <button
                onClick={() => handleEditContact(selectedContact)}
                className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{ backgroundColor: '#ffcb66', color: '#000' }}
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteContact(selectedContact.id)}
                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-6 mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: '#ffcb66', color: '#000' }}
              >
                {selectedContact.firstName?.[0]}{selectedContact.lastName?.[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {selectedContact.firstName} {selectedContact.lastName}
                </h3>
                {selectedContact.jobTitle && (
                  <p className="text-white/70 mb-1">{selectedContact.jobTitle}</p>
                )}
                {selectedContact.company && (
                  <p className="text-white/60">{selectedContact.company}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <FontAwesomeIcon icon={faEnvelope} className="text-white/40" />
                <div>
                  <p className="text-xs text-white/60">Email</p>
                  <p className="text-white">{selectedContact.email || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <FontAwesomeIcon icon={faPhone} className="text-white/40" />
                <div>
                  <p className="text-xs text-white/60">Phone</p>
                  <p className="text-white">{selectedContact.phone || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <FontAwesomeIcon 
                  icon={
                    selectedContact.gender === 'male' ? faMars :
                    selectedContact.gender === 'female' ? faVenus :
                    faGenderless
                  } 
                  className="text-white/40" 
                />
                <div>
                  <p className="text-xs text-white/60">Gender</p>
                  <p className="text-white capitalize">{selectedContact.gender || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <FontAwesomeIcon icon={faCalendar} className="text-white/40" />
                <div>
                  <p className="text-xs text-white/60">Added</p>
                  <p className="text-white">
                    {new Date(selectedContact.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faStickyNote} />
              Notes
            </h3>
            {selectedContact.notes ? (
              <p className="text-white/70 whitespace-pre-wrap">{selectedContact.notes}</p>
            ) : (
              <p className="text-white/40 italic">No notes yet</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render EDIT/ADD view
  if ((viewMode === 'edit' || viewMode === 'add') && editingContact) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {viewMode === 'add' ? 'New Contact' : 'Edit Contact'}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSaveContact}
                className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{ backgroundColor: '#ffcb66', color: '#000' }}
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                Save
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm mb-2 block">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editingContact.firstName}
                  onChange={(e) => setEditingContact(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="text-white text-sm mb-2 block">Last Name</label>
                <input
                  type="text"
                  value={editingContact.lastName}
                  onChange={(e) => setEditingContact(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={editingContact.email}
                onChange={(e) => setEditingContact(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Phone Number</label>
              <input
                type="tel"
                value={editingContact.phone}
                onChange={(e) => setEditingContact(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Job Title</label>
              <input
                type="text"
                value={editingContact.jobTitle}
                onChange={(e) => setEditingContact(prev => ({ ...prev, jobTitle: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                placeholder="Enter job title"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Company</label>
              <input
                type="text"
                value={editingContact.company}
                onChange={(e) => setEditingContact(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                placeholder="Enter company"
              />
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Gender</label>
              <select
                value={editingContact.gender}
                onChange={(e) => setEditingContact(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[#003540] border border-white/10 text-white focus:outline-none focus:border-[#ffcb66] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="male" className="bg-[#003540] text-white">Male</option>
                <option value="female" className="bg-[#003540] text-white">Female</option>
                <option value="other" className="bg-[#003540] text-white">Other</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Notes</label>
              <textarea
                value={editingContact.notes}
                onChange={(e) => setEditingContact(prev => ({ ...prev, notes: e.target.value }))}
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 resize-none"
                placeholder="Add notes about this contact..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}