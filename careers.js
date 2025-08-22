import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  FiHome, FiBriefcase, FiSettings, FiUser, 
  FiUsers, FiMenu, FiArrowLeft, FiX, FiCalendar, 
  FiPhone, FiArrowRight, FiMail, FiUpload, FiMapPin
} from 'react-icons/fi';
import { 
  FaLinkedin, FaFacebook, FaInstagram, 
  FaTwitter, FaWhatsapp, FaUserTie, FaBriefcase
} from 'react-icons/fa';
import logoImage from '../src/eio.jpg';
import './Career.css';

const Career = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [jobType, setJobType] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    qualification: '',
    degree: '',
    experience: '',
    resume: null,
    about: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const jobOpenings = [
    {
      id: 1,
      title: "Flutter Developer",
      description: "Develop cross-platform mobile applications using Flutter framework.",
      type: "Development"
    },
    {
      id: 2,
      title: "Frontend Developer",
      description: "Build responsive and interactive user interfaces with React.js.",
      type: "Development"
    },
    // {
    //   id: 3,
    //   title: "Backend Developer",
    //   description: "Develop server-side logic and database architecture.",
    //   type: "Development"
    // },
    // {
    //   id: 4,
    //   title: "UI/UX Designer",
    //   description: "Create beautiful and functional user interfaces and experiences.",
    //   type: "Design"
    // },
    // {
    //   id: 5,
    //   title: "Web Developer",
    //   description: "Creates visually appealing and functional websites using front-end and back-end technologies.",
    //   type: "Development"
    // },
    // {
    //   id: 6,
    //   title: "PCB Design",
    //   description: "Designs printed circuit boards for electronic devices, ensuring optimal component placement and signal integrity.",
    //   type: "Designing"
    // },
    // {
    //   id: 7,
    //   title: "Android Development",
    //   description: "Builds mobile applications for Android devices using Java, Kotlin, and Android SDK.",
    //   type: "Development"
    // },
    // {
    //   id: 8,
    //   title: "Full Stack Developer",
    //   description: "Develops both client-side and server-side components of web applications.",
    //   type: "Development"
    // }
  ];

  const validateForm = () => {
    const errors = {};
    if (!jobType) errors.jobType = 'Job type is required';
    if (!selectedPosition) errors.position = 'Position is required';
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Invalid phone number';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.qualification) errors.qualification = 'Qualification is required';
    if (!formData.degree.trim()) errors.degree = 'Degree is required';
    if (!formData.experience) errors.experience = 'Experience is required';
    if (!formData.resume) {
      errors.resume = 'Resume is required';
    } else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(formData.resume.type)) {
      errors.resume = 'Resume must be a PDF or DOC/DOCX file';
    } else if (formData.resume.size > 4 * 1024 * 1024) {
      errors.resume = 'Resume size must not exceed 4MB';
    }
    if (!formData.about.trim()) errors.about = 'About section is required';
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setFormErrors({
      ...formErrors,
      [name]: ''
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0]
    });
    setFormErrors({
      ...formErrors,
      resume: ''
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const errors = validateForm();

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setIsSubmitting(true);

  const formDataToSend = new FormData();
  formDataToSend.append('jobType', jobType);
  formDataToSend.append('position', selectedPosition);
  formDataToSend.append('fullName', formData.fullName);
  formDataToSend.append('phone', formData.phone);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('qualification', formData.qualification);
  formDataToSend.append('degree', formData.degree);
  formDataToSend.append('experience', formData.experience);
  formDataToSend.append('resume', formData.resume);
  formDataToSend.append('about', formData.about);
  formDataToSend.append('to_email', 'soorya971577@gmail.com');

  try {
    const response = await fetch('https://myeiobackend.onrender.com/api/send-career-application', {
      method: 'POST',
      body: formDataToSend,
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned ${response.status}: Unable to process request.`);
      }
    }

    const data = await response.json();
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      qualification: '',
      degree: '',
      experience: '',
      resume: null,
      about: ''
    });
    setJobType('');
    setSelectedPosition('');
    setShowForm(false);
    setFormErrors({});
    alert('Application submitted successfully!');
  } catch (error) {
    console.error('Submission Error:', error);
    alert(`Failed to send application: ${error.message || 'Network error. Please check your connection or try again later.'}`);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleApplyClick = (type) => {
    setJobType(type);
    setShowForm(true);
    document.getElementById('career-application-form-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button 
          className="sidebar-toggle" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FiArrowLeft size={24} /> : <FiMenu size={24} />}
        </button>
        
        <div className="sidebar-content">
          <div className="company-info">
            <h3>About EIO</h3>
            <p>EIO is a leading digital solutions provider specializing in web development, mobile applications, and digital transformation services.</p>
          </div>
          
          <div className="sidebar-menu">
            <Link to="/" className="sidebar-item">
              <FiHome className="sidebar-icon" />
              <span>Home</span>
            </Link>
            <Link to="/about" className="sidebar-item">
              <FaUserTie className="sidebar-icon" />
              <span>About Us</span>
            </Link>
            <Link to="/services" className="sidebar-item">
              <FiSettings className="sidebar-icon" />
              <span>Services</span>
            </Link>
            <Link to="/portfolio" className="sidebar-item">
              <FiBriefcase className="sidebar-icon" />
              <span>Portfolio</span>
            </Link>
            <Link to="/team" className="sidebar-item">
              <FiUsers className="sidebar-icon" />
              <span>Teams</span>
            </Link>
            <Link to="/careers" className="sidebar-item">
              <FaBriefcase className="sidebar-icon" />
              <span>Careers</span>
            </Link>
            <Link to="/contact" className="sidebar-item">
              <FiUser className="sidebar-icon" />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-container">            
            <div className="navbar-brand">
              <div to="/" className="brand-logo-container">
                <img 
                  src={logoImage}
                  alt="EIO Logo" 
                  className="brand-logo"
                />
                <span className="logo-text">
                  <span className="logo-part logo-part-1">Electronic</span>
                  <span className="logo-part logo-part-2">Intelligence</span>
                  <span className="logo-part logo-part-3">Online</span>
                </span>
              </div>
            </div>
            
            <div className="navbar-links">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About us</NavLink>
              <NavLink to="/services">Services</NavLink>
              <NavLink to="/portfolio">Portfolio</NavLink>
              <NavLink to="/team">Teams</NavLink>
              <NavLink to="/careers">Careers</NavLink>
              <NavLink to="/contact">Contact</NavLink>              
            </div>
          </div>
        </nav>

        {/* Career Page Specific Content */}
        <section className="career-page">
          <div className="career-container">
            <div className="career-header">
              <span className="career-header-label">Career Opportunities</span>
              <h2 className="career-title">Join Our Team</h2>
              <span className="career-subtitle">Explore exciting career opportunities at EIO</span>
            </div>

            <div className="career-options-grid">
              <div className="career-option-card">
                <FiBriefcase className="career-option-icon" />
                <h3 className="career-option-title">Apply for Jobs</h3>
                <h2 className="career-option-desc">Browse our current job openings and apply directly</h2>
                <button 
                  className="btn primary" 
                  onClick={() => handleApplyClick('fulltime')}
                >
                  Apply now
                </button>
              </div>
              <div className="career-option-card">
                <FiCalendar className="career-option-icon" />
                <h3 className="career-option-title">Apply for Internships</h3>
                <h2 className="career-option-desc">Gain valuable experience with our internship programs</h2>
                <button 
                  className="btn primary" 
                  onClick={() => handleApplyClick('internship')}
                >
                  Apply now
                </button>
              </div>
            </div>

            <div className="career-job-section">
              <h3 className="career-job-title">Current Openings</h3>
              <div className="career-job-grid">
                {jobOpenings.map(job => (
                  <div key={job.id} className="career-job-card">
                    <h4 className="career-job-name">{job.title}</h4>
                    <span className="career-job-type">{job.type}</span>
                    <p className="career-job-desc">{job.description}</p>
                    <button 
                      className="btn secondary"
                      onClick={() => {
                        setSelectedPosition(job.title);
                        setShowForm(true);
                        document.getElementById('career-application-form-section').scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div id="career-application-form-section" className="career-form-section">
              {(showForm || selectedPosition) && (
                <>
                  <h3 className="career-form-title">Application Form</h3>
                  <form onSubmit={handleSubmit} className="career-form">
                    <div className="career-form-group">
                      <label className="career-form-label">Apply Type</label>
                      <select
                        name="jobType"
                        value={jobType}
                        onChange={(e) => {
                          setJobType(e.target.value);
                          setFormErrors({ ...formErrors, jobType: '' });
                        }}
                        className={`career-form-select ${formErrors.jobType ? 'career-form-error-input' : ''}`}
                        required
                      >
                        <option value="">Select Apply Type</option>
                        <option value="fulltime">Full Time</option>
                        <option value="internship">Internship</option>
                      </select>
                      {formErrors.jobType && <span className="career-form-error">{formErrors.jobType}</span>}
                    </div>
                    <div className="career-form-group">
                      <label className="career-form-label">Position Applying For</label>
                      <select
                        name="position"
                        value={selectedPosition}
                        onChange={(e) => {
                          setSelectedPosition(e.target.value);
                          setFormErrors({ ...formErrors, position: '' });
                        }}
                        className={`career-form-select ${formErrors.position ? 'career-form-error-input' : ''}`}
                        required
                      >
                        <option value="">Select Position</option>
                        {jobOpenings.map(job => (
                          <option key={job.id} value={job.title}>{job.title}</option>
                        ))}
                      </select>
                      {formErrors.position && <span className="career-form-error">{formErrors.position}</span>}
                    </div>
                    <div className="career-form-group">
                      <label className="career-form-label">Full Name</label>
                      <input 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        className={`career-form-input ${formErrors.fullName ? 'career-form-error-input' : ''}`}
                        required 
                      />
                      {formErrors.fullName && <span className="career-form-error">{formErrors.fullName}</span>}
                    </div>
                    <div className="career-form-group">
                      <label className="career-form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className={`career-form-input ${formErrors.phone ? 'career-form-error-input' : ''}`}
                        required 
                      />
                      {formErrors.phone && <span className="career-form-error">{formErrors.phone}</span>}
                    </div>
                    <div className="career-form-group">
                      <label className="career-form-label">Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={`career-form-input ${formErrors.email ? 'career-form-error-input' : ''}`}
                        required 
                      />
                      {formErrors.email && <span className="career-form-error">{formErrors.email}</span>}
                    </div>
                    <div className="career-form-group">
                      <label className="career-form-label">Highest Qualification</label>
                      <select 
                        name="qualification" 
                        value={formData.qualification} 
                        onChange={handleInputChange}
                        className={`career-form-select ${formErrors.qualification ? 'career-form-error-input' : ''}`}
                        required
                      >
                        <option value="">Select Qualification</option>
                        <option value="ug">UG Degree</option>
                        <option value="pg">PG Degree</option>
                        <option value="diploma">Diploma</option>
                        <option value="other">Other</option>
                      </select>
                      {formErrors.qualification && <span className="career-form-error">{formErrors.qualification}</span>}
                    </div>
                    {formData.qualification && (
                      <div className="career-form-group">
                        <label className="career-form-label">
                          {formData.qualification === 'ug' ? 'UG Degree' : 
                           formData.qualification === 'pg' ? 'PG Degree' : 
                           formData.qualification === 'diploma' ? 'Diploma' : 'Qualification'}
                        </label>
                        <input 
                          type="text" 
                          name="degree" 
                          value={formData.degree} 
                          onChange={handleInputChange} 
                          className={`career-form-input ${formErrors.degree ? 'career-form-error-input' : ''}`}
                          required 
                          placeholder={`Enter your ${formData.qualification === 'ug' ? 'Undergraduate degree' : 
                                       formData.qualification === 'pg' ? 'Postgraduate degree' : 
                                       formData.qualification === 'diploma' ? 'Diploma' : 'qualification'}`}
                        />
                        {formErrors.degree && <span className="career-form-error">{formErrors.degree}</span>}
                      </div>
                    )}
                    <div className="career-form-group">
                      <label className="career-form-label">Work Experience</label>
                      <select 
                        name="experience" 
                        value={formData.experience} 
                        onChange={handleInputChange}
                        className={`career-form-select ${formErrors.experience ? 'career-form-error-input' : ''}`}
                        required
                      >
                        <option value="">Select Experience</option>
                        <option value="fresher">Fresher</option>
                        <option value="1-2">1-2 Years</option>
                        <option value="3-5">3-5 Years</option>
                        <option value="5+">5+ Years</option>
                      </select>
                      {formErrors.experience && <span className="career-form-error">{formErrors.experience}</span>}
                    </div>
                    <div className="career-form-group">
                      <label className="career-form-label">Upload Resume</label>
                      <div className="career-file-upload">
                        <FiUpload className="career-upload-icon" />
                        <input 
                          type="file" 
                          name="resume" 
                          onChange={handleFileChange} 
                          accept=".pdf,.doc,.docx" 
                          className="career-file-input"
                          required 
                        />
                        <span className="career-file-name">{formData.resume ? formData.resume.name : 'Choose file'}</span>
                      </div>
                      {formErrors.resume && <span className="career-form-error">{formErrors.resume}</span>}
                      <div className="career-file-notes">
                        <p>Note:</p>
                        <ol>
                          <li>Document extension should be Pdf or Docx</li>
                          <li>Document Size should not be greater than 4MB</li>
                          <li>Document is Mandatory</li>
                        </ol>
                      </div>
                    </div>
                    <div className="career-form-group">
                      <label className="career-form-label">Tell About Yourself (about 300 words)</label>
                      <textarea 
                        name="about" 
                        value={formData.about} 
                        onChange={handleInputChange} 
                        rows="5" 
                        maxLength="1500"
                        className={`career-form-textarea ${formErrors.about ? 'career-form-error-input' : ''}`}
                        required
                      ></textarea>
                      {formErrors.about && <span className="career-form-error">{formErrors.about}</span>}
                    </div>
                    <button 
                      type="submit" 
                      className="career-form-submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'} <FiArrowRight />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>About EIO</h3>
                <p>We are a team of digital experts dedicated to creating innovative solutions that drive business growth and enhance user experiences.</p>
              </div>
              <div className="footer-section">
                <h3>Quick Links</h3>
                <ul>
                  <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
                  <li><Link to="/about" onClick={() => window.scrollTo(0, 0)}>About us</Link></li>
                  <li><Link to="/services" onClick={() => window.scrollTo(0, 0)}>Services</Link></li>
                  <li><Link to="/portfolio" onClick={() => window.scrollTo(0, 0)}>Portfolio</Link></li>
                  <li><Link to="/team" onClick={() => window.scrollTo(0, 0)}>Teams</Link></li>
                  <li><Link to="/careers" onClick={() => window.scrollTo(0, 0)}>Careers</Link></li>
                  <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)}>Contact</Link></li>
                </ul>
              </div>
              <div className="footer-section">
                <h3>Contact Us</h3>
                <ul>
                  <li><FiMail /> myeiokln@gmail.com</li>
                  <li style={{ marginLeft: '27px' }}>info@myeio.in</li>
                  <li><FiPhone /> +91 9840624407</li>
                  <li style={{ marginLeft: '27px' }}>+91 9444224407</li>
                  <li><FiMapPin />1A/1-G9 Wavoo Centre,</li>
                  <li style={{ marginLeft: '27px' }}>Madurai Road, Trunelveli-627001</li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} EIO - Electronic Intelligence Online. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Career;