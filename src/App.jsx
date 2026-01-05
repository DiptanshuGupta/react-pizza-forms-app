import React from 'react';
import RegistrationForm from './components/RegistrationForm';
import PizzaOrder from './components/PizzaOrder';
import './styles/forms.css';

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>Forms & Interactivity</h1>
        <p>Practice controlled inputs, validation, and dynamic UI with React.</p>
      </header>
      <main>
        <RegistrationForm />
        <PizzaOrder />
      </main>
    </div>
  );
}