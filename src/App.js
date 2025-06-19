// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormBuilder from './Components/FormBuilder';
import FormRenderer from './Components/FormRenderer';

const App = () => {
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [mode, setMode] = useState('list');

  const saveForm = (formData) => {
    if (formData.id) {
      setForms(forms.map(f => f.id === formData.id ? { ...formData } : f));
    } else {
      setForms([...forms, { ...formData, id: Date.now() }]);
    }
    setCurrentForm(null);
    setMode('list');
  };

  const duplicateForm = (formId) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      setForms([...forms, { ...form, id: Date.now(), title: `${form.title} (Copy)` }]);
    }
  };

  const deleteForm = (formId) => {
    setForms(forms.filter(f => f.id !== formId));
    if (currentForm?.id === formId) setCurrentForm(null);
  };

  const handleSubmit = async (formResponses) => {
    const newResponse = {
      formId: currentForm.id,
      responses: formResponses,
    };

    await axios.post('http://localhost:5000/api/responses', newResponse);
    setCurrentForm(null);
    setMode('list');
  };

  const fetchResponses = async () => {
    if (currentForm) {
      const res = await axios.get(`http://localhost:5000/api/responses/${currentForm.id}`);
      setResponses(res.data);
    }
  };

  useEffect(() => {
    if (mode === 'responses') {
      fetchResponses();
    }
  }, [mode, currentForm]);

  const downloadCSV = () => {
    const csvHeader = currentForm.fields.map(f => f.label).join(',');
    const csvBody = responses
      .map(r => currentForm.fields.map(f => r.responses[f.id] || '').join(','))
      .join('\n');

    const csv = [csvHeader, csvBody].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentForm.title}_responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <header className="header navbar">
        <div className="logo">Formify</div>
        <nav>
          <ul className="nav-links">
            <li><button onClick={() => { setCurrentForm(null); setMode('build'); }}>Create Form</button></li>
            <li><button onClick={() => setMode('list')}>About</button></li>
            <li><button>Sign In</button></li>
          </ul>
        </nav>
      </header>

      {mode === 'list' && forms.length === 0 && (
        <div className="landing-section">
          <h1>Build powerful forms faster. Get meaningful results.</h1>
          <p>No more waiting on developers, no design skills required – just drag, drop, and launch.</p>
          <button className="button button-primary" onClick={() => { setCurrentForm(null); setMode('build'); }}>Create New Form</button>
          <p className="subtext">New kind of form builder</p>
        </div>
      )}

      {mode === 'list' && forms.length > 0 && (
        <div className="container">
          <div className="form-list">
            {forms.map(form => (
              <div key={form.id} className="form-item">
                <span>{form.title}</span>
                <div>
                  <button onClick={() => { setCurrentForm(form); setMode('view'); }} className="button button-success">View</button>
                  <button onClick={() => { setCurrentForm(form); setMode('build'); }} className="button button-primary">Edit</button>
                  <button onClick={() => duplicateForm(form.id)} className="button button-warning">Duplicate</button>
                  <button onClick={() => deleteForm(form.id)} className="button button-danger">Delete</button>
                  <button onClick={() => { setCurrentForm(form); setMode('responses'); }} className="button button-primary">View Responses</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'build' && (
        <FormBuilder
          form={currentForm}
          onSave={saveForm}
          onCancel={() => setMode('list')}
        />
      )}

      {mode === 'view' && currentForm && (
        <FormRenderer
          form={currentForm}
          onSubmit={handleSubmit}
        />
      )}

      {mode === 'responses' && currentForm && (
        <div className="responses-container">
          <h2>Responses for {currentForm.title}</h2>
          <button onClick={() => setMode('list')} className="button button-secondary">
            Back
          </button>

          {responses.map(response => (
            <div key={response._id} className="response-item">
              {Object.entries(response.responses).map(([fieldId, value]) => {
                const field = currentForm.fields.find(f => f.id === fieldId);
                return (
                  <div key={fieldId}>
                    <strong>{field?.label || 'Unknown'}:</strong> {value.toString()}
                  </div>
                );
              })}
            </div>
          ))}

          <button onClick={downloadCSV} className="button button-primary">
            Download Responses as CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
