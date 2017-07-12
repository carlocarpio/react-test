const endpoint = 'https://mossbyte.com/api/v1';
// const applicationKey = '6829e3a3-ffbb-4d49-bdc3-66a18e3bf003';
const publicAppKey = 'f26c15a4-7692-482f-a138-04d47e2ea4d5'


function checkStatus(response) {
  if (response.ok) {
    return response;
  }
  console.log(response);
  const error = new Error(response.status);
  error.response = response;
  throw error;
}

function createMossByte(body = {}) {
  return fetch(`${endpoint}/${publicAppKey}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(checkStatus)
  .then(res => res.json()); 
}

function getMossByte(key) {
  const url = `${endpoint}/${key}`
  return fetch(url, {
    method: 'GET',
  })
  .then(checkStatus)
  .then(res => res.json())
  .catch((err) => {
    if (err.response.status === 404) {
      return Promise.resolve({});
    }
    return err;
  });
}

function removeMossByte(key) {
  const url = `${endpoint}/${key}`
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(checkStatus)
  .then(res => res.json())
  .catch((err) => {
    if (err.response.status === 404) {
      return Promise.resolve({});
    }
    return err;
  });
}

function updateMossByte(body = {}, key) {
  const url = `${endpoint}/${key}`
  return fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(checkStatus)
  .then(res => res.json())
  .catch((err) => {
    if (err.response.status === 404) {
      return Promise.resolve({});
    }
    return err;
  });
}

module.exports = {
  createMossByte,
  endpoint,
  getMossByte,
  removeMossByte,
  updateMossByte,
};