import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import CmsManager from '../../components/admin/CmsManager';
import './Admin.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ volunteers: 0, contacts: 0, careers: 0, programs: 0, stories: 0, gallery: 0, events: 0, blogs: 0 });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Data lists
  const [programs, setPrograms] = useState([]);
  const [stories, setStories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [volunteersList, setVolunteersList] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  const [careersList, setCareersList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [volunteerTeamList, setVolunteerTeamList] = useState([]);
  const [donationsList, setDonationsList] = useState([]);
  
  // Global settings state
  const [settings, setSettings] = useState({
    orgInfo: {},
    aboutContent: { coreValues: [] },
    founderMessage: { letter: [] },
    impactStats: []
  });

  // Edit Modals / Form states
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      if (activeTab === 'overview') {
        const v = await api.get('/submissions/volunteers');
        const p = await api.get('/programs');
        const s = await api.get('/stories');
        const g = await api.get('/gallery');
        const e = await api.get('/events');
        const b = await api.get('/blog');
        
        setStats({
          volunteers: v.length,
          programs: p.length,
          stories: s.length,
          gallery: g.length,
          events: e.length,
          blogs: b.length
        });
      } else if (activeTab === 'settings') {
        const data = await api.get('/settings');
        setSettings(data);
      } else if (activeTab === 'programs') {
        const data = await api.get('/programs');
        setPrograms(data);
      } else if (activeTab === 'stories') {
        const data = await api.get('/stories');
        setStories(data);
      } else if (activeTab === 'gallery') {
        const data = await api.get('/gallery');
        setGallery(data);
      } else if (activeTab === 'events') {
        const data = await api.get('/events');
        setEvents(data);
      } else if (activeTab === 'blogs') {
        const data = await api.get('/blog');
        setBlogs(data);
      } else if (activeTab === 'team') {
        const data = await api.get('/team');
        setTeamList(data);
      } else if (activeTab === 'volunteer_team') {
        const data = await api.get('/volunteer-team');
        setVolunteerTeamList(data);
      } else if (activeTab === 'submissions') {
        const v = await api.get('/submissions/volunteers');
        setVolunteersList(v);
      } else if (activeTab === 'donations') {
        const d = await api.get('/api/donation/list');
        setDonationsList(d);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error loading dashboard data.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }

  // ==========================================
  // CRUD SUBMIT HANDLERS
  // ==========================================
  
  // Programs CRUD Actions
  async function handleProgramSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.target);
    const hasImage = formData.get('image')?.name !== '';
    const id = currentEditItem?._id;

    try {
      if (id) {
        // Edit Program
        const updateData = new FormData();
        updateData.append('name', formData.get('name'));
        updateData.append('category', formData.get('category'));
        updateData.append('description', formData.get('description'));
        updateData.append('locations', formData.get('locations'));
        if (hasImage) {
          updateData.append('image', formData.get('image'));
        }

        await api.put(`/programs/${id}`, updateData, true);
        setSuccessMsg('Program updated successfully!');
      } else {
        // Add Program
        await api.post('/programs', formData, true);
        setSuccessMsg('Program added successfully!');
      }
      setShowAddForm(false);
      setCurrentEditItem(null);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProgram(id) {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    setLoading(true);
    try {
      await api.delete(`/programs/${id}`);
      setSuccessMsg('Program deleted successfully!');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Success Stories CRUD Actions
  async function handleStorySubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.target);
    const hasImage = formData.get('image')?.name !== '';
    const id = currentEditItem?._id;

    try {
      if (id) {
        const updateData = new FormData();
        updateData.append('name', formData.get('name'));
        updateData.append('program', formData.get('program'));
        updateData.append('summary', formData.get('summary'));
        updateData.append('story', formData.get('story'));
        if (hasImage) {
          updateData.append('image', formData.get('image'));
        }
        await api.put(`/stories/${id}`, updateData, true);
        setSuccessMsg('Story updated successfully!');
      } else {
        await api.post('/stories', formData, true);
        setSuccessMsg('Story added successfully!');
      }
      setShowAddForm(false);
      setCurrentEditItem(null);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteStory(id) {
    if (!window.confirm('Are you sure you want to delete this success story?')) return;
    setLoading(true);
    try {
      await api.delete(`/stories/${id}`);
      setSuccessMsg('Story deleted successfully!');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Gallery CRUD Actions
  async function handleGallerySubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.target);
    try {
      await api.post('/gallery', formData, true);
      setSuccessMsg('Image uploaded to gallery successfully!');
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteGallery(id) {
    if (!window.confirm('Delete this image from gallery?')) return;
    setLoading(true);
    try {
      await api.delete(`/gallery/${id}`);
      setSuccessMsg('Image deleted successfully!');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Events CRUD Actions
  async function handleEventSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.target);
    const body = {
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
      location: formData.get('location'),
      description: formData.get('description'),
      registrationDetails: formData.get('registrationDetails'),
    };
    const id = currentEditItem?._id;

    try {
      if (id) {
        await api.put(`/events/${id}`, body);
        setSuccessMsg('Event updated successfully!');
      } else {
        await api.post('/events', body);
        setSuccessMsg('Event created successfully!');
      }
      setShowAddForm(false);
      setCurrentEditItem(null);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent(id) {
    if (!window.confirm('Delete this event?')) return;
    setLoading(true);
    try {
      await api.delete(`/events/${id}`);
      setSuccessMsg('Event deleted successfully!');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Blog CRUD Actions
  async function handleBlogSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.target);
    const hasImage = formData.get('image')?.name !== '';
    const id = currentEditItem?._id;

    try {
      if (id) {
        const updateData = new FormData();
        updateData.append('title', formData.get('title'));
        updateData.append('category', formData.get('category'));
        updateData.append('excerpt', formData.get('excerpt'));
        updateData.append('content', formData.get('content'));
        updateData.append('author', formData.get('author'));
        updateData.append('link', formData.get('link') || '');
        if (hasImage) {
          updateData.append('image', formData.get('image'));
        }
        await api.put(`/blog/${id}`, updateData, true);
        setSuccessMsg('Blog post updated successfully!');
      } else {
        await api.post('/blog', formData, true);
        setSuccessMsg('Blog post published successfully!');
      }
      setShowAddForm(false);
      setCurrentEditItem(null);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteBlog(id) {
    if (!window.confirm('Delete this blog post?')) return;
    setLoading(true);
    try {
      await api.delete(`/blog/${id}`);
      setSuccessMsg('Blog post deleted successfully!');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // General Settings Save
  async function handleSettingsSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.target);
    const hasFounderImage = formData.get('founderImage')?.name !== '';

    try {
      const updateData = new FormData();
      for (const [key, value] of formData.entries()) {
        if (key === 'founderImage') {
          if (hasFounderImage) {
            updateData.append('founderImage', value);
          }
        } else {
          updateData.append(key, value);
        }
      }

      await api.put('/settings', updateData, true);
      setSuccessMsg('Settings updated successfully!');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Leadership Team CRUD Actions
  async function handleTeamMemberSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.target);
    const id = currentEditItem?._id;

    try {
      if (id) {
        await api.put(`/team/${id}`, formData, true);
        setSuccessMsg('Team member updated successfully!');
      } else {
        await api.post('/team', formData, true);
        setSuccessMsg('Team member added successfully!');
      }
      setShowAddForm(false);
      setCurrentEditItem(null);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTeamMember(id) {
    if (!window.confirm('Delete this team member?')) return;
    setLoading(true);
    try {
      await api.delete(`/team/${id}`);
      setSuccessMsg('Team member deleted successfully!');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Volunteer Team CRUD Actions
  async function handleVolunteerMemberSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData(e.target);
    const id = currentEditItem?._id;

    try {
      if (id) {
        await api.put(`/volunteer-team/${id}`, formData, true);
        setSuccessMsg('Volunteer team member updated successfully!');
      } else {
        await api.post('/volunteer-team', formData, true);
        setSuccessMsg('Volunteer team member added successfully!');
      }
      setShowAddForm(false);
      setCurrentEditItem(null);
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteVolunteerMember(id) {
    if (!window.confirm('Delete this volunteer team member?')) return;
    setLoading(true);
    try {
      await api.delete(`/volunteer-team/${id}`);
      setSuccessMsg('Volunteer team member deleted successfully!');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Submission Inbox Deletion Actions
  async function handleDeleteSubmission(type, id) {
    if (!window.confirm(`Delete this submission entry?`)) return;
    setLoading(true);
    try {
      await api.delete(`/submissions/${type}/${id}`);
      setSuccessMsg('Submission entry deleted.');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Render content according to the active tab
  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/images/logo.png" className="admin-logo" alt="Swasti Foundation Logo" />
          <h2>Swasti NGO</h2>
        </div>
        <nav className="admin-sidebar-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => { setActiveTab('overview'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Dashboard Overview
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => { setActiveTab('settings'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Site settings
          </button>
          <button className={activeTab === 'cms' ? 'active' : ''} onClick={() => { setActiveTab('cms'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Content Management (CMS)
          </button>
          <button className={activeTab === 'programs' ? 'active' : ''} onClick={() => { setActiveTab('programs'); setShowAddForm(false); setCurrentEditItem(null); }}>
            NGO programs
          </button>
          <button className={activeTab === 'stories' ? 'active' : ''} onClick={() => { setActiveTab('stories'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Success stories
          </button>
          <button className={activeTab === 'gallery' ? 'active' : ''} onClick={() => { setActiveTab('gallery'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Photo gallery
          </button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => { setActiveTab('events'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Upcoming events
          </button>
          <button className={activeTab === 'blogs' ? 'active' : ''} onClick={() => { setActiveTab('blogs'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Blog & News
          </button>
          <button className={activeTab === 'team' ? 'active' : ''} onClick={() => { setActiveTab('team'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Leadership Team
          </button>
          <button className={activeTab === 'volunteer_team' ? 'active' : ''} onClick={() => { setActiveTab('volunteer_team'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Volunteer Team
          </button>
          <button className={activeTab === 'submissions' ? 'active' : ''} onClick={() => { setActiveTab('submissions'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Submissions Inbox
          </button>
          <button className={activeTab === 'donations' ? 'active' : ''} onClick={() => { setActiveTab('donations'); setShowAddForm(false); setCurrentEditItem(null); }}>
            Donation Records
          </button>
        </nav>
        <button className="btn-logout" onClick={handleLogout}>Log Out</button>
      </aside>

      {/* Main panel */}
      <main className="admin-main-panel">
        <header className="admin-main-header">
          <h1>{activeTab.toUpperCase().replace('_', ' ')}</h1>
          <div className="admin-user-info">Logged in as Administrator</div>
        </header>

        <div className="admin-content-area">
          {loading && <div className="admin-loading-spinner">Loading dynamic data...</div>}
          {successMsg && <div className="admin-banner-success">{successMsg}</div>}
          {errorMsg && <div className="admin-banner-error">{errorMsg}</div>}

          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="admin-overview-grid">
              <div className="admin-stats-card">
                <h3>Volunteer signups</h3>
                <div className="value">{stats.volunteers}</div>
              </div>
              <div className="admin-stats-card">
                <h3>Active programs</h3>
                <div className="value">{stats.programs}</div>
              </div>
              <div className="admin-stats-card">
                <h3>Success stories</h3>
                <div className="value">{stats.stories}</div>
              </div>
              <div className="admin-stats-card">
                <h3>Gallery items</h3>
                <div className="value">{stats.gallery}</div>
              </div>
              <div className="admin-stats-card">
                <h3>Events scheduled</h3>
                <div className="value">{stats.events}</div>
              </div>
              <div className="admin-stats-card">
                <h3>Blog posts</h3>
                <div className="value">{stats.blogs}</div>
              </div>
            </div>
          )}

          {/* SITE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSubmit} className="admin-settings-form" encType="multipart/form-data">
              <section className="settings-section">
                <h2>NGO general information</h2>
                <div className="form-grid">
                  <label>
                    <span>NGO Name</span>
                    <input type="text" name="org_name" defaultValue={settings.orgInfo.name || ''} />
                  </label>
                  <label>
                    <span>Tagline</span>
                    <input type="text" name="org_tagline" defaultValue={settings.orgInfo.tagline || ''} />
                  </label>
                  <label>
                    <span>Tagline translation</span>
                    <input type="text" name="org_taglineTrans" defaultValue={settings.orgInfo.taglineTranslation || ''} />
                  </label>
                  <label>
                    <span>Registration number</span>
                    <input type="text" name="org_regNum" defaultValue={settings.orgInfo.registrationNumber || ''} />
                  </label>
                  <label>
                    <span>NGO Type</span>
                    <input type="text" name="org_type" defaultValue={settings.orgInfo.type || ''} />
                  </label>
                  <label>
                    <span>Established Date (YYYY-MM-DD)</span>
                    <input type="text" name="org_foundedDate" defaultValue={settings.orgInfo.foundedDate || ''} />
                  </label>
                  <label>
                    <span>Established Year</span>
                    <input type="number" name="org_foundedYear" defaultValue={settings.orgInfo.foundedYear || ''} />
                  </label>
                  <label>
                    <span>Office Address</span>
                    <input type="text" name="org_address" defaultValue={settings.orgInfo.officeAddress || ''} />
                  </label>
                  <label>
                    <span>NGO email address</span>
                    <input type="email" name="org_email" defaultValue={settings.orgInfo.email || ''} />
                  </label>
                  <label>
                    <span>NGO phone number</span>
                    <input type="text" name="org_phone" defaultValue={settings.orgInfo.phone || ''} />
                  </label>
                  <label>
                    <span>WhatsApp phone number</span>
                    <input type="text" name="org_whatsapp" defaultValue={settings.orgInfo.whatsappNumber || ''} />
                  </label>
                </div>
              </section>

              <section className="settings-section">
                <h2>Social links</h2>
                <div className="form-grid">
                  <label>
                    <span>Facebook URL</span>
                    <input type="text" name="social_fb" defaultValue={settings.orgInfo.social?.facebook || ''} />
                  </label>
                  <label>
                    <span>Instagram URL</span>
                    <input type="text" name="social_ig" defaultValue={settings.orgInfo.social?.instagram || ''} />
                  </label>
                  <label>
                    <span>YouTube URL</span>
                    <input type="text" name="social_yt" defaultValue={settings.orgInfo.social?.youtube || ''} />
                  </label>
                </div>
              </section>

              <section className="settings-section">
                <h2>About & story blocks</h2>
                <div className="form-grid">
                  <label className="full-width">
                    <span>Why founded</span>
                    <textarea name="about_whyFounded" rows="4" defaultValue={settings.aboutContent.whyFounded || ''} />
                  </label>
                  <label className="full-width">
                    <span>Problem NGO solves</span>
                    <textarea name="about_problem" rows="4" defaultValue={settings.aboutContent.problem || ''} />
                  </label>
                  <label className="full-width">
                    <span>Founder story</span>
                    <textarea name="about_founderStory" rows="4" defaultValue={settings.aboutContent.founderStory || ''} />
                  </label>
                  <label className="full-width">
                    <span>NGO inspiration</span>
                    <textarea name="about_inspiration" rows="4" defaultValue={settings.aboutContent.inspiration || ''} />
                  </label>
                  <label className="full-width">
                    <span>NGO mission statement</span>
                    <textarea name="about_mission" rows="4" defaultValue={settings.aboutContent.mission || ''} />
                  </label>
                  <label className="full-width">
                    <span>NGO vision statement</span>
                    <textarea name="about_vision" rows="4" defaultValue={settings.aboutContent.vision || ''} />
                  </label>
                  <label className="full-width">
                    <span>Extended vision statements (Gaushala / Old Age Homes)</span>
                    <textarea name="about_visionExtended" rows="4" defaultValue={settings.aboutContent.visionExtended || ''} />
                  </label>
                </div>
              </section>

              <section className="settings-section">
                <h2>Founder's message letter</h2>
                <div className="form-grid">
                  <label>
                    <span>Founder Name</span>
                    <input type="text" name="founder_name" defaultValue={settings.founderMessage.founderName || ''} />
                  </label>
                  <label>
                    <span>Founder Title</span>
                    <input type="text" name="founder_title" defaultValue={settings.founderMessage.founderTitle || ''} />
                  </label>
                  <label>
                    <span>Closing title</span>
                    <input type="text" name="founder_closing" defaultValue={settings.founderMessage.closing || ''} />
                  </label>
                  <label>
                    <span>Founder Profile Image (Leave empty to keep existing)</span>
                    <input type="file" name="founderImage" accept="image/*" />
                    {settings.founderMessage?.founderImage && (
                      <span style={{ fontSize: '11px', color: '#10b981', display: 'block', marginTop: '4px' }}>
                        Current Image: <a href={settings.founderMessage.founderImage} target="_blank" rel="noreferrer">View image</a>
                      </span>
                    )}
                  </label>
                  <label className="full-width">
                    <span>Founder Letter paragraphs (separate paragraphs with blank double enters)</span>
                    <textarea name="founder_letter" rows="8" defaultValue={settings.founderMessage.letter?.join('\n\n') || ''} />
                  </label>
                </div>
              </section>

              <section className="settings-section">
                <h2>Impact statistics</h2>
                <div className="form-grid">
                  {(settings.impactStats && settings.impactStats.length > 0
                    ? settings.impactStats
                    : [
                        { id: "children-educated", value: 5000, suffix: "+", label: "Children Educated" },
                        { id: "ration-distributed", value: 20000, suffix: "+", label: "Ration Distributed" },
                        { id: "states-reached", value: 10, suffix: "+", label: "States Reached" },
                        { id: "cleanliness-kits", value: 10000, suffix: "+", label: "Cleanliness Kits Distributed" }
                      ]
                  ).map((stat) => (
                    <div key={stat.id} style={{ display: 'contents' }}>
                      <label>
                        <span>{stat.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Label</span>
                        <input type="text" name={`impact_${stat.id}_label`} defaultValue={stat.label || ''} required />
                      </label>
                      <label>
                        <span>Value</span>
                        <input type="number" name={`impact_${stat.id}_value`} defaultValue={stat.value ?? ''} required />
                      </label>
                      <label>
                        <span>Suffix</span>
                        <input type="text" name={`impact_${stat.id}_suffix`} defaultValue={stat.suffix || ''} />
                      </label>
                    </div>
                  ))}
                </div>
              </section>

              <button type="submit" className="btn-admin-action" disabled={loading}>Save Settings</button>
            </form>
          )}

          {/* CMS MANAGER */}
          {activeTab === 'cms' && (
            <CmsManager />
          )}

          {/* NGO PROGRAMS LIST */}
          {activeTab === 'programs' && (
            <div>
              <div className="tab-actions">
                {!showAddForm && (
                  <button className="btn-admin-action" onClick={() => { setShowAddForm(true); setCurrentEditItem(null); }}>
                    Add new program
                  </button>
                )}
              </div>

              {showAddForm || currentEditItem ? (
                <form onSubmit={handleProgramSubmit} className="admin-settings-form">
                  <h2>{currentEditItem ? 'Edit program' : 'Add new program'}</h2>
                  <div className="form-grid">
                    <label>
                      <span>Program Name</span>
                      <input type="text" name="name" required defaultValue={currentEditItem?.name || ''} />
                    </label>
                    <label>
                      <span>Category</span>
                      <select name="category" required defaultValue={currentEditItem?.category || 'Education'}>
                        <option value="Education">Education</option>
                        <option value="Environment">Environment</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Women Empowerment">Women Empowerment</option>
                        <option value="Child Welfare">Child Welfare</option>
                        <option value="Animal Welfare">Animal Welfare</option>
                      </select>
                    </label>
                    <label>
                      <span>Locations (comma separated list)</span>
                      <input type="text" name="locations" defaultValue={currentEditItem?.locations?.join(', ') || ''} />
                    </label>
                    <label>
                      <span>Program image file {currentEditItem && '(Leave empty to keep existing)'}</span>
                      <input type="file" name="image" required={!currentEditItem} />
                    </label>
                    <label className="full-width">
                      <span>Description</span>
                      <textarea name="description" required rows="6" defaultValue={currentEditItem?.description || ''} />
                    </label>
                  </div>
                  <div className="btn-group">
                    <button type="submit" className="btn-admin-action" disabled={loading}>
                      {currentEditItem ? 'Update Program' : 'Save Program'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => { setShowAddForm(false); setCurrentEditItem(null); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="admin-list-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Locations</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map(p => (
                        <tr key={p._id}>
                          <td><img src={p.image} alt={p.name} className="table-row-thumbnail" /></td>
                          <td><strong>{p.name}</strong></td>
                          <td><span className="table-badge">{p.category}</span></td>
                          <td>{p.locations?.join(', ')}</td>
                          <td>
                            <button className="btn-table-edit" onClick={() => { setCurrentEditItem(p); setShowAddForm(false); }}>Edit</button>
                            <button className="btn-table-delete" onClick={() => handleDeleteProgram(p._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SUCCESS STORIES LIST */}
          {activeTab === 'stories' && (
            <div>
              <div className="tab-actions">
                {!showAddForm && (
                  <button className="btn-admin-action" onClick={() => { setShowAddForm(true); setCurrentEditItem(null); }}>
                    Add success story
                  </button>
                )}
              </div>

              {showAddForm || currentEditItem ? (
                <form onSubmit={handleStorySubmit} className="admin-settings-form">
                  <h2>{currentEditItem ? 'Edit story' : 'Add new story'}</h2>
                  <div className="form-grid">
                    <label>
                      <span>Beneficiary Name</span>
                      <input type="text" name="name" required defaultValue={currentEditItem?.name || ''} />
                    </label>
                    <label>
                      <span>Program associated</span>
                      <input type="text" name="program" required defaultValue={currentEditItem?.program || ''} />
                    </label>
                    <label>
                      <span>Short Summary</span>
                      <input type="text" name="summary" required defaultValue={currentEditItem?.summary || ''} />
                    </label>
                    <label>
                      <span>Beneficiary image file {currentEditItem && '(Leave empty to keep existing)'}</span>
                      <input type="file" name="image" required={!currentEditItem} />
                    </label>
                    <label className="full-width">
                      <span>Full Story description</span>
                      <textarea name="story" required rows="8" defaultValue={currentEditItem?.story || ''} />
                    </label>
                  </div>
                  <div className="btn-group">
                    <button type="submit" className="btn-admin-action" disabled={loading}>
                      {currentEditItem ? 'Update Story' : 'Save Story'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => { setShowAddForm(false); setCurrentEditItem(null); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="admin-list-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Program</th>
                        <th>Summary</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stories.map(s => (
                        <tr key={s._id}>
                          <td><img src={s.image} alt={s.name} className="table-row-thumbnail" /></td>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.program}</td>
                          <td>{s.summary}</td>
                          <td>
                            <button className="btn-table-edit" onClick={() => { setCurrentEditItem(s); setShowAddForm(false); }}>Edit</button>
                            <button className="btn-table-delete" onClick={() => handleDeleteStory(s._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PHOTO GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              <div className="tab-actions">
                {!showAddForm && (
                  <button className="btn-admin-action" onClick={() => setShowAddForm(true)}>
                    Upload new gallery image
                  </button>
                )}
              </div>

              {showAddForm ? (
                <form onSubmit={handleGallerySubmit} className="admin-settings-form">
                  <h2>Upload new image</h2>
                  <div className="form-grid">
                    <label>
                      <span>Select image file</span>
                      <input type="file" name="image" required />
                    </label>
                    <label>
                      <span>Aspect ratio configuration</span>
                      <select name="ratio" required defaultValue="1/1">
                        <option value="1/1">1:1 square (Standard)</option>
                        <option value="4/3">4:3 Landscape (Wide)</option>
                        <option value="3/4">3:4 Portrait (Tall)</option>
                      </select>
                    </label>
                  </div>
                  <div className="btn-group">
                    <button type="submit" className="btn-admin-action" disabled={loading}>
                      Upload image
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="admin-gallery-grid-workspace">
                  {gallery.map(img => (
                    <div className="gallery-thumbnail-card" key={img._id}>
                      <img src={img.imageUrl} alt="gallery" />
                      <div className="ratio-overlay">{img.ratio}</div>
                      <button className="btn-gallery-delete" onClick={() => handleDeleteGallery(img._id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* UPCOMING EVENTS */}
          {activeTab === 'events' && (
            <div>
              <div className="tab-actions">
                {!showAddForm && (
                  <button className="btn-admin-action" onClick={() => { setShowAddForm(true); setCurrentEditItem(null); }}>
                    Create upcoming event
                  </button>
                )}
              </div>

              {showAddForm || currentEditItem ? (
                <form onSubmit={handleEventSubmit} className="admin-settings-form">
                  <h2>{currentEditItem ? 'Edit event' : 'Create new event'}</h2>
                  <div className="form-grid">
                    <label>
                      <span>Event title</span>
                      <input type="text" name="title" required defaultValue={currentEditItem?.title || ''} />
                    </label>
                    <label>
                      <span>Event Date (YYYY-MM-DD)</span>
                      <input type="date" name="date" required defaultValue={currentEditItem?.date ? new Date(currentEditItem.date).toISOString().split('T')[0] : ''} />
                    </label>
                    <label>
                      <span>Time scheduled (e.g. 10:00 AM)</span>
                      <input type="text" name="time" defaultValue={currentEditItem?.time || ''} />
                    </label>
                    <label>
                      <span>Location/Venue</span>
                      <input type="text" name="location" defaultValue={currentEditItem?.location || ''} />
                    </label>
                    <label className="full-width">
                      <span>Registration details or links</span>
                      <input type="text" name="registrationDetails" placeholder="Contact number or registration form URL" defaultValue={currentEditItem?.registrationDetails || ''} />
                    </label>
                    <label className="full-width">
                      <span>Event Description</span>
                      <textarea name="description" rows="5" defaultValue={currentEditItem?.description || ''} />
                    </label>
                  </div>
                  <div className="btn-group">
                    <button type="submit" className="btn-admin-action" disabled={loading}>
                      {currentEditItem ? 'Update Event' : 'Save Event'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => { setShowAddForm(false); setCurrentEditItem(null); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="admin-list-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(ev => (
                        <tr key={ev._id}>
                          <td><strong>{ev.title}</strong></td>
                          <td>{new Date(ev.date).toLocaleDateString()}</td>
                          <td>{ev.time}</td>
                          <td>{ev.location}</td>
                          <td>
                            <button className="btn-table-edit" onClick={() => { setCurrentEditItem(ev); setShowAddForm(false); }}>Edit</button>
                            <button className="btn-table-delete" onClick={() => handleDeleteEvent(ev._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* BLOG & NEWS WRITER */}
          {activeTab === 'blogs' && (
            <div>
              <div className="tab-actions">
                {!showAddForm && (
                  <button className="btn-admin-action" onClick={() => { setShowAddForm(true); setCurrentEditItem(null); }}>
                    Publish blog post
                  </button>
                )}
              </div>

              {showAddForm || currentEditItem ? (
                <form onSubmit={handleBlogSubmit} className="admin-settings-form">
                  <h2>{currentEditItem ? 'Edit post' : 'Publish new blog post'}</h2>
                  <div className="form-grid">
                    <label>
                      <span>Article Title</span>
                      <input type="text" name="title" required defaultValue={currentEditItem?.title || ''} />
                    </label>
                    <label>
                      <span>Category</span>
                      <input type="text" name="category" defaultValue={currentEditItem?.category || 'News'} />
                    </label>
                    <label>
                      <span>Author name</span>
                      <input type="text" name="author" defaultValue={currentEditItem?.author || 'Swasti Foundation'} />
                    </label>
                    <label>
                      <span>Post Cover image {currentEditItem && '(Leave empty to keep existing)'}</span>
                      <input type="file" name="image" />
                    </label>
                    <label className="full-width">
                      <span>Excerpt (short search engine summary)</span>
                      <input type="text" name="excerpt" required defaultValue={currentEditItem?.excerpt || ''} />
                    </label>
                    <label className="full-width">
                      <span>External Link / Reference URL (Optional)</span>
                      <input type="url" name="link" placeholder="https://example.com/more-details" defaultValue={currentEditItem?.link || ''} />
                    </label>
                    <label className="full-width">
                      <span>Article Content</span>
                      <textarea name="content" required rows="10" defaultValue={currentEditItem?.content || ''} />
                    </label>
                  </div>
                  <div className="btn-group">
                    <button type="submit" className="btn-admin-action" disabled={loading}>
                      {currentEditItem ? 'Update Post' : 'Publish Post'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => { setShowAddForm(false); setCurrentEditItem(null); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="admin-list-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Date Published</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map(post => (
                        <tr key={post._id}>
                          <td><strong>{post.title}</strong></td>
                          <td><span className="table-badge">{post.category}</span></td>
                          <td>{post.author}</td>
                          <td>{new Date(post.publishedDate).toLocaleDateString()}</td>
                          <td>
                            <button className="btn-table-edit" onClick={() => { setCurrentEditItem(post); setShowAddForm(false); }}>Edit</button>
                            <button className="btn-table-delete" onClick={() => handleDeleteBlog(post._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* LEADERSHIP TEAM LIST */}
          {activeTab === 'team' && (
            <div>
              <div className="tab-actions">
                {!showAddForm && (
                  <button className="btn-admin-action" onClick={() => { setShowAddForm(true); setCurrentEditItem(null); }}>
                    Add leadership member
                  </button>
                )}
              </div>

              {showAddForm || currentEditItem ? (
                <form onSubmit={handleTeamMemberSubmit} className="admin-settings-form">
                  <h2>{currentEditItem ? 'Edit leadership member' : 'Add new leadership member'}</h2>
                  <div className="form-grid">
                    <label>
                      <span>Member Name</span>
                      <input type="text" name="name" required defaultValue={currentEditItem?.name || ''} />
                    </label>
                    <label>
                      <span>Role / Designation</span>
                      <input type="text" name="role" required defaultValue={currentEditItem?.role || ''} />
                    </label>
                    <label>
                      <span>Profile Picture {currentEditItem && '(Leave empty to keep existing)'}</span>
                      <input type="file" name="image" accept="image/*" />
                      {currentEditItem?.image && (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Current:</span>
                          <img src={currentEditItem.image} alt={currentEditItem.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="btn-group">
                    <button type="submit" className="btn-admin-action" disabled={loading}>
                      {currentEditItem ? 'Update Member' : 'Save Member'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => { setShowAddForm(false); setCurrentEditItem(null); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="admin-list-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role / Designation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamList.map(member => (
                        <tr key={member._id}>
                          <td style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                              fontWeight: 'bold',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                              {member.image ? (
                                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                member.name.charAt(0)
                              )}
                            </div>
                            <strong>{member.name}</strong>
                          </td>
                          <td>{member.role}</td>
                          <td>
                            <button className="btn-table-edit" onClick={() => { setCurrentEditItem(member); setShowAddForm(false); }}>Edit</button>
                            <button className="btn-table-delete" onClick={() => handleDeleteTeamMember(member._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VOLUNTEER TEAM LIST */}
          {activeTab === 'volunteer_team' && (
            <div>
              <div className="tab-actions">
                {!showAddForm && (
                  <button className="btn-admin-action" onClick={() => { setShowAddForm(true); setCurrentEditItem(null); }}>
                    Add volunteer member
                  </button>
                )}
              </div>

              {showAddForm || currentEditItem ? (
                <form onSubmit={handleVolunteerMemberSubmit} className="admin-settings-form">
                  <h2>{currentEditItem ? 'Edit volunteer member' : 'Add new volunteer member'}</h2>
                  <div className="form-grid">
                    <label>
                      <span>Member Name</span>
                      <input type="text" name="name" required defaultValue={currentEditItem?.name || ''} />
                    </label>
                    <label>
                      <span>Role / Designation</span>
                      <input type="text" name="role" required defaultValue={currentEditItem?.role || ''} />
                    </label>
                    <label>
                      <span>Profile Picture {currentEditItem && '(Leave empty to keep existing)'}</span>
                      <input type="file" name="image" accept="image/*" />
                      {currentEditItem?.image && (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>Current:</span>
                          <img src={currentEditItem.image} alt={currentEditItem.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </label>
                    <label>
                      <span>LinkedIn Profile URL</span>
                      <input type="url" name="linkedin" placeholder="https://linkedin.com/in/username" defaultValue={currentEditItem?.linkedin || ''} />
                    </label>
                  </div>
                  <div className="btn-group">
                    <button type="submit" className="btn-admin-action" disabled={loading}>
                      {currentEditItem ? 'Update Member' : 'Save Member'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => { setShowAddForm(false); setCurrentEditItem(null); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="admin-list-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role / Designation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteerTeamList.map(member => (
                        <tr key={member._id}>
                          <td style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                              fontWeight: 'bold',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                              {member.image ? (
                                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                member.name.charAt(0)
                              )}
                            </div>
                            <strong>{member.name}</strong>
                          </td>
                          <td>{member.role}</td>
                          <td>
                            <button className="btn-table-edit" onClick={() => { setCurrentEditItem(member); setShowAddForm(false); }}>Edit</button>
                            <button className="btn-table-delete" onClick={() => handleDeleteVolunteerMember(member._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SUBMISSIONS INBOX VIEW */}
          {activeTab === 'submissions' && (
            <div className="admin-submissions-inbox-grid" style={{ gridTemplateColumns: '1fr' }}>
              
              {/* Volunteers inbox list */}
              <section className="settings-section inbox-section" style={{ maxWidth: '100%' }}>
                <h2>Volunteer registrations</h2>
                <div className="admin-list-table-container scrollable-table">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Message</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteersList.map(v => (
                        <tr key={v._id}>
                          <td><strong>{v.name}</strong></td>
                          <td><a href={`mailto:${v.email}`}>{v.email}</a></td>
                          <td><a href={`tel:${v.phone}`}>{v.phone}</a></td>
                          <td><span className="table-badge">{v.role}</span></td>
                          <td>{v.message}</td>
                          <td>
                            <button className="btn-table-delete" onClick={() => handleDeleteSubmission('volunteers', v._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          )}

          {/* DONATIONS VIEW */}
          {activeTab === 'donations' && (
            <div>
              <div className="admin-list-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Receipt ID</th>
                      <th>Donor Name</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Payment ID</th>
                      <th>Order ID</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationsList.map(d => (
                      <tr key={d._id}>
                        <td><strong>{d.receiptId}</strong></td>
                        <td>{d.donorName}</td>
                        <td><a href={`mailto:${d.email}`}>{d.email}</a></td>
                        <td>₹{d.amount.toLocaleString('en-IN')}</td>
                        <td><code style={{ fontSize: '12px' }}>{d.razorpayPaymentId}</code></td>
                        <td><code style={{ fontSize: '12px' }}>{d.razorpayOrderId}</code></td>
                        <td>{new Date(d.createdAt).toLocaleString()}</td>
                        <td><span className="table-badge" style={{ backgroundColor: 'var(--admin-primary)', color: '#fff', border: 'none' }}>{d.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
