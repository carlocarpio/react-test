
import React from 'react';
import PropTypes from 'prop-types';

const Select = props => {
  const { onChange, title, value } = props
  return (
    <div className="field">
      <label className="label">{title}</label>
      <p className="control">
        <span className="select">
          <select value={value} onChange={onChange}>
            <option>------</option>
            <option value="4">lowest</option>
            <option value="3">lower</option>
            <option value="2">low</option>
            <option value="1">top</option>
          </select>
        </span>
      </p>
    </div>
  )
}

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export default Select;