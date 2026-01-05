import React, { useEffect, useMemo, useState } from 'react';
import { isEmail, isStrongPassword, isPhone, required, match } from '../utils/validation';
import '../styles/forms.css';

const initial = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: '',
  terms: false,
};

export default function RegistrationForm() {
  const [form, setForm] = useState(() => {
    const cached = localStorage.getItem('registrationForm');
    return cached ? JSON.parse(cached) : initial;
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('registrationForm', JSON.stringify(form));
  }, [form]);

  const errors = useMemo(() => {
    const e = {};
    if (!required(form.name)) e.name = 'Name is required.';
    if (!required(form.email)) e.email = 'Email is required.';
    else if (!isEmail(form.email)) e.email = 'Enter a valid email.';
    if (!required(form.phone)) e.phone = 'Phone is required.';
    else if (!isPhone(form.phone)) e.phone = 'Enter a valid phone number.';
    if (!required(form.password)) e.password = 'Password is required.';
    else if (!isStrongPassword(form.password))
      e.password =
        'Use 8+ chars, with uppercase, lowercase, number, and a special character.';
    if (!required(form.confirmPassword)) e.confirmPassword = 'Confirm your password.';
    else if (!match(form.password, form.confirmPassword))
      e.confirmPassword = 'Passwords do not match.';
    if (!required(form.gender)) e.gender = 'Select a gender.';
    if (!form.terms) e.terms = 'You must accept Terms & Conditions.';
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const onReset = () => {
    setForm(initial);
    setTouched({});
    setSubmitted(false);
    setServerMessage('');
    localStorage.removeItem('registrationForm');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      gender: true,
      terms: true,
    });
    if (!isValid) return;

    await new Promise((res) => setTimeout(res, 800)); // mock API
    setSubmitted(true);
    setServerMessage(`Registration successful. Welcome, ${form.name}!`);
    onReset(); // Clear after success; remove this line if you want to keep data shown
  };

  return (
    <div className="card">
      <h2>User Registration</h2>
      <form onSubmit={onSubmit} noValidate>
        <div className="field">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Your full name"
          />
          {touched.name && errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="field">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="you@example.com"
          />
          {touched.email && errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="field">
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="10–15 digit number"
          />
          {touched.phone && errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        <div className="field">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Strong password"
          />
          {touched.password && errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="field">
          <label>Confirm password</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Retype password"
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="field">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={onChange} onBlur={onBlur}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
          {touched.gender && errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        <div className="field checkbox">
          <label>
            <input
              name="terms"
              type="checkbox"
              checked={form.terms}
              onChange={onChange}
              onBlur={onBlur}
            />
            I accept the Terms & Conditions
          </label>
          {touched.terms && errors.terms && <p className="error">{errors.terms}</p>}
        </div>

        <div className="actions">
          <button type="button" onClick={onReset}>Reset</button>
          <button type="submit" disabled={!isValid}>Register</button>
        </div>
      </form>

      {submitted && serverMessage && <div className="success">{serverMessage}</div>}
    </div>
  );
}