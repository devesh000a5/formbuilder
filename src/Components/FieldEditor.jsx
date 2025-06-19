import React from "react";

const FieldEditor = ({ field, onUpdate, onDelete }) => {
  const [fieldData, setFieldData] = React.useState(field);

  const updateField = (updates) => {
    setFieldData({ ...fieldData, ...updates });
    onUpdate({ ...fieldData, ...updates });
  };

  return (
    <div className="field-editor">
      <input
        type="text"
        value={fieldData.label}
        onChange={(e) => updateField({ label: e.target.value })}
        placeholder="Field Label"
      />
      <select
        value={fieldData.type}
        onChange={(e) =>
          updateField({
            type: e.target.value,
            options:
              e.target.value === "dropdown" || e.target.value === "radio"
                ? ["Option 1", "Option 2"]
                : [],
          })
        }
      >
        <option value="text">Text</option>
        <option value="password">Password</option>
        <option value="phone">Phone</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
        <option value="dropdown">Dropdown</option>
        <option value="checkbox">Checkbox</option>
        <option value="radio">Radio</option>
      </select>

      {fieldData.type === "dropdown" && (
        <div>
          <label>Options (comma-separated):</label>
          <input
            type="text"
            value={fieldData.options.join(", ")}
            onChange={(e) =>
              updateField({
                options: e.target.value.split(",").map((opt) => opt.trim()),
              })
            }
          />
        </div>
      )}
      <button onClick={onDelete} className="button button-danger">
        Delete Field
      </button>
    </div>
  );
};

export default FieldEditor;
