import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GlowButton from '../ui/GlowButton';

const TeamProfileBuilder = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    year: '',
    school: '',
    major: '',
    preferred_roles: [], 
    preferred_contact: '',
    skills: [],
    interests: [],
    bio: '',
    github: '',
    linkedin: '',
    pfp: ''
  });

  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/accounts/profile/get');
        const profile = res.data.profile;
        setFormData(prev => ({
          ...prev,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          pfp: profile.pfp || '',
          school: profile.school || '',
          major: profile.major || '',
          linkedin: profile.linkedIn || '',
          year: profile.grad_year || '',
        }));
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bio' && value.length > 300) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = (key, input, setInput) => {
    if (input.trim() && !formData[key].includes(input.trim()) && formData[key].length < 5) {
      setFormData(prev => ({ ...prev, [key]: [...prev[key], input.trim()] }));
      setInput('');
    }
  };

  const removeTag = (key, tag) => {
    setFormData(prev => ({ ...prev, [key]: prev[key].filter(t => t !== tag) }));
  };

  const isFormValid = () => {
    const requiredFields = ['first_name', 'last_name', 'year', 'school', 'major', 'bio', 'preferred_contact'];
    for (let field of requiredFields) {
      if (!formData[field]) return false;
    }
    if (formData.preferred_roles.length === 0) return false;
    return true;
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      preferred_roles: prev.preferred_roles.includes(role)
        ? prev.preferred_roles.filter(r => r !== role)
        : [...prev.preferred_roles, role]
    }));
  };


  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError('Please fill out all required fields.');
      return;
    }
    try {
      await axios.post('/api/teammatch/create', formData);
      onComplete();
    } catch (err) {
      console.error('Error submitting team matching profile', err);
    }
  };

  if (loading) return <div className="text-white text-xl">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh pt-12">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-8 mt-4 mb-5"
        style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">Team Matching Profile</h2>

        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white mb-1 block">First Name</label>
            <input name="first_name" value={formData.first_name} onChange={handleChange} className="p-2 rounded bg-white text-black w-full" />
          </div>
          <div>
            <label className="text-white mb-1 block">Last Name</label>
            <input name="last_name" value={formData.last_name} onChange={handleChange} className="p-2 rounded bg-white text-black w-full" />
          </div>
          <div>
            <label className="text-white mb-1 block">Graduation Year</label>
            <input name="year" value={formData.year} onChange={handleChange} className="p-2 rounded bg-white text-black w-full" />
          </div>
          <div>
            <label className="text-white mb-1 block">School</label>
            <input name="school" value={formData.school} onChange={handleChange} className="p-2 rounded bg-white text-black w-full" />
          </div>
          <div>
            <label className="text-white mb-1 block">Major</label>
            <input name="major" value={formData.major} onChange={handleChange} className="p-2 rounded bg-white text-black w-full" />
          </div>
          <div>
            <label className="text-white mb-1 block">Preferred Contact</label>
            <select
              name="preferred_contact"
              value={formData.preferred_contact}
              onChange={handleChange}
              className="p-2 rounded bg-white text-black w-full"
            >
              <option value="">Select Contact Method</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
            </select>
          </div>
          <div>
            <label className="text-white mb-1 block">GitHub</label>
            <input name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/yourusername"
 className="p-2 rounded bg-white text-black w-full" />
          </div>
          <div>
            <label className="text-white mb-1 block">LinkedIn</label>
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="p-2 rounded bg-white text-black w-full" />
          </div>
        </div>

        {/* Preferred Roles */}
        <div className="mt-6">
          <label className="block mb-3 font-semibold text-white">Preferred Role(s)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['Designer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Product Manager', 'Hardware Hacker', 'DevOps/Infrastructure', 'Data Scientist', 'Other'].map(role => (
              <label key={role} className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferred_roles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                  className="mr-2 w-4 h-4"
                />
                <span className="text-sm">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block mb-2 font-semibold text-white">Short Bio (max 300 characters)</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." className="w-full p-2 rounded bg-white text-black" rows={4} />
        </div>

        {/* Skills */}
        <div className="mt-4">
          <label className="block mb-2 font-semibold text-white">Skills (max 5)</label>
          <div className="flex gap-2 mb-2">
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="e.g. React, Python" className="p-2 rounded bg-white text-black flex-1" />
            <button onClick={() => addTag('skills', skillInput, setSkillInput)} className="bg-blue-600 px-4 py-2 rounded text-white">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map(skill => (
              <span key={skill} className="bg-blue-800 px-3 py-1 rounded-full text-sm text-white">
                {skill} <button onClick={() => removeTag('skills', skill)}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="mt-4">
          <label className="block mb-2 font-semibold text-white">Interests (max 5)</label>
          <div className="flex gap-2 mb-2">
            <input value={interestInput} onChange={e => setInterestInput(e.target.value)} placeholder="e.g. AI, ML, FinTech" className="p-2 rounded bg-white text-black flex-1" />
            <button onClick={() => addTag('interests', interestInput, setInterestInput)} className="bg-blue-600 px-4 py-2 rounded text-white">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.interests.map(interest => (
              <span key={interest} className="bg-blue-800 px-3 py-1 rounded-full text-sm text-white">
                {interest} <button onClick={() => removeTag('interests', interest)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <GlowButton onClick={handleSubmit}>
            Submit
          </GlowButton>
        </div>

      </div>
    </div>
  );
};

export default TeamProfileBuilder;