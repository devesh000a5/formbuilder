import React from "react";

const FormRenderer = ({ form, onSubmit }) => {
  const [responses, setResponses] = React.useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(responses);
  };

  const handleChange = (fieldId, value) => {
    setResponses({ ...responses, [fieldId]: value });
  };

  return (
    <div
      className="form-renderer"
      style={{
        backgroundColor: form.style.bgColor,
        color: form.style.textColor,
      }}
    >
      <h2>{form.title}</h2>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field) => (
          <div key={field.id}>
            <label>{field.label}</label>
            {field.type === "text" && (
              <input
                type="text"
                onChange={(e) => handleChange(field.id, e.target.value)}
                style={{ color: form.style.textColor }}
              />
            )}
            {field.type === "dropdown" && (
              <select
                onChange={(e) => handleChange(field.id, e.target.value)}
                style={{ color: form.style.textColor }}
              >
                <option value="">Select an option</option>
                {field.options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {field.type === "checkbox" && (
              <input
                type="checkbox"
                onChange={(e) => handleChange(field.id, e.target.checked)}
              />
            )}
            {field.type === "radio" && (
              <div>
                {field.type === "radio" &&
                  field.options.map((option, idx) => (
                    <label key={idx} className="option-box">
                      <input
                        type="radio"
                        name={field.id}
                        value={option}
                        onChange={handleChange}
                      />
                      {option}
                    </label>
                  ))}
              </div>
            )}
             {field.type === 'date' && (
      <input type="date" name={field.id} onChange={handleChange} />
    )}
    {field.type === 'password' && (
      <input type="password" name={field.id} onChange={handleChange} />
    )}
    {field.type === 'phone' && (
      <input type="tel" name={field.id} onChange={handleChange} />
    )}
    {field.type === 'time' && (
      <input type="time" name={field.id} onChange={handleChange} />
    )}

          </div>
        ))}
        <button type="submit" className="button button-primary">
          Submit
        </button>
      </form>
    </div>
  );
};
export default FormRenderer;
