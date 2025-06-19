import React from 'react';
import FieldEditor from './FieldEditor';


const FormBuilder = ({ form, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState(
    form || {
      title: '',
      fields: [],
      style: { bgColor: '#d6f5ec', textColor: '#000000' }
    }
  );

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      type,
      options: type === 'dropdown' || type === 'radio' ? ['Option 1', 'Option 2'] : []
    };
    setFormData({ ...formData, fields: [...formData.fields, newField] });
  };

  const updateField = (index, updatedField) => {
    const newFields = [...formData.fields];
    newFields[index] = updatedField;
    setFormData({ ...formData, fields: newFields });
  };

  const deleteField = (index) => {
    setFormData({ ...formData, fields: formData.fields.filter((_, i) => i !== index) });
  };

  const updateStyle = (updates) => {
    setFormData({ ...formData, style: { ...formData.style, ...updates } });
  };

  return (
    <div className="form-builder-container">
      
      <div className="form-builder-left" style={{ backgroundColor: formData.style.bgColor, color: formData.style.textColor }}>
        <h2>Form Builder</h2>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter Form Title"
          style={{ width: '50%', border: '1px solid #ccc', borderRadius: '6px', padding: '10px', marginBottom: '20px' }}
        />
        <div className="field-list">
          {formData.fields.map((field, index) => (
            <FieldEditor
              key={field.id}
              field={field}
              onUpdate={(updatedField) => updateField(index, updatedField)}
              onDelete={() => deleteField(index)}
            />
          ))}
        </div>

        <div className="style-editor">
          <label>Background Color:</label>
          <input
            type="color"
            value={formData.style.bgColor}
            onChange={(e) => updateStyle({ bgColor: e.target.value })}
          />
          <label>Text Color:</label>
          <input
            type="color"
            value={formData.style.textColor}
            onChange={(e) => updateStyle({ textColor: e.target.value })}
          />
        </div>

        <div className="button-group">
          <button onClick={() => onSave(formData)} className="button button-success">Save Form</button>
          <button onClick={onCancel} className="button button-secondary">Cancel</button>
        </div>
      </div>


      <div className="form-builder-container2">
        <h2>Add Fields</h2>
        <div className="form-builder-right">
          <button onClick={() => addField('text')} className="button button-primary">Text Field</button>
          <button onClick={() => addField('dropdown')} className="button button-primary">Dropdown</button>
          <button onClick={() => addField('checkbox')} className="button button-primary">Checkbox</button>
          <button onClick={() => addField('radio')} className="button button-primary">Radio Button</button>
          <button onClick={() => addField('date')} className="button button-primary">Date</button>
          <button onClick={() => addField('password')} className="button button-primary">Password</button>
          <button onClick={() => addField('phone')} className="button button-primary">Phone</button>
          <button onClick={() => addField('time')} className="button button-primary">Time</button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
