import React from 'react';
import PropTypes from 'prop-types';

const Field = props => {
  const { onChange, title, type, value } = props
  return (
    <div className="field">
      <label className="label">{title}</label>
      <p className="control">
        <input
          className="input"
          type={type}
          value={value}
          onChange={onChange}
        />
      </p>
    </div>
  )
}

Field.propTypes = {
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export default Field