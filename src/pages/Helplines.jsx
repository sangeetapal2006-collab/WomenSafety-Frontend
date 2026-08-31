import React, { useState, useEffect } from 'react';
import {
  FiPhone,
  FiSearch,
  FiShield,
  FiExternalLink,
  FiAlertTriangle,
  FiActivity,
  FiGlobe,
  FiBookOpen,
  FiHeart,
  FiUsers,
  FiCheckCircle
} from 'react-icons/fi';
import { helplineService } from '../services/helplineService';
import { HELPLINE_CATEGORIES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Helplines = () => {
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHelplines();
  }, [category, search]);

  const fetchHelplines = async () => {
    try {
      setLoading(true);
      const res = await helplineService.getHelplines({ category, search });
      if (res.success && res.data) {
        setHelplines(res.data.helplines || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Police':
        return <FiAlertTriangle color="#e11d48" size={22} />;
      case 'Women Helpline':
      case 'Domestic Violence':
        return <FiShield color="#f43f5e" size={22} />;
      case 'Cyber Crime':
        return <FiGlobe color="#6366f1" size={22} />;
      case 'Ambulance':
        return <FiActivity color="#10b981" size={22} />;
      case 'Mental Health & Counseling':
        return <FiHeart color="#ec4899" size={22} />;
      case 'Legal Aid':
        return <FiBookOpen color="#f59e0b" size={22} />;
      case 'Child Helpline':
        return <FiUsers color="#38bdf8" size={22} />;
      default:
        return <FiPhone color="#94a3b8" size={22} />;
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(225, 29, 72, 0.15)',
            color: '#f43f5e',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}
        >
          <FiPhone size={16} /> 24/7 VERIFIED EMERGENCY DIRECTORY
        </div>
        <h1 style={{ fontSize: '2.4rem', margin: 0 }}>Emergency Support Helplines</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px', margin: '0.5rem auto 0 auto' }}>
          Toll-free national and regional contact numbers for law enforcement, women's distress crisis lines, cyber crime, ambulance, and free legal aid.
        </p>
      </div>

      {/* Search & Categories Toolbar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'var(--bg-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ position: 'relative' }}>
          <FiSearch
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)'
            }}
            size={18}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Search by organization name, number, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {HELPLINE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                background: category === cat ? 'var(--primary-600)' : 'var(--bg-input)',
                color: category === cat ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: category === cat ? 'var(--primary-600)' : 'var(--border-color)',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching verified emergency helplines..." />
      ) : helplines.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FiPhone size={40} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0' }}>No Helplines Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No emergency services matched your filter query.
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {helplines.map((item) => (
            <div
              key={item._id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        padding: '10px',
                        borderRadius: '12px',
                        display: 'flex'
                      }}
                    >
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--primary-500)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {item.category}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{item.name}</h3>
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  {item.description}
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1rem'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>
                      Primary Number
                    </span>
                    <strong style={{ fontSize: '1.2rem', color: '#ffffff', letterSpacing: '0.02em' }}>
                      {item.phoneNumber}
                    </strong>
                  </div>
                  <a
                    href={`tel:${item.phoneNumber}`}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    <FiPhone /> Call Now
                  </a>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  <span>Availability: {item.availability || '24/7'}</span>
                  <span>{item.tollFree ? 'Toll Free' : 'Standard Rates'}</span>
                  <span>{item.region || 'National'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regional Variation Disclaimer */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginTop: '2.5rem',
          fontSize: '0.825rem',
          color: 'var(--text-dim)',
          textAlign: 'center'
        }}
      >
        <FiAlertTriangle style={{ color: '#fbbf24', display: 'inline', marginRight: '6px' }} />
        Emergency helpline telephone numbers may vary by state and jurisdiction. The above listings are vetted national response channels.
      </div>
    </div>
  );
};

export default Helplines;
