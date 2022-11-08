export async function getCharacterList() {
  try {
    const response = await fetch('l2d.json');
    const json = await response.json();
    json.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    return json;
  } catch (error) {
    return Promise.reject(error);
  }
}
