import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Table = props => {
  const { rawdata } = props
  return (
    <table className="table">
      <thead>
          <tr>
          <th>Task</th>
          <th>Description</th>
          <th>Priority</th>
          </tr>
      </thead>
      <tbody>
          { rawdata && _.sortBy(rawdata[0].data.mossByte.object, [function(o) { return o.priority; }]).map((item, i) =>
            <tr key={i + 1}>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>
                {item.priority === 1 && <button className="button is-danger">TOP</button> }
                {item.priority === 2 && <button className="button is-warning">LOW</button> }
                {item.priority === 3 && <button className="button is-info">LOWER</button> }
                {item.priority === 4 && <button className="button is-dark">LOWEST</button> }
              </td>
            </tr>
          )} 
      </tbody>
    </table>
  )
}

Table.propTypes = {
  rawdata: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
}

export default Table