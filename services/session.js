export function get(key) {
  if (!sessionStorage) {
    throw new Error('Session Not Available');
  }

  const data = JSON.parse(sessionStorage.getItem('data'));

  if (!key) {
    return data;
  }

  if (data && data[key]) {
    return data[key];
  }

  return {};
}

export function set(key, value) {
  const data = get();

  data[key] = value;

  save(data);

  return data;
}

export function save(data) {
  if (!sessionStorage) {
    throw new Error('Session Not Available');
  }

  sessionStorage.setItem('data', JSON.stringify(data));
}

export function clear() {
  if (!sessionStorage) {
    throw new Error('Session Not Available');
  }

  sessionStorage.clear();
}

export function remove(key) {
  const data = get();

  delete data[key];

  save(data);
}
